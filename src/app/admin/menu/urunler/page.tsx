import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMenuProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      category: {
        select: { name: true }
      }
    }
  });
  
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <UtensilsCrossed className="h-6 w-6 text-amber-400" />
            Menü / Ürünler
          </h1>
          <p className="mt-1 text-sm text-white/40">{products.length} ürün kayıtlı</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <Link href="/admin/menu/kategoriler" className="text-amber-400 hover:text-amber-300">← Kategoriler</Link>
          <span>·</span>
          <span className="text-white font-medium">Ürünler</span>
        </div>
      </div>

      <ProductClient initialProducts={products} categories={categories} />
    </div>
  );
}
