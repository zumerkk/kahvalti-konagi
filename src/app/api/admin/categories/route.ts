import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

export const runtime = "nodejs";

const UpsertSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(2).max(80),
  description: z.string().max(300).optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional().default(0),
  isActive: z.coerce.boolean().optional().default(true),
});

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      description: true,
      sortOrder: true,
      isActive: true,
      _count: { select: { products: true } },
    },
  });

  return NextResponse.json({ ok: true, categories });
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

  try {
    if (parsed.data.id) {
      await prisma.category.update({
        where: { id: parsed.data.id },
        data: {
          name,
          description,
          sortOrder: parsed.data.sortOrder,
          isActive: parsed.data.isActive,
        },
      });
    } else {
      await prisma.category.create({
        data: {
          name,
          description,
          sortOrder: parsed.data.sortOrder,
          isActive: parsed.data.isActive,
        },
      });
    }
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { ok: false, error: "Bu kategori adı zaten kayıtlı." },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "Kaydedilemedi." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}

