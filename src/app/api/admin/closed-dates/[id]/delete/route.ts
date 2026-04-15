import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const { id } = await params;
  await prisma.closedDate.delete({ where: { id } }).catch(() => null);
  // admin sayfası POST form ile geldiği için redirect iyi
  const url = new URL(req.url);
  return NextResponse.redirect(new URL("/admin/kapali-gunler", url.origin));
}

