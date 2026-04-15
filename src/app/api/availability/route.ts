import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAllowedDate, isAllowedTime, toDbDate } from "@/lib/reservation-rules";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const date = url.searchParams.get("date") ?? "";
  const time = url.searchParams.get("time") ?? "";

  if (!date || !time) {
    return NextResponse.json(
      { ok: false, error: "date ve time zorunlu." },
      { status: 400 },
    );
  }
  if (!isAllowedDate(date)) {
    return NextResponse.json(
      { ok: false, error: "Sadece hafta sonu rezervasyon alınmaktadır." },
      { status: 400 },
    );
  }
  if (!isAllowedTime(time)) {
    return NextResponse.json(
      { ok: false, error: "Saat aralığı 08:00-14:00 (30 dk slot) olmalıdır." },
      { status: 400 },
    );
  }

  const closed = await prisma.closedDate.findUnique({
    where: { date: toDbDate(date) },
  });
  if (closed) {
    return NextResponse.json({
      ok: true,
      closed: true,
      reason: closed.reason ?? null,
      tables: [],
    });
  }

  const [tables, reservations] = await Promise.all([
    prisma.table.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.reservation.findMany({
      where: {
        date: toDbDate(date),
        time,
        status: "BOOKED",
      },
      select: { tableId: true },
    }),
  ]);

  const reserved = new Set(reservations.map((r) => r.tableId));
  const available = tables.filter((t) => !reserved.has(t.id));

  return NextResponse.json({ ok: true, closed: false, tables: available });
}

