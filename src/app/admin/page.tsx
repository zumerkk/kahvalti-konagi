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
      date: true,
      time: true,
      partySize: true,
      fullName: true,
      phone: true,
      tcknLast4: true,
      note: true,
      table: { select: { name: true } },
      createdAt: true,
    },
  });

  return (
    <div>
      <AdminTopbar
        title="Rezervasyonlar"
        description="En son 200 kayıt listelenir. (İptal, filtreleme ve dışa aktarma sonraki adımda eklenebilir.)"
      />

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-black/40 text-white/80">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tarih/Saat</th>
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
                    <div className="text-white">{fmtDate(r.date)} {r.time}</div>
                    <div className="text-xs text-white/50">
                      Oluşturma: {r.createdAt.toISOString().slice(0, 16).replace("T", " ")}
                    </div>
                  </td>
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
                  <td className="px-4 py-8 text-center text-white/60" colSpan={7}>
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
