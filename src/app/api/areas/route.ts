import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 3600; // API Cache (1 hour)

export async function GET() {
  try {
    const areas = await prisma.area.findMany({
      where: { isActive: true },
      select: { id: true, code: true, title: true },
      orderBy: { title: "asc" },
    });
    return NextResponse.json({ ok: true, areas });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Alanlar yüklenirken bir hata oluştu." },
      { status: 500 },
    );
  }
}
