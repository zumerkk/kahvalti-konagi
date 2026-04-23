import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function ensureAreas() {
  await Promise.all([
    prisma.area.upsert({
      where: { code: "SALON" },
      update: {},
      create: { code: "SALON", title: "Salon", isActive: true },
    }),
    prisma.area.upsert({
      where: { code: "CAMEKAN" },
      update: {},
      create: { code: "CAMEKAN", title: "Camekan", isActive: true },
    }),
  ]);
}

export async function GET() {
  await ensureAreas();

  const areas = await prisma.area.findMany({
    where: { isActive: true },
    orderBy: [{ title: "asc" }],
    select: { id: true, code: true, title: true },
  });

  return NextResponse.json({ ok: true, areas });
}

