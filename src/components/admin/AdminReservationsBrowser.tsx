"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

type Area = { id: string; title: string; code: string };
type ReservationStatus =
  | "PENDING"
  | "BOOKED"
  | "CONFIRMED"
  | "ARRIVED"
  | "SEATED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW"
  | "POSTPONED"
  | "DEPOSIT_PENDING"
  | "DEPOSIT_RECEIVED";
type ReservationSource = "WEB" | "PHONE" | "WHATSAPP" | "INSTAGRAM" | "WALK_IN" | "ADMIN" | "OTHER";

type ReservationRow = {
  id: string;
  status: ReservationStatus;
  source: ReservationSource;
  serviceType: "BREAKFAST" | "CAFE";
  date: string;
  time: string;
  partySize: number;
  fullName: string;
  phone: string;
  tcknLast4: string | null;
  note: string | null;
  totalAmount: number | null;
  createdAt: string;
  area: { id: string; title: string; code: string };
  table: { id: string; name: string };
};

const statusOptions: Array<{ value: ReservationStatus; label: string }> = [
  { value: "PENDING", label: "Beklemede" },
  { value: "CONFIRMED", label: "Onaylandı" },
  { value: "ARRIVED", label: "Geldi" },
  { value: "SEATED", label: "Oturtuldu" },
  { value: "COMPLETED", label: "Tamamlandı" },
  { value: "CANCELLED", label: "İptal" },
  { value: "NO_SHOW", label: "Gelmedi" },
  { value: "POSTPONED", label: "Ertelendi" },
  { value: "DEPOSIT_PENDING", label: "Kapora Bekleniyor" },
  { value: "DEPOSIT_RECEIVED", label: "Kapora Alındı" },
];

const activeStatuses: ReservationStatus[] = [
  "PENDING",
  "BOOKED",
  "CONFIRMED",
  "ARRIVED",
  "SEATED",
  "DEPOSIT_PENDING",
  "DEPOSIT_RECEIVED",
];

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

function sourceLabel(s: ReservationSource) {
  const labels: Record<ReservationSource, string> = {
    WEB: "Web",
    PHONE: "Telefon",
    WHATSAPP: "WhatsApp",
    INSTAGRAM: "Instagram",
    WALK_IN: "Kapıdan",
    ADMIN: "Admin",
    OTHER: "Diğer",
  };
  return labels[s];
}

function statusLabel(s: ReservationStatus) {
  if (s === "BOOKED") return "Aktif";
  return statusOptions.find((option) => option.value === s)?.label ?? s;
}

function statusClass(s: ReservationStatus) {
  if (s === "CANCELLED" || s === "NO_SHOW") {
    return "border-red-500/30 bg-red-500/10 text-red-200";
  }
  if (s === "COMPLETED") {
    return "border-sky-500/30 bg-sky-500/10 text-sky-200";
  }
  if (s === "DEPOSIT_PENDING" || s === "POSTPONED") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-100";
  }
  return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
}

function canCancel(status: ReservationStatus) {
  return activeStatuses.includes(status);
}

export function AdminReservationsBrowser() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [date, setDate] = useState("");
  const [serviceType, setServiceType] = useState<"" | "BREAKFAST" | "CAFE">("");
  const [areaId, setAreaId] = useState("");
  const [status, setStatus] = useState<"" | ReservationStatus>("");

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

  async function confirmReservation(id: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reservations/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONFIRMED" }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Onaylanamadı.");
        return;
      }
      await loadReservations();
    } catch {
      setError("Onaylanamadı.");
    } finally {
      setLoading(false);
    }
  }

  function handleWhatsAppAction(r: ReservationRow, templateType: 'confirm' | 'deposit' | 'cancel' | 'general') {
    const formattedDate = new Date(r.date).toLocaleDateString("tr-TR");
    let text = "";
    
    if (templateType === 'confirm') {
      text = `Merhaba ${r.fullName}, Kahvaltı Konağı rezervasyonunuz onaylanmıştır. 📅 ${formattedDate} günü saat ⏰ ${r.time}'da ${r.area.title} alanında ${r.table.name} masasında sizi ağırlamaktan mutluluk duyacağız. Keyifli günler dileriz!`;
    } else if (templateType === 'deposit') {
      text = `Merhaba ${r.fullName}, Kahvaltı Konağı rezervasyon talebiniz alınmıştır. Rezervasyonunuzu tamamlamak ve kesinleştirmek için kapora ödemenizi yapabilirsiniz. Detaylar için bizimle iletişime geçebilirsiniz. Teşekkür ederiz.`;
    } else if (templateType === 'cancel') {
      text = `Merhaba ${r.fullName}, ${formattedDate} tarihindeki rezervasyon talebiniz iptal edilmiştir. Başka bir gün görüşmek dileğiyle. İyi günler dileriz.`;
    } else {
      text = `Merhaba ${r.fullName}, Kahvaltı Konağı rezervasyonunuz ile ilgili iletişime geçmek istedik. Rezervasyon detaylarınız: ${formattedDate} - ${r.time} - ${r.area.title}.`;
    }
    
    const cleanPhone = r.phone.replace(/\D/g, "");
    const finalPhone = cleanPhone.startsWith("90") ? cleanPhone : cleanPhone.startsWith("0") ? `90${cleanPhone.slice(1)}` : `90${cleanPhone}`;
    
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`, "_blank");
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
            onChange={(e) => setStatus(e.target.value as "" | ReservationStatus)}
          >
            <option value="">Tümü</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-white/60">
            {date ? `${date} için ${reservations.length} kayıt` : `Son ${reservations.length} kayıt listeleniyor.`}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="ghost" onClick={() => setDate("")} disabled={loading || !date}>
              Tarihi Temizle
            </Button>
            <Button variant="secondary" onClick={loadReservations} disabled={loading}>
              {loading ? "Yükleniyor..." : "Filtrele"}
            </Button>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}
      </div>

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
                  {serviceLabel(r.serviceType)} · {sourceLabel(r.source)} · {r.area.title} · Masa{" "}
                  {r.table.name}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`rounded-full border px-3 py-1 text-xs ${statusClass(r.status)}`}>
                  {statusLabel(r.status)}
                </span>
                {r.status === "PENDING" ? (
                  <button
                    onClick={() => confirmReservation(r.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-500/15 disabled:opacity-50"
                    disabled={loading}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Onayla
                  </button>
                ) : null}
                {canCancel(r.status) ? (
                  <button
                    onClick={() => cancelReservation(r.id)}
                    className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-50"
                    disabled={loading}
                  >
                    <XCircle className="h-3.5 w-3.5" />
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
                <div className="text-white">{r.tcknLast4 ? `****${r.tcknLast4}` : "-"}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-white/50">Ad Soyad</div>
                <div className="text-white">{r.fullName}</div>
              </div>
              <div className="col-span-2">
                <div className="text-xs text-white/50 mb-1">İletişim & Mesaj</div>
                {r.phone ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={`tel:${r.phone}`} className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 py-1 px-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-xs">
                      <Phone className="h-3 w-3" />
                      Ara: {r.phone}
                    </a>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleWhatsAppAction(r, 'confirm')}
                        className="py-1 px-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-[10px] font-bold"
                        title="Onay Mesajı Gönder"
                      >
                        WA: Onay
                      </button>
                      <button
                        onClick={() => handleWhatsAppAction(r, 'deposit')}
                        className="py-1 px-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-[10px] font-bold"
                        title="Kapora Talebi Gönder"
                      >
                        WA: Kapora
                      </button>
                      <button
                        onClick={() => handleWhatsAppAction(r, 'cancel')}
                        className="py-1 px-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[10px] font-bold"
                        title="İptal Mesajı Gönder"
                      >
                        WA: İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-white/40">-</span>
                )}
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

      <div className="hidden overflow-hidden rounded-3xl border border-white/10 bg-white/5 md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-black/40 text-white/80">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Tarih/Saat</th>
                <th className="px-4 py-3 text-left font-medium">Servis</th>
                <th className="px-4 py-3 text-left font-medium">Kaynak</th>
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
                  <td className="px-4 py-3 whitespace-nowrap">{sourceLabel(r.source)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.area.title}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.table.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.partySize}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.fullName}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.phone ? (
                      <div className="flex flex-col gap-1">
                        <a href={`tel:${r.phone}`} className="text-sky-400 hover:text-sky-300 font-medium inline-flex items-center gap-1 text-xs">
                          <Phone className="h-3 w-3 shrink-0" />
                          {r.phone}
                        </a>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleWhatsAppAction(r, 'confirm')}
                            className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 text-[9px] font-bold"
                            title="Onay Mesajı"
                          >
                            Onay
                          </button>
                          <button
                            onClick={() => handleWhatsAppAction(r, 'deposit')}
                            className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 text-[9px] font-bold"
                            title="Kapora Talebi"
                          >
                            Kapora
                          </button>
                          <button
                            onClick={() => handleWhatsAppAction(r, 'cancel')}
                            className="px-1 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[9px] font-bold"
                            title="İptal Mesajı"
                          >
                            İptal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <span className="text-white/40">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.tcknLast4 ? `****${r.tcknLast4}` : "-"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`rounded-full border px-3 py-1 text-xs ${statusClass(r.status)}`}>
                      {statusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {r.status === "PENDING" ? (
                      <button
                        onClick={() => confirmReservation(r.id)}
                        className="mr-2 inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 hover:bg-emerald-500/15 disabled:opacity-50"
                        disabled={loading}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Onayla
                      </button>
                    ) : null}
                    {canCancel(r.status) ? (
                      <button
                        onClick={() => cancelReservation(r.id)}
                        className="inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-200 hover:bg-red-500/15 disabled:opacity-50"
                        disabled={loading}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        İptal Et
                      </button>
                    ) : (
                      <span className="text-xs text-white/40">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && reservations.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/60" colSpan={11}>
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
