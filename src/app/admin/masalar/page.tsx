import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { TablesForm } from "@/components/admin/TablesForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTablesPage() {
  const tables = await prisma.table.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, isActive: true, createdAt: true },
  });

  return (
    <div>
      <AdminTopbar
        title="Masalar"
        description="Yeni masa ekleyin/kaldırın. Aktif olmayan masalar rezervasyon ekranında görünmez."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Yeni Masa</div>
          <div className="mt-4">
            <TablesForm />
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Kayıtlı Masalar</div>
          <div className="mt-4 space-y-2">
            {tables.length === 0 ? (
              <div className="text-sm text-white/60">Kayıt yok.</div>
            ) : (
              tables.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-white">{t.name}</div>
                    {t.isActive ? (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                        Pasif
                      </span>
                    )}
                  </div>
                  <form action={`/api/admin/tables/${t.id}/toggle`} method="post">
                    <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10">
                      {t.isActive ? "Pasif Yap" : "Aktif Yap"}
                    </button>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
