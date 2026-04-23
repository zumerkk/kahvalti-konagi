import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

export const runtime = "nodejs";

const PriceSchema = z.preprocess(
  (v) => (v === "" || v === undefined ? null : v),
  z.coerce.number().int().nonnegative().nullable(),
);

const StockQtySchema = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : v),
  z.coerce.number().int().min(0).max(1_000_000),
);

const UpsertSchema = z.object({
  id: z.string().min(1).optional(),
  categoryId: z.string().min(1),
  name: z.string().min(2).max(120),
  description: z.string().max(600).optional().or(z.literal("")),
  priceCents: PriceSchema.optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
  isActive: z.coerce.boolean().optional().default(true),
  stockQty: StockQtySchema.optional(),
});

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const url = new URL(req.url);
  const categoryId = url.searchParams.get("categoryId")?.trim() || null;

  const products = await prisma.product.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      categoryId: true,
      name: true,
      description: true,
      priceCents: true,
      stockQty: true,
      sortOrder: true,
      isActive: true,
      category: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, products });
}

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = UpsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Veriler geçersiz." }, { status: 400 });
  }

  const name = parsed.data.name.trim();
  const description = parsed.data.description?.trim() ? parsed.data.description.trim() : null;

  const data: Record<string, unknown> = {
    categoryId: parsed.data.categoryId,
    name,
    description,
    priceCents: parsed.data.priceCents ?? null,
    sortOrder: parsed.data.sortOrder,
    isActive: parsed.data.isActive,
  };
  if (typeof parsed.data.stockQty === "number") data.stockQty = parsed.data.stockQty;

  try {
    if (parsed.data.id) {
      await prisma.product.update({
        where: { id: parsed.data.id },
        data: data as Prisma.ProductUpdateInput,
      });
    } else {
      await prisma.product.create({
        data: data as Prisma.ProductCreateInput,
      });
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2003") {
      return NextResponse.json(
        { ok: false, error: "Kategori bulunamadı." },
        { status: 400 },
      );
    }
    return NextResponse.json({ ok: false, error: "Kaydedilemedi." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
