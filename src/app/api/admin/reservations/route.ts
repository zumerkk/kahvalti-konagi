import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { toDbDate } from "@/lib/reservation-rules";

export const runtime = "nodejs";

const QuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  serviceType: z.enum(["BREAKFAST", "CAFE"]).optional(),
  areaId: z.string().min(1).optional(),
  status: z.enum(["BOOKED", "CANCELLED"]).optional(),
  tableId: z.string().min(1).optional(),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || (Number.isFinite(v) && v > 0), {
      message: "limit geçersiz",
    })
    .transform((v) => (v === undefined ? undefined : Math.min(Math.max(1, Math.floor(v)), 500))),
});

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const url = new URL(req.url);
  const parsed = QuerySchema.safeParse({
    date: url.searchParams.get("date") ?? undefined,
    serviceType: url.searchParams.get("serviceType") ?? undefined,
    areaId: url.searchParams.get("areaId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    tableId: url.searchParams.get("tableId") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Sorgu parametreleri geçersiz.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { date, serviceType, areaId, status, tableId } = parsed.data;
  const limit = parsed.data.limit ?? 200;

  const where: Record<string, unknown> = {};
  if (date) where.date = toDbDate(date);
  if (serviceType) where.serviceType = serviceType;
  if (areaId) where.areaId = areaId;
  if (status) where.status = status;
  if (tableId) where.tableId = tableId;

  const reservations = await prisma.reservation.findMany({
    where,
    orderBy: [{ date: "desc" }, { time: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      status: true,
      serviceType: true,
      date: true,
      time: true,
      partySize: true,
      fullName: true,
      phone: true,
      tcknLast4: true,
      note: true,
      totalAmount: true,
      createdAt: true,
      updatedAt: true,
      area: { select: { id: true, title: true, code: true } },
      table: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, reservations });
}

