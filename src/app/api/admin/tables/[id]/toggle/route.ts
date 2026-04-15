import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;

  const table = await prisma.table.findUnique({ where: { id }, select: { isActive: true } });
  if (!table) {
    return NextResponse.json({ ok: false, error: "Masa bulunamadı." }, { status: 404 });
  }

  await prisma.table.update({ where: { id }, data: { isActive: !table.isActive } });
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/admin/masalar", url.origin));
}

