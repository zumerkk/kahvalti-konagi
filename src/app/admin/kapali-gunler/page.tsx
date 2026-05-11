import { CalendarOff, Plus, Trash2, AlertTriangle } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const demoClosed = [
  { id: "1", date: "2026-05-01", reason: "1 Mayıs — İşçi Bayramı" },
  { id: "2", date: "2026-05-19", reason: "Atatürk'ü Anma, Gençlik ve Spor Bayramı" },
  { id: "3", date: "2026-06-28", reason: "Bayram hazırlığı (kapalı)" },
];

export default function AdminClosedDatesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <CalendarOff className="h-6 w-6 text-red-400" />
          Kapalı Günler
        </h1>
        <p className="mt-1 text-sm text-white/40">
          Kapalı günlerde rezervasyon sistemi otomatik kapanır
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* New closed date form */}
        <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Plus className="h-4 w-4 text-red-400" />
            Yeni Kapalı Gün
          </div>
          <div className="mt-4 space-y-3">
            <input type="date" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-red-500/30" />
            <input type="text" placeholder="Sebep (isteğe bağlı)" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-red-500/30" />
            <button className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 py-2.5 text-sm font-bold text-white shadow-md shadow-red-500/20 transition hover:shadow-red-500/30">
              Kapalı Gün Ekle
            </button>
          </div>
          <p className="mt-3 text-[10px] text-white/25">Demo modunda ekleme devre dışıdır.</p>
        </div>

        {/* Closed dates list */}
        <div className="space-y-3 lg:col-span-2">
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="font-medium">Kapalı gün eklendiğinde o güne ait mevcut rezervasyonlar otomatik iptal edilmez. Lütfen kontrol edin.</span>
            </div>
          </div>

          {demoClosed.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 text-center text-sm text-white/30">
              Kayıtlı kapalı gün yok
            </div>
          ) : (
            demoClosed.map((c) => (
              <div
                key={c.id}
                className="group flex items-center justify-between rounded-2xl border border-white/[0.06] bg-gradient-to-r from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-red-500/15"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <CalendarOff className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{c.date}</div>
                    {c.reason && <div className="mt-0.5 text-xs text-white/40">{c.reason}</div>}
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 opacity-0 transition group-hover:opacity-100 hover:bg-red-500/20">
                  <Trash2 className="h-3 w-3" />
                  Sil
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
