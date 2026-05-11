import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  try {
    const [categories, products, tables] = await Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.table.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    // Format products: priceCents to price (lira)
    const formattedProducts = products.map((p) => ({
      id: p.id,
      categoryId: p.categoryId,
      name: p.name,
      description: p.description,
      imageUrl: p.imageUrl,
      price: p.priceCents ? p.priceCents / 100 : 0,
      stockQty: p.stockQty,
      inStock: p.stockQty > 0,
      barcode: "", // Barkod prisma'da yok gibi görünüyor, boş bırakabiliriz
    }));

    return NextResponse.json({
      ok: true,
      data: {
        categories,
        products: formattedProducts,
        tables,
      },
    });
  } catch (error) {
    console.error("POS API Error:", error);
    return NextResponse.json(
      { ok: false, error: "Veriler alınırken bir hata oluştu." },
      { status: 500 }
    );
  }
}
