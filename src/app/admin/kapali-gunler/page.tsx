import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { ClosedDatesForm } from "@/components/admin/ClosedDatesForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminClosedDatesPage() {
  const closed = await prisma.closedDate.findMany({
    orderBy: { date: "desc" },
    take: 120,
  });

  return (
    <div>
      <AdminTopbar
        title="Kapalı Günler"
        description="Kapalı gün ekleyin/kaldırın. Bu değişiklikler anında rezervasyon sistemini etkiler."
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Yeni Kapalı Gün</div>
          <div className="mt-4">
            <ClosedDatesForm />
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold">Kayıtlı Kapalı Günler</div>
          <div className="mt-4 space-y-2">
            {closed.length === 0 ? (
              <div className="text-sm text-white/60">Kayıt yok.</div>
            ) : (
              closed.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
                >
                  <div>
                    <div className="text-white">{c.date.toISOString().slice(0, 10)}</div>
                    {c.reason ? <div className="text-xs text-white/60">{c.reason}</div> : null}
                  </div>
                  <form action={`/api/admin/closed-dates/${c.id}/delete`} method="post">
                    <button className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10">
                      Sil
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
