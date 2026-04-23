import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { MenuCategoriesManager } from "@/components/admin/MenuCategoriesManager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMenuCategoriesPage() {
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

  const initialCategories = categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    sortOrder: c.sortOrder,
    isActive: c.isActive,
    productsCount: c._count.products,
  }));

  return (
    <div>
      <AdminTopbar
        title="Menü / Kategoriler"
        description="Kategori ekleyin/güncelleyin. Pasif kategoriler ürün seçimi ve menüde görünmez."
      />

      <div className="mb-6 flex items-center gap-4 text-sm text-white/70">
        <span className="text-white">Kategoriler</span>
        <Link href="/admin/menu/urunler" className="hover:text-white">
          Ürünler
        </Link>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <MenuCategoriesManager initialCategories={initialCategories} />
      </div>
    </div>
  );
}

