import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-logger";
import { toDbDate } from "@/lib/reservation-rules";
import { format } from "date-fns";

export const runtime = "nodejs";

const WalkInSchema = z.object({
  tableId: z.string().min(1),
  areaId: z.string().min(1),
  partySize: z.coerce.number().int().min(1).default(1),
  serviceType: z.enum(["BREAKFAST", "CAFE"]).default("CAFE"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = WalkInSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const { tableId, areaId, partySize, serviceType } = parsed.data;

  // Şu anki tarih ve saati al (Sunucu saati - yerel saate göre ayarlanmalı)
  const now = new Date();
  const dateStr = format(now, "yyyy-MM-dd");
  const timeStr = format(now, "HH:mm");
  const dbDate = toDbDate(dateStr);

  try {
    // Transaction ile çakışmaları önle ve masayı dolu işaretle
    const result = await prisma.$transaction(async (tx) => {
      // Çakışma var mı kontrol et
      const existing = await tx.reservation.findFirst({
        where: {
          tableId,
          date: dbDate,
          time: timeStr,
          status: { in: ["PENDING", "CONFIRMED", "ARRIVED", "SEATED"] }
        }
      });

      if (existing) {
        throw new Error("Masa şu anda dolu veya rezerve.");
      }

      // Rezervasyon oluştur (Misafir - Walk-In)
      const reservation = await tx.reservation.create({
        data: {
          serviceType,
          source: "WALK_IN",
          date: dbDate,
          time: timeStr,
          areaId,
          tableId,
          fullName: "Misafir",
          phone: "",
          partySize,
          status: "SEATED", // Direkt oturdu
        }
      });

      // Hemen bir sipariş (Adisyon) aç
      const order = await tx.order.create({
        data: {
          tableId,
          reservationId: reservation.id,
          status: "OPEN",
          totalAmount: 0
        }
      });

      return { reservation, order };
    });

    await logAudit("RESERVATION", result.reservation.id, "CREATE", { source: "WALK_IN", status: "SEATED", orderId: result.order.id }, "ADMIN");

    return NextResponse.json({ ok: true, data: result });
  } catch (error: any) {
    console.error("Walk-in error:", error);
    return NextResponse.json({ ok: false, error: error.message || "İşlem başarısız." }, { status: 400 });
  }
}
