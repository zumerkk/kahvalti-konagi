import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { encryptPII } from "@/lib/crypto";
import { isAllowedDate, isAllowedTime, toDbDate } from "@/lib/reservation-rules";

export const runtime = "nodejs";

const ReservationCreateSchema = z.object({
  serviceType: z.enum(["BREAKFAST", "CAFE"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  areaId: z.string().min(1),
  tableId: z.string().min(1),
  fullName: z.string().min(2).max(120),
  phone: z.string().min(8).max(20),
  tckn: z.string().regex(/^\d{11}$/),
  partySize: z.coerce.number().int().min(1).max(4),
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

  const { serviceType, areaId, date, time, tableId, fullName, phone, tckn, partySize } =
    parsed.data;
  const note = parsed.data.note?.trim() ? parsed.data.note.trim() : null;

  if (!isAllowedDate(date)) {
    return NextResponse.json(
      { ok: false, error: "Tarih geçersiz." },
      { status: 400 },
    );
  }
  if (!isAllowedTime(serviceType, time)) {
    return NextResponse.json(
      { ok: false, error: "Seçilen servis için saat aralığı geçersiz." },
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
    where: { id: tableId, isActive: true, areaId },
    select: { id: true, areaId: true },
  });
  if (!table) {
    return NextResponse.json(
      { ok: false, error: "Seçilen masa bulunamadı, aktif değil veya alana ait değil." },
      { status: 400 },
    );
  }

  try {
    const tcknEncrypted = encryptPII(tckn);
    const tcknLast4 = tckn.slice(-4);

    const totalAmount =
      serviceType === "BREAKFAST"
        ? (
            await prisma.settings.upsert({
              where: { id: "singleton" },
              update: {},
              create: { id: "singleton", breakfastPricePerPerson: 350 },
              select: { breakfastPricePerPerson: true },
            })
          ).breakfastPricePerPerson * partySize
        : null;

    const reservation = await prisma.reservation.create({
      data: {
        serviceType,
        date: toDbDate(date),
        time,
        areaId,
        tableId,
        fullName,
        phone,
        tcknEncrypted,
        tcknLast4,
        partySize,
        totalAmount,
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
