import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";

const Schema = z.object({
  name: z.string().min(2).max(40),
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

  const name = parsed.data.name.trim();
  if (!name) return NextResponse.json({ ok: false, error: "Masa adı boş olamaz." }, { status: 400 });

  try {
    await prisma.table.create({ data: { name, isActive: true } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Bu masa adı zaten var." },
      { status: 409 },
    );
  }
}

