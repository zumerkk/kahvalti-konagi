import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";

const Schema = z.object({
  stockQty: z.coerce.number().int().min(0).max(1_000_000),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Veriler geçersiz." }, { status: 400 });
  }

  try {
    await prisma.product.update({
      where: { id },
      data: { stockQty: parsed.data.stockQty },
    });
  } catch {
    return NextResponse.json({ ok: false, error: "Ürün bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
