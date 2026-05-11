import { NextResponse } from "next/server";
import { z } from "zod";
import { toDbDate } from "@/lib/reservation-rules";
import { prisma } from "@/lib/prisma";
import { encryptPII } from "@/lib/crypto";
import { logAudit } from "@/lib/audit-logger";

export const runtime = "nodejs";

const AdminReservationCreateSchema = z.object({
  serviceType: z.enum(["BREAKFAST", "CAFE"]),
  source: z.enum(["PHONE", "WHATSAPP", "INSTAGRAM", "WALK_IN", "ADMIN", "OTHER"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  areaId: z.string().min(1),
  tableId: z.string().min(1),
  fullName: z.string().min(2).max(120),
  phone: z.string().max(20).optional().or(z.literal("")),
  tckn: z.string().max(11).optional().or(z.literal("")),
  partySize: z.coerce.number().int().min(1),
  note: z.string().max(500).optional().or(z.literal("")),
  status: z.enum([
    "PENDING", "CONFIRMED", "ARRIVED", "SEATED", 
    "COMPLETED", "CANCELLED", "NO_SHOW", "POSTPONED", 
    "DEPOSIT_PENDING", "DEPOSIT_RECEIVED"
  ]).default("CONFIRMED"),
});

export async function POST(req: Request) {
  // Authentication handled by middleware for /api/admin/*
  const body = await req.json().catch(() => null);
  const parsed = AdminReservationCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Form verileri geçersiz.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { serviceType, source, areaId, date, time, tableId, fullName, phone, tckn, partySize, status } = parsed.data;
  const note = parsed.data.note?.trim() ? parsed.data.note.trim() : null;

  const dbDate = toDbDate(date);

  const tcknEncrypted = tckn ? encryptPII(tckn) : null;
  const tcknLast4 = tckn ? tckn.slice(-4) : null;

  try {
    const reservation = await prisma.reservation.create({
      data: {
        serviceType,
        source,
        date: dbDate,
        time,
        areaId,
        tableId,
        fullName,
        phone: phone || "",
        tcknEncrypted,
        tcknLast4,
        partySize,
        note,
        status,
      },
      include: {
        table: { select: { name: true } }
      }
    });

    await logAudit("RESERVATION", reservation.id, "CREATE", { source, status }, "ADMIN");

    return NextResponse.json({
      ok: true,
      reservation,
    });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { ok: false, error: "Bu masa aynı saatte başkası tarafından rezerve edilmiş (Çakışma)." },
        { status: 409 },
      );
    }
    console.error("Admin Reservation Error:", error);
    return NextResponse.json(
      { ok: false, error: "Rezervasyon oluşturulurken bir hata oluştu." },
      { status: 500 },
    );
  }
}
