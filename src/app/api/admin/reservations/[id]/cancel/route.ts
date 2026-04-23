import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, reservation });
  } catch {
    return NextResponse.json({ ok: false, error: "Rezervasyon bulunamadı." }, { status: 404 });
  }
}

