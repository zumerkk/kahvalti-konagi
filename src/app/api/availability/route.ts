import { NextResponse } from "next/server";
import { isAllowedDate, isAllowedTime, toDbDate } from "@/lib/reservation-rules";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type ServiceType = "BREAKFAST" | "CAFE";

function isServiceType(v: string): v is ServiceType {
  return v === "BREAKFAST" || v === "CAFE";
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const serviceTypeRaw = url.searchParams.get("serviceType") ?? "";
  const date = url.searchParams.get("date") ?? "";
  const time = url.searchParams.get("time") ?? "";
  const areaId = url.searchParams.get("areaId") ?? "";

  if (!serviceTypeRaw || !date || !time || !areaId) {
    return NextResponse.json(
      { ok: false, error: "serviceType, date, time ve areaId zorunlu." },
      { status: 400 },
    );
  }
  if (!isServiceType(serviceTypeRaw)) {
    return NextResponse.json(
      { ok: false, error: "serviceType sadece BREAKFAST veya CAFE olabilir." },
      { status: 400 },
    );
  }

  if (!isAllowedDate(date)) {
    return NextResponse.json(
      { ok: false, error: "Tarih geçersiz." },
      { status: 400 },
    );
  }
  if (!isAllowedTime(serviceTypeRaw, time)) {
    return NextResponse.json(
      { ok: false, error: "Seçilen servis için saat aralığı geçersiz." },
      { status: 400 },
    );
  }

  // Kapalı gün kontrolü
  const closedDay = await prisma.closedDate.findUnique({
    where: { date: toDbDate(date) }
  });
  if (closedDay) {
    return NextResponse.json({ ok: true, closed: true, reason: closedDay.reason || "Kapalı gün", tables: [] });
  }

  // Masaları getir
  const allTables = await prisma.table.findMany({
    where: { areaId, isActive: true },
    select: { id: true, name: true }
  });

  // Dolu masaları bul
  const bookedReservations = await prisma.reservation.findMany({
    where: {
      serviceType: serviceTypeRaw as ServiceType,
      date: toDbDate(date),
      areaId,
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
    select: { tableId: true, time: true }
  });

  // time-slots isTimeOverlap fonksiyonu eklendiği için import edelim
  const { isTimeOverlap } = await import("@/lib/time-slots");

  const bookedIds = bookedReservations
    .filter((r) => isTimeOverlap(r.time, time))
    .map((r) => r.tableId);
  
  const available = allTables.filter((t) => !bookedIds.includes(t.id));

  return NextResponse.json({ ok: true, closed: false, tables: available });
}
