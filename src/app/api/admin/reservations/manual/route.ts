import { NextResponse } from "next/server";
import { z } from "zod";
import { isAllowedDate, isAllowedTime, toDbDate } from "@/lib/reservation-rules";
import { prisma } from "@/lib/prisma";
import { encryptPII } from "@/lib/crypto";
import { logAudit } from "@/lib/audit-logger";
import { isAdminRequest } from "@/lib/auth";
import { isTimeOverlap } from "@/lib/time-slots";
import { Prisma } from "@/generated/prisma/client";

export const runtime = "nodejs";

const ACTIVE_RESERVATION_STATUSES = [
  "PENDING",
  "BOOKED",
  "CONFIRMED",
  "ARRIVED",
  "SEATED",
  "DEPOSIT_PENDING",
  "DEPOSIT_RECEIVED",
] as const;

const AdminReservationCreateSchema = z.object({
  serviceType: z.enum(["BREAKFAST", "CAFE"]),
  source: z.enum(["PHONE", "WHATSAPP", "INSTAGRAM", "WALK_IN", "ADMIN", "OTHER"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  areaId: z.string().min(1),
  tableId: z.string().optional().or(z.literal("auto")).or(z.literal("")),
  fullName: z.string().min(2).max(120),
  phone: z.string().max(20).optional().or(z.literal("")),
  tckn: z.string().regex(/^\d{11}$/).optional().or(z.literal("")),
  partySize: z.coerce.number().int().min(1),
  note: z.string().max(500).optional().or(z.literal("")),
  status: z.enum([
    "PENDING", "CONFIRMED", "ARRIVED", "SEATED", 
    "COMPLETED", "CANCELLED", "NO_SHOW", "POSTPONED", 
    "DEPOSIT_PENDING", "DEPOSIT_RECEIVED"
  ]).default("CONFIRMED"),
});

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = AdminReservationCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Form verileri geçersiz.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { serviceType, source, areaId, date, time, tableId, fullName, phone, tckn, partySize, status } = parsed.data;
  const cleanedFullName = fullName.trim();
  const cleanedPhone = phone?.trim() || "";
  const note = parsed.data.note?.trim() ? parsed.data.note.trim() : null;

  if (!cleanedFullName) {
    return NextResponse.json({ ok: false, error: "Ad soyad zorunlu." }, { status: 400 });
  }

  if (!isAllowedDate(date)) {
    return NextResponse.json({ ok: false, error: "Tarih geçersiz." }, { status: 400 });
  }

  if (!isAllowedTime(serviceType, time)) {
    return NextResponse.json(
      { ok: false, error: "Seçilen servis için saat aralığı geçersiz." },
      { status: 400 },
    );
  }

  const dbDate = toDbDate(date);

  try {
    const [settings, closedDay] = await Promise.all([
      prisma.settings.findUnique({ where: { id: "singleton" } }),
      prisma.closedDate.findUnique({ where: { date: dbDate } }),
    ]);

    if (closedDay) {
      return NextResponse.json(
        { ok: false, error: closedDay.reason || "Seçilen gün kapalı." },
        { status: 400 },
      );
    }

    const maxPartySize = settings?.maxPartySize ?? 12;
    const minPartySize = settings?.minPartySize ?? 1;
    if (partySize < minPartySize || partySize > maxPartySize) {
      return NextResponse.json(
        { ok: false, error: `Kişi sayısı ${minPartySize}-${maxPartySize} aralığında olmalı.` },
        { status: 400 },
      );
    }

    let resolvedTableId = tableId;

    if (!resolvedTableId || resolvedTableId === "auto") {
      // 1. Get all active tables in that area
      const allTables = await prisma.table.findMany({
        where: { areaId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: "asc" }
      });

      if (allTables.length === 0) {
        return NextResponse.json(
          { ok: false, error: "Seçtiğiniz alanda aktif bir masa bulunmamaktadır." },
          { status: 400 },
        );
      }

      // 2. Find all tables with overlapping active reservations on that date
      const overlappingReservations = await prisma.reservation.findMany({
        where: {
          serviceType,
          date: dbDate,
          areaId,
          status: { in: [...ACTIVE_RESERVATION_STATUSES] }
        },
        select: { tableId: true, time: true }
      });

      // 3. Filter out tables that overlap with the requested time
      const bookedTableIds = overlappingReservations
        .filter(res => isTimeOverlap(res.time, time))
        .map(res => res.tableId);

      // 4. Find the first table that is not booked
      const availableTable = allTables.find(t => !bookedTableIds.includes(t.id));
      if (!availableTable) {
        return NextResponse.json(
          { ok: false, error: "Seçtiğiniz tarih ve saatte bu alanda boş masamız kalmamıştır. Başka saat veya alan seçin." },
          { status: 409 },
        );
      }

      resolvedTableId = availableTable.id;
    } else {
      // Strict check for selected table
      const table = await prisma.table.findFirst({
        where: { id: resolvedTableId, areaId, isActive: true },
        select: { id: true, name: true },
      });

      if (!table) {
        return NextResponse.json(
          { ok: false, error: "Seçilen masa bu alanda bulunamadı veya pasif." },
          { status: 400 },
        );
      }

      const overlappingReservation = await prisma.reservation.findFirst({
        where: {
          serviceType,
          date: dbDate,
          tableId: resolvedTableId,
          status: { in: [...ACTIVE_RESERVATION_STATUSES] },
        },
        select: { time: true },
      });

      if (overlappingReservation && isTimeOverlap(overlappingReservation.time, time)) {
        return NextResponse.json(
          { ok: false, error: "Bu masa seçilen saat aralığında dolu. Başka saat veya masa seçin." },
          { status: 409 },
        );
      }
    }

    const cleanedTckn = tckn?.trim() || null;
    const tcknEncrypted = cleanedTckn ? encryptPII(cleanedTckn) : null;
    const tcknLast4 = cleanedTckn ? cleanedTckn.slice(-4) : null;
    const totalAmount =
      serviceType === "BREAKFAST" ? (settings?.breakfastPricePerPerson ?? 450) * partySize : null;

    const reservation = await prisma.reservation.create({
      data: {
        serviceType,
        source,
        date: dbDate,
        time,
        areaId,
        tableId: resolvedTableId,
        fullName: cleanedFullName,
        phone: cleanedPhone,
        tcknEncrypted,
        tcknLast4,
        partySize,
        note,
        status,
        totalAmount,
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
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
