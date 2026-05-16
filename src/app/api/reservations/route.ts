import { NextResponse } from "next/server";
import { z } from "zod";
import { isAllowedDate, isAllowedTime, toDbDate } from "@/lib/reservation-rules";
import { prisma } from "@/lib/prisma";
import { encryptPII } from "@/lib/crypto";
import { logger, logAudit } from "@/lib/audit-logger";
import { rateLimit } from "@/lib/rate-limit";
import { Prisma } from "@/generated/prisma/client";

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
  partySize: z.coerce.number().int().min(1).max(20), // Max handled dynamically by settings
  note: z.string().max(500).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  // Rate limiting (5 istek / 1 dakika)
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success } = rateLimit(ip, 5, 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { ok: false, error: "Çok fazla istek gönderdiniz. Lütfen biraz bekleyin." },
      { status: 429 },
    );
  }

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

  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
  if (settings && !settings.onlineReservationsActive) {
    return NextResponse.json(
      { ok: false, error: "Şu anda online rezervasyon kabul edilmemektedir." },
      { status: 403 },
    );
  }

  const maxPartySize = settings?.maxPartySize ?? 4;
  if (partySize > maxPartySize) {
    return NextResponse.json(
      { ok: false, error: `Maksimum kişi sayısı ${maxPartySize} olabilir.` },
      { status: 400 },
    );
  }

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

  const dbDate = toDbDate(date);

  // Kapalı gün kontrolü
  const closedDay = await prisma.closedDate.findUnique({
    where: { date: dbDate }
  });
  if (closedDay) {
    return NextResponse.json(
      { ok: false, error: "Seçtiğiniz gün kapalı." },
      { status: 400 },
    );
  }

  const { isTimeOverlap } = await import("@/lib/time-slots");

  // Çakışma Kontrolü (Race condition engellemek için transaction veya strict check)
  const overlappingReservation = await prisma.reservation.findFirst({
    where: {
      serviceType,
      date: dbDate,
      tableId,
      status: {
        in: [
          "PENDING",
          "BOOKED",
          "CONFIRMED",
          "ARRIVED",
          "SEATED",
          "DEPOSIT_PENDING",
          "DEPOSIT_RECEIVED"
        ]
      }
    },
    select: { time: true }
  });

  if (overlappingReservation && isTimeOverlap(overlappingReservation.time, time)) {
    logger.warn("Rezervasyon çakışması engellendi", {
      requestedTime: time,
      existingTime: overlappingReservation.time,
      tableId,
      date: dbDate
    });
    return NextResponse.json(
      { ok: false, error: "Bu masa aynı saatte başkası tarafından rezerve edilmiş. Lütfen başka bir saat veya masa seçin." },
      { status: 409 },
    );
  }

  // TCKN Şifreleme
  const tcknEncrypted = encryptPII(tckn);
  const tcknLast4 = tckn.slice(-4);
  
  // Fiyat hesaplama
  const totalAmount = serviceType === "BREAKFAST" ? (settings?.breakfastPricePerPerson || 350) * partySize : null;

  try {
    // Veritabanına kaydet - Race condition P2002 ile engellenir
    const reservation = await prisma.reservation.create({
      data: {
        serviceType,
        source: "WEB",
        date: dbDate,
        time,
        areaId,
        tableId,
        fullName,
        phone,
        tcknEncrypted,
        tcknLast4,
        partySize,
        note,
        status: "PENDING",
        totalAmount,
      },
      include: {
        table: { select: { name: true } }
      }
    });

    await logAudit("RESERVATION", reservation.id, "CREATE", { source: "WEB", status: "PENDING" }, "SYSTEM");

    // Bildirim Sistemi (SMS)
    const { sendReservationSMS } = await import("@/lib/notifications");
    if (settings?.smsEnabled) {
      await sendReservationSMS(phone, {
        id: reservation.id,
        date,
        time,
        tableName: reservation.table.name
      });
    }

    return NextResponse.json({
      ok: true,
      reservation: {
        id: reservation.id,
        date,
        time,
        table: { name: reservation.table.name },
        totalAmount
      },
    });
  } catch (error) {
    // Prisma unique constraint violation code is P2002
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Bu masa aynı saatte başkası tarafından rezerve edilmiş. Lütfen başka bir saat veya masa seçin." },
        { status: 409 },
      );
    }
    console.error("Reservation Error:", error);
    return NextResponse.json(
      { ok: false, error: "Rezervasyon oluşturulurken bir hata oluştu." },
      { status: 500 },
    );
  }
}
