"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

type Area = { id: string; title: string; code: string };

type ReservationRow = {
  id: string;
  status: "BOOKED" | "CANCELLED";
  serviceType: "BREAKFAST" | "CAFE";
  date: string;
  time: string;
  partySize: number;
  fullName: string;
  phone: string;
  tcknLast4: string;
  note: string | null;
  createdAt: string;
  area: { id: string; title: string; code: string };
  table: { id: string; name: string };
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 10);
  } catch {
    return iso.slice(0, 10);
  }
}

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toISOString().slice(0, 16).replace("T", " ");
  } catch {
    return iso;
  }
}

function serviceLabel(s: ReservationRow["serviceType"]) {
  return s === "BREAKFAST" ? "Kahvaltı" : "Kafe";
}

export function AdminReservationsBrowser() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [areas, setAreas] = useState<Area[]>([]);
  const [date, setDate] = useState(today);
  const [serviceType, setServiceType] = useState<"" | "BREAKFAST" | "CAFE">("");
  const [areaId, setAreaId] = useState("");
  const [status, setStatus] = useState<"" | "BOOKED" | "CANCELLED">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reservations, setReservations] = useState<ReservationRow[]>([]);

  async function loadAreas() {
    const res = await fetch("/api/areas");
    const json = (await res.json()) as { ok: boolean; areas?: Area[] };
    if (json.ok && json.areas) setAreas(json.areas);
  }

  async function loadReservations() {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (date) qs.set("date", date);
      if (serviceType) qs.set("serviceType", serviceType);
      if (areaId) qs.set("areaId", areaId);
      if (status) qs.set("status", status);
      qs.set("limit", "200");

      const res = await fetch(`/api/admin/reservations?${qs.toString()}`, { cache: "no-store" });
      const json = (await res.json()) as {
        ok: boolean;
        error?: string;
        reservations?: ReservationRow[];
      };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Liste alınamadı.");
        setReservations([]);
        return;
      }
      setReservations(json.reservations ?? []);
    } catch {
      setError("Liste alınamadı.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  async function cancelReservation(id: string) {
    const ok = window.confirm("Bu rezervasyon iptal edilsin mi?");
    if (!ok) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reservations/${id}/cancel`, { method: "POST" });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "İptal edilemedi.");
        return;
      }
      await loadReservations();
    } catch {
      setError("İptal edilemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAreas();
    void loadReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            type="date"
            label="Tarih"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Select
            label="Servis"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as "" | "BREAKFAST" | "CAFE")}
          >
            <option value="">Tümü</option>
            <option value="BREAKFAST">Kahvaltı</option>
            <option value="CAFE">Kafe</option>
          </Select>
          <Select label="Alan" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
            <option value="">Tümü</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </Select>
          <Select
            label="Durum"
            value={status}
            onChange={(e) => setStatus(e.target.value as "" | "BOOKED" | "CANCELLED")}
          >
            <option value="">Tümü</option>
            <option value="BOOKED">Aktif</option>
            <option value="CANCELLED">İptal</option>
          </Select>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/60">Son 200 kayıt listelenir.</div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={loadReservations} disabled={loading}>
              {loading ? "Yükleniyor…" : "Filtrele"}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

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
                  {serviceLabel(r.serviceType)} · {r.area.title} · Masa {r.table.name}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {r.status === "BOOKED" ? (
                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
                    Aktif
                  </span>
                ) : (
                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200">
                    İptal
                  </span>
                )}
                {r.status === "BOOKED" ? (
                  <button
                    onClick={() => cancelReservation(r.id)}
                    className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-50"
                    disabled={loading}
                  >
                    İptal Et
                  </button>
                ) : null}
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
                Oluşturma: {fmtDateTime(r.createdAt)}
              </div>
            </div>
          </div>
        ))}
        {!loading && reservations.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">
            Kayıt bulunamadı.
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
                <th className="px-4 py-3 text-left font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {reservations.map((r) => (
                <tr key={r.id} className="text-white/80">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-white">
                      {fmtDate(r.date)} {r.time}
                    </div>
                    <div className="text-xs text-white/50">Oluşturma: {fmtDateTime(r.createdAt)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{serviceLabel(r.serviceType)}</td>
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
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.status === "BOOKED" ? (
                      <button
                        onClick={() => cancelReservation(r.id)}
                        className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-50"
                        disabled={loading}
                      >
                        İptal Et
                      </button>
                    ) : (
                      <span className="text-xs text-white/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && reservations.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/60" colSpan={10}>
                    Kayıt bulunamadı.
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

