import { CalendarCheck, Clock, Users, MapPin, Phone, StickyNote, ArrowRight } from "lucide-react";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const demoReservations: Array<{
  id: string;
  status: string;
  serviceType: string;
  date: string;
  time: string;
  partySize: number;
  fullName: string;
  phone: string;
  tcknLast4: string;
  note: string;
  table: string;
  area: string;
  createdAt: string;
}> = [];

export default function AdminReservationsWithFiltersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <CalendarCheck className="h-6 w-6 text-amber-400" />
            Rezervasyonlar
          </h1>
          <p className="mt-1 text-sm text-white/40">Tüm rezervasyonları görüntüleyin ve yönetin</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-white/40 uppercase">Tarih</label>
            <input type="date" defaultValue="2026-04-26" className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-500/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-white/40 uppercase">Servis</label>
            <select className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-500/30">
              <option>Tümü</option><option>Kahvaltı</option><option>Kafe</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-white/40 uppercase">Alan</label>
            <select className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-500/30">
              <option>Tümü</option><option>Salon</option><option>Bahçe</option><option>VIP</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-semibold tracking-wider text-white/40 uppercase">Durum</label>
            <select className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-500/30">
              <option>Tümü</option><option>Aktif</option><option>İptal</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-white/30">{demoReservations.length} kayıt bulundu</span>
          <button className="rounded-xl bg-amber-500/15 px-4 py-2 text-xs font-semibold text-amber-400 transition hover:bg-amber-500/25">
            Filtrele
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-gradient-to-r from-amber-500/[0.06] to-transparent">
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Misafir</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Tarih/Saat</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Servis</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Alan / Masa</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Kişi</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Telefon</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Durum</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {demoReservations.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-white">{r.fullName}</div>
                    <div className="mt-0.5 text-[10px] text-white/30">TCKN: ****{r.tcknLast4}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-white/70">
                      <Clock className="h-3 w-3 text-white/30" />
                      {r.date} · {r.time}
                    </div>
                    <div className="mt-0.5 text-[10px] text-white/25">Kayıt: {r.createdAt}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-lg px-2 py-1 text-xs font-medium ${r.serviceType === "BREAKFAST" ? "bg-amber-500/10 text-amber-400" : "bg-violet-500/10 text-violet-400"}`}>
                      {r.serviceType === "BREAKFAST" ? "☀️ Kahvaltı" : "☕ Kafe"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/60">{r.area} · {r.table}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1 text-white/60">
                      <Users className="h-3 w-3 text-white/30" />{r.partySize}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/50">{r.phone}</td>
                  <td className="px-5 py-3.5">
                    {r.status === "BOOKED" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-400">
                        İptal
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {r.status === "BOOKED" && (
                      <button className="rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-1 text-xs text-red-400 transition hover:bg-red-500/20">
                        İptal Et
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
