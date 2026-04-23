import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAllowedDate, isAllowedTime, toDbDate } from "@/lib/reservation-rules";

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

  const serviceType: ServiceType = serviceTypeRaw;
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
    select: { reason: true },
  });
  if (closed) {
    return NextResponse.json({ ok: true, closed: true, reason: closed.reason ?? null, tables: [] });
  }

  const [tables, reservations] = await Promise.all([
    prisma.table.findMany({
      where: { isActive: true, areaId },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.reservation.findMany({
      where: {
        serviceType,
        date: toDbDate(date),
        time,
        status: "BOOKED",
        table: { areaId },
      },
      select: { tableId: true },
    }),
  ]);

  const reserved = new Set(reservations.map((r) => r.tableId));
  const available = tables.filter((t) => !reserved.has(t.id));

  return NextResponse.json({ ok: true, closed: false, tables: available });
}
