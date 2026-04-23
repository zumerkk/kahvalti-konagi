import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { encryptPII } from "@/lib/crypto";
import { isAllowedDate, isAllowedTime, toDbDate } from "@/lib/reservation-rules";

export const runtime = "nodejs";

const ReservationCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  tableId: z.string().min(1),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
  tckn: z.string().regex(/^\d{11}$/),
  partySize: z.coerce.number().int().min(1).max(30),
  note: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = ReservationCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Form verileri geçersiz.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { date, time, tableId, fullName, phone, tckn, partySize } = parsed.data;
  const note = parsed.data.note?.trim() ? parsed.data.note.trim() : null;

  if (!isAllowedDate(date)) {
    return NextResponse.json(
      { ok: false, error: "Sadece hafta sonu rezervasyon alınmaktadır." },
      { status: 400 },
    );
  }
  if (!isAllowedTime("BREAKFAST", time)) {
    return NextResponse.json(
      { ok: false, error: "Saat aralığı 08:00-14:00 (30 dk slot) olmalıdır." },
      { status: 400 },
    );
  }

  const closed = await prisma.closedDate.findUnique({
    where: { date: toDbDate(date) },
  });
  if (closed) {
    return NextResponse.json(
      { ok: false, error: "Seçtiğiniz gün kapalı." },
      { status: 400 },
    );
  }

  const table = await prisma.table.findFirst({
    where: { id: tableId, isActive: true },
    select: { id: true },
  });
  if (!table) {
    return NextResponse.json(
      { ok: false, error: "Seçilen masa bulunamadı veya aktif değil." },
      { status: 400 },
    );
  }

  try {
    const tcknEncrypted = encryptPII(tckn);
    const tcknLast4 = tckn.slice(-4);

    const reservation = await prisma.reservation.create({
      data: {
        date: toDbDate(date),
        time,
        tableId,
        fullName,
        phone,
        tcknEncrypted,
        tcknLast4,
        partySize,
        note,
      },
      select: {
        id: true,
        date: true,
        time: true,
        table: { select: { name: true } },
      },
    });

    return NextResponse.json({ ok: true, reservation });
  } catch (e: unknown) {
    // Prisma unique constraint
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json(
        { ok: false, error: "Bu masa ve saat dolu. Lütfen başka masa/saat seçin." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "Rezervasyon oluşturulamadı." },
      { status: 500 },
    );
  }
}
