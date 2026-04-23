import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function ensureSettings() {
  return prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", breakfastPricePerPerson: 350 },
    select: { breakfastPricePerPerson: true },
  });
}

export async function GET() {
  const settings = await ensureSettings();
  return NextResponse.json({ ok: true, settings });
}

