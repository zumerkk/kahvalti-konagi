"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarPlus, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { getTimeSlots, isAllowedDate } from "@/lib/reservation-rules";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/Input";

type ServiceType = "BREAKFAST" | "CAFE";
type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ARRIVED"
  | "SEATED"
  | "DEPOSIT_PENDING"
  | "DEPOSIT_RECEIVED";
type ReservationSource = "PHONE" | "WHATSAPP" | "INSTAGRAM" | "WALK_IN" | "ADMIN" | "OTHER";

type AreaDto = { id: string; code: "CAMEKAN" | "SALON"; title: string };
type TableOption = { id: string; name: string };

type AvailabilityResponse =
  | { ok: true; closed: true; reason: string | null; tables: [] }
  | { ok: true; closed: false; tables: TableOption[] }
  | { ok: false; error: string };

type SettingsResponse =
  | {
      ok: true;
      settings: {
        breakfastPricePerPerson: number;
        maxPartySize: number;
        minPartySize: number;
      };
    }
  | { ok: false; error: string };

type ManualCreateResponse =
  | { ok: true; reservation: { id: string; table: { name: string }; date: string; time: string } }
  | { ok: false; error: string };

function localDateValue() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function AdminManualReservationForm() {
  const router = useRouter();
  const today = useMemo(() => localDateValue(), []);

  const [serviceType, setServiceType] = useState<ServiceType>("BREAKFAST");
  const [source, setSource] = useState<ReservationSource>("PHONE");
  const [status, setStatus] = useState<ReservationStatus>("CONFIRMED");
  const [date, setDate] = useState(today);
  const timeSlots = useMemo(() => getTimeSlots(serviceType), [serviceType]);
  const [time, setTime] = useState(timeSlots[0] ?? "08:00");

  const [areas, setAreas] = useState<AreaDto[]>([]);
  const [areaId, setAreaId] = useState("");
  const [tables, setTables] = useState<TableOption[]>([]);
  const [tableId, setTableId] = useState("auto");
  const [loadingTables, setLoadingTables] = useState(false);
  const [closedReason, setClosedReason] = useState<string | null>(null);

  const [breakfastPricePerPerson, setBreakfastPricePerPerson] = useState(450);
  const [minPartySize, setMinPartySize] = useState(1);
  const [maxPartySize, setMaxPartySize] = useState(12);

  const [partySize, setPartySize] = useState(2);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [tckn, setTckn] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadInitialData() {
      const [areasRes, settingsRes] = await Promise.all([
        fetch("/api/areas"),
        fetch("/api/settings"),
      ]);
      const areasJson = (await areasRes.json()) as { ok: boolean; areas?: AreaDto[] };
      const settingsJson = (await settingsRes.json()) as SettingsResponse;

      if (areasJson.ok && areasJson.areas) {
        setAreas(areasJson.areas);
        setAreaId((prev) => prev || areasJson.areas?.find((area) => area.code === "SALON")?.id || areasJson.areas?.[0]?.id || "");
      }

      if (settingsJson.ok) {
        setBreakfastPricePerPerson(settingsJson.settings.breakfastPricePerPerson);
        setMinPartySize(settingsJson.settings.minPartySize);
        setMaxPartySize(settingsJson.settings.maxPartySize);
        setPartySize((prev) =>
          Math.min(settingsJson.settings.maxPartySize, Math.max(settingsJson.settings.minPartySize, prev)),
        );
      }
    }

    void loadInitialData();
  }, []);

  useEffect(() => {
    setTime((prev) => (timeSlots.includes(prev) ? prev : (timeSlots[0] ?? "")));
  }, [timeSlots]);

  async function loadAvailability() {
    if (!date || !time || !areaId) return;
    if (!isAllowedDate(date)) {
      setTables([]);
      setTableId("auto");
      setClosedReason("Tarih geçersiz.");
      return;
    }

    setLoadingTables(true);
    setError(null);
    try {
      const params = new URLSearchParams({ serviceType, areaId, date, time });
      const res = await fetch(`/api/availability?${params.toString()}`);
      const json = (await res.json()) as AvailabilityResponse;

      if (!res.ok || !json.ok) {
        setTables([]);
        setTableId("auto");
        setClosedReason("error" in json ? json.error : "Uygun masa alınamadı.");
        return;
      }

      if ("closed" in json && json.closed) {
        setTables([]);
        setTableId("auto");
        setClosedReason(json.reason ?? "Kapalı gün.");
        return;
      }

      const nextTables = "tables" in json ? json.tables : [];
      setClosedReason(null);
      setTables(nextTables);
      setTableId((prev) => (prev === "auto" ? "auto" : nextTables.some((table) => table.id === prev) ? prev : "auto"));
    } catch {
      setTables([]);
      setTableId("auto");
      setClosedReason("Uygun masa alınamadı.");
    } finally {
      setLoadingTables(false);
    }
  }

  useEffect(() => {
    void loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceType, areaId, date, time]);

  async function submit() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/reservations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          source,
          status,
          date,
          time,
          areaId,
          tableId,
          fullName: fullName.trim(),
          phone: phone.trim(),
          tckn,
          partySize,
          note: note.trim(),
        }),
      });
      const json = (await res.json()) as ManualCreateResponse;

      if (!json.ok) {
        setError(json.error ?? "Rezervasyon oluşturulamadı.");
        return;
      }

      toast.success(`Rezervasyon kaydedildi: ${json.reservation.table.name}`);
      router.push("/admin/rezervasyonlar");
      router.refresh();
    } catch {
      setError("Rezervasyon oluşturulamadı.");
    } finally {
      setSubmitting(false);
    }
  }

  const breakfastTotal = serviceType === "BREAKFAST" ? breakfastPricePerPerson * partySize : null;
  const hasInvalidTckn = tckn.length > 0 && tckn.length !== 11;
  const canSubmit =
    !submitting &&
    !loadingTables &&
    !!date &&
    !!time &&
    !!areaId &&
    !!tableId &&
    !!fullName.trim() &&
    partySize >= minPartySize &&
    partySize <= maxPartySize &&
    !hasInvalidTckn &&
    !closedReason &&
    (tableId === "auto" ? tables.length > 0 : true);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <CalendarPlus className="h-6 w-6 text-amber-400" />
            Yeni Rezervasyon
          </h1>
        </div>
        <ButtonLink href="/admin/rezervasyonlar" variant="secondary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Listeye Dön
        </ButtonLink>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            label="Kaynak"
            value={source}
            onChange={(e) => setSource(e.target.value as ReservationSource)}
          >
            <option value="PHONE">Telefon</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="INSTAGRAM">Instagram</option>
            <option value="WALK_IN">Kapıdan</option>
            <option value="ADMIN">Admin</option>
            <option value="OTHER">Diğer</option>
          </Select>
          <Select
            label="Durum"
            value={status}
            onChange={(e) => setStatus(e.target.value as ReservationStatus)}
          >
            <option value="CONFIRMED">Onaylandı</option>
            <option value="PENDING">Beklemede</option>
            <option value="DEPOSIT_PENDING">Kapora Bekleniyor</option>
            <option value="DEPOSIT_RECEIVED">Kapora Alındı</option>
            <option value="ARRIVED">Geldi</option>
            <option value="SEATED">Oturtuldu</option>
          </Select>
          <Select
            label="Servis"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as ServiceType)}
          >
            <option value="BREAKFAST">Kahvaltı</option>
            <option value="CAFE">Kafe</option>
          </Select>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Input label="Tarih" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Select label="Saat" value={time} onChange={(e) => setTime(e.target.value)}>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </Select>
          <Select label="Alan" value={areaId} onChange={(e) => setAreaId(e.target.value)}>
            {areas.length === 0 ? <option value="">Alan yok</option> : null}
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.title}
              </option>
            ))}
          </Select>
          <Select
            label="Masa"
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            disabled={loadingTables || !!closedReason}
            hint={
              closedReason
                ? closedReason
                : loadingTables
                  ? "Uygun masalar yükleniyor..."
                  : `${tables.length} uygun masa`
            }
          >
            <option value="auto">✨ Otomatik Masa Ata</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </Select>
        </div>

        {breakfastTotal != null ? (
          <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            Kişi başı {breakfastPricePerPerson} TL · Toplam {breakfastTotal} TL
          </div>
        ) : null}

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="Ad Soyad"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Rezervasyon sahibi"
          />
          <Input
            label="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="05xx xxx xx xx"
            inputMode="tel"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            label="T.C. Kimlik No"
            value={tckn}
            onChange={(e) => setTckn(e.target.value.replace(/\D/g, "").slice(0, 11))}
            placeholder="Opsiyonel"
            inputMode="numeric"
            hint={hasInvalidTckn ? "TCKN girilecekse 11 hane olmalı." : undefined}
          />
          <Input
            label="Kişi Sayısı"
            type="number"
            min={minPartySize}
            max={maxPartySize}
            value={partySize}
            onChange={(e) => {
              const raw = Number(e.target.value);
              const next = Number.isFinite(raw) ? Math.trunc(raw) : minPartySize;
              setPartySize(Math.min(maxPartySize, Math.max(minPartySize, next)));
            }}
          />
        </div>

        <div className="mt-4">
          <TextArea
            label="Not"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Örn: pencere kenarı, bebek sandalyesi"
          />
        </div>

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="secondary" onClick={loadAvailability} disabled={loadingTables} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Masaları Yenile
          </Button>
          <Button onClick={submit} disabled={!canSubmit} className="gap-2">
            <Save className="h-4 w-4" />
            {submitting ? "Kaydediliyor..." : "Rezervasyonu Kaydet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
