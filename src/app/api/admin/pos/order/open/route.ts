import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit-logger";
import { toDbDate } from "@/lib/reservation-rules";
import { format } from "date-fns";

export const runtime = "nodejs";

// Bir masada adisyon açar.
//  - Masada bugün aktif rezervasyon varsa: onu SEATED yapıp adisyonu ona bağlar.
//  - Yoksa: walk-in "Misafir" rezervasyonu + adisyon açar.
//  - Zaten açık adisyon varsa onu döner (idempotent).
const OpenSchema = z.object({
  tableId: z.string().min(1),
  areaId: z.string().min(1),
  partySize: z.coerce.number().int().min(1).default(1),
  serviceType: z.enum(["BREAKFAST", "CAFE"]).default("CAFE"),
});

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = OpenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const { tableId, areaId, partySize, serviceType } = parsed.data;
  const now = new Date();
  const dbDate = toDbDate(format(now, "yyyy-MM-dd"));
  const timeStr = format(now, "HH:mm");

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Zaten açık adisyon var mı?
      const openOrder = await tx.order.findFirst({
        where: { tableId, status: "OPEN" },
        include: { items: { include: { product: true } }, payments: true },
      });
      if (openOrder) return { order: openOrder, reused: true };

      // Bugün masaya ait aktif rezervasyon
      const activeRes = await tx.reservation.findFirst({
        where: { tableId, date: dbDate, status: { in: ["PENDING", "CONFIRMED", "ARRIVED", "SEATED"] } },
        orderBy: { time: "asc" },
      });

      let reservationId: string;
      if (activeRes) {
        await tx.reservation.update({ where: { id: activeRes.id }, data: { status: "SEATED" } });
        reservationId = activeRes.id;
      } else {
        const walkIn = await tx.reservation.create({
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
            status: "SEATED",
          },
        });
        reservationId = walkIn.id;
      }

      const order = await tx.order.create({
        data: { tableId, reservationId, status: "OPEN", totalAmount: 0 },
        include: { items: { include: { product: true } }, payments: true },
      });

      return { order, reused: false, walkIn: !activeRes };
    });

    if (!result.reused) {
      await logAudit("ORDER", result.order.id, "CREATE", { tableId, walkIn: result.walkIn ?? false }, "ADMIN");
    }
    return NextResponse.json({ ok: true, data: result.order, reused: result.reused });
  } catch (error: any) {
    console.error("Order open error:", error);
    return NextResponse.json({ ok: false, error: error.message || "Masa açılamadı." }, { status: 400 });
  }
}
