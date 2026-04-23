import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { MenuProductsManager } from "@/components/admin/MenuProductsManager";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminMenuProductsPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true, isActive: true, sortOrder: true },
  });

  return (
    <div>
      <AdminTopbar
        title="Menü / Ürünler"
        description="Ürün ekleyin/güncelleyin. Stok güncellemesi hızlı düzenleme alanından yapılır."
      />

      <div className="mb-6 flex items-center gap-4 text-sm text-white/70">
        <Link href="/admin/menu/kategoriler" className="hover:text-white">
          Kategoriler
        </Link>
        <span className="text-white">Ürünler</span>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        {categories.length === 0 ? (
          <div className="space-y-3 text-sm text-white/70">
            <div>Önce en az bir kategori oluşturun.</div>
            <Link href="/admin/menu/kategoriler" className="text-amber-300 hover:text-amber-200">
              Kategori oluştur →
            </Link>
          </div>
        ) : (
          <MenuProductsManager categories={categories} />
        )}
      </div>
    </div>
  );
}

