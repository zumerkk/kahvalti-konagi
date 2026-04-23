import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";

const SettingsUpdateSchema = z.object({
  breakfastPricePerPerson: z.coerce.number().int().min(0).max(1_000_000),
});

async function ensureSettings() {
  return prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", breakfastPricePerPerson: 350 },
    select: { breakfastPricePerPerson: true },
  });
}

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const settings = await ensureSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = SettingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Veriler geçersiz." }, { status: 400 });
  }

  const settings = await prisma.settings.upsert({
    where: { id: "singleton" },
    update: { breakfastPricePerPerson: parsed.data.breakfastPricePerPerson },
    create: {
      id: "singleton",
      breakfastPricePerPerson: parsed.data.breakfastPricePerPerson,
    },
    select: { breakfastPricePerPerson: true },
  });

  return NextResponse.json({ ok: true, settings });
}

