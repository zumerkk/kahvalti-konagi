import { prisma } from "@/lib/prisma";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmtDate(d: Date) {
  const iso = d.toISOString().slice(0, 10);
  return iso;
}

export default async function AdminReservationsPage() {
  const reservations = await prisma.reservation.findMany({
    orderBy: [{ date: "desc" }, { time: "desc" }],
    take: 200,
    select: {
      id: true,
      status: true,
      serviceType: true,
      date: true,
      time: true,
      partySize: true,
      fullName: true,
      phone: true,
      tcknLast4: true,
      note: true,
      table: { select: { name: true } },
      area: { select: { title: true } },
      createdAt: true,
    },
  });

  return (
    <div>
      <AdminTopbar
        title="Rezervasyonlar"
        description="En son 200 kayıt listelenir."
      />

      {/* Mobile: cards */}
      <div className="space-y-3 md:hidden">
        {reservations.map((r) => (
          <div
            key={r.id}
            className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/80"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-white">
                  {fmtDate(r.date)} {r.time}
                </div>
                <div className="mt-1 text-xs text-white/60">
                  {r.serviceType === "BREAKFAST" ? "Kahvaltı" : "Kafe"} · {r.area.title} · Masa{" "}
                  {r.table.name}
                </div>
              </div>
              <div>
                {r.status === "BOOKED" ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                    Aktif
                  </span>
                ) : (
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                    İptal
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs text-white/50">Kişi</div>
                <div className="text-white">{r.partySize}</div>
              </div>
              <div>
                <div className="text-xs text-white/50">TCKN</div>
                <div className="text-white">****{r.tcknLast4}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-white/50">Ad Soyad</div>
                <div className="text-white">{r.fullName}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-white/50">Telefon</div>
                <div className="text-white">{r.phone}</div>
              </div>
              {r.note ? (
                <div className="col-span-2">
                  <div className="text-xs text-white/50">Not</div>
                  <div className="text-white/90">{r.note}</div>
                </div>
              ) : null}
              <div className="col-span-2 text-xs text-white/50">
                Oluşturma: {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
              </div>
            </div>
          </div>
        ))}
        {reservations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
            Henüz rezervasyon yok.
          </div>
        ) : null}
      </div>

      {/* Desktop: table */}
      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-black/40 text-white/80">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tarih/Saat</th>
                <th className="px-4 py-3 text-left font-medium">Servis</th>
                <th className="px-4 py-3 text-left font-medium">Alan</th>
                <th className="px-4 py-3 text-left font-medium">Masa</th>
                <th className="px-4 py-3 text-left font-medium">Kişi</th>
                <th className="px-4 py-3 text-left font-medium">Ad Soyad</th>
                <th className="px-4 py-3 text-left font-medium">Telefon</th>
                <th className="px-4 py-3 text-left font-medium">TCKN</th>
                <th className="px-4 py-3 text-left font-medium">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reservations.map((r) => (
                <tr key={r.id} className="text-white/80">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-white">
                      {fmtDate(r.date)} {r.time}
                    </div>
                    <div className="text-xs text-white/50">
                      Oluşturma: {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.serviceType === "BREAKFAST" ? "Kahvaltı" : "Kafe"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.area.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.table.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.partySize}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">****{r.tcknLast4}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.status === "BOOKED" ? (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                        İptal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {reservations.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/60" colSpan={9}>
                    Henüz rezervasyon yok.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
