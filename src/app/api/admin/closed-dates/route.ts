import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { toDbDate } from "@/lib/reservation-rules";

export const runtime = "nodejs";

const Schema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().max(120).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Veriler geçersiz." }, { status: 400 });
  }
  const reason = parsed.data.reason?.trim() ? parsed.data.reason.trim() : null;

  await prisma.closedDate.upsert({
    where: { date: toDbDate(parsed.data.date) },
    update: { reason },
    create: { date: toDbDate(parsed.data.date), reason },
  });

  return NextResponse.json({ ok: true });
}

