import Link from "next/link";
import { Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CategoryClient from "./CategoryClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMenuCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Layers className="h-6 w-6 text-violet-400" />
            Menü / Kategoriler
          </h1>
          <p className="mt-1 text-sm text-white/40">Kategori ekleyin ve düzenleyin</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-white/40">
          <span className="text-white font-medium">Kategoriler</span>
          <span>·</span>
          <Link href="/admin/menu/urunler" className="text-amber-400 hover:text-amber-300">Ürünler →</Link>
        </div>
      </div>

      <CategoryClient initialCategories={categories} />
    </div>
  );
}
