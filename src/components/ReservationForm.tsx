"use client";

import { useEffect, useMemo, useState } from "react";
import { getTimeSlots, isAllowedDate } from "@/lib/reservation-rules";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type ServiceType = "BREAKFAST" | "CAFE";
type AreaCode = "CAMEKAN" | "SALON";

type TableOption = { id: string; name: string };
type AvailabilityResponse =
  | { ok: true; closed: true; reason: string | null; tables: [] }
  | { ok: true; closed: false; tables: TableOption[] }
  | { ok: false; error: string };

type AreaDto = { id: string; code: AreaCode; title: string };
type AreasResponse = { ok: true; areas: AreaDto[] } | { ok: false; error: string };

type PublicSettingsResponse =
  | { ok: true; settings: { breakfastPricePerPerson: number } }
  | { ok: false; error: string };

type ReservationCreateResponse =
  | {
      ok: true;
      reservation: { id: string; date: string; time: string; table: { name: string } };
    }
  | { ok: false; error: string };

export function ReservationForm() {
  const [serviceType, setServiceType] = useState<ServiceType>("BREAKFAST");
  const [areaCode, setAreaCode] = useState<AreaCode>("SALON");
  const [areas, setAreas] = useState<AreaDto[]>([]);
  const [areaId, setAreaId] = useState("");
  const [loadingAreas, setLoadingAreas] = useState(false);
  const [areasError, setAreasError] = useState<string | null>(null);

  const [breakfastPricePerPerson, setBreakfastPricePerPerson] = useState<number | null>(null);

  const timeSlots = useMemo(() => getTimeSlots(serviceType), [serviceType]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState(timeSlots[0] ?? "08:00");

  const [tables, setTables] = useState<TableOption[]>([]);
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [loadingTables, setLoadingTables] = useState(false);

  const [tableId, setTableId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [tckn, setTckn] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [note, setNote] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    id: string;
    time: string;
    tableName: string;
    dateISO: string;
  } | null>(null);

  async function loadAreas() {
    setLoadingAreas(true);
    setAreasError(null);
    try {
      const res = await fetch("/api/areas");
      const json = (await res.json()) as AreasResponse;
      if (!res.ok || !("areas" in json)) {
        setAreas([]);
        setAreasError("error" in json ? json.error : "Alanlar yüklenemedi.");
        return;
      }
      setAreas(json.areas);
    } catch {
      setAreas([]);
      setAreasError("Bağlantı hatası.");
    } finally {
      setLoadingAreas(false);
    }
  }

  async function loadPublicSettings() {
    try {
      const res = await fetch("/api/settings");
      const json = (await res.json()) as PublicSettingsResponse;
      if (!res.ok || !("settings" in json)) return;
      setBreakfastPricePerPerson(json.settings.breakfastPricePerPerson);
    } catch {
      // sessiz geç: fiyat bilgisi opsiyonel gösterim
    }
  }

  useEffect(() => {
    void loadAreas();
    void loadPublicSettings();
  }, []);

  useEffect(() => {
    const id = areas.find((a) => a.code === areaCode)?.id ?? "";
    setAreaId(id);
    if (!id) {
      setTables([]);
      setTableId("");
    }
  }, [areas, areaCode]);

  // servis değişince saat geçerliyse koru, değilse ilk slota dön
  useEffect(() => {
    setTime((prev) => (timeSlots.includes(prev) ? prev : (timeSlots[0] ?? "")));
  }, [timeSlots]);

  async function loadAvailability(d: string, t: string) {
    if (!d || !t || !areaId) return;
    if (!isAllowedDate(d)) {
      setTables([]);
      setClosedReason("Tarih geçersiz.");
      setTableId("");
      return;
    }
    setLoadingTables(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/availability?serviceType=${encodeURIComponent(serviceType)}&areaId=${encodeURIComponent(
          areaId,
        )}&date=${encodeURIComponent(d)}&time=${encodeURIComponent(t)}`,
      );
      const json = (await res.json()) as AvailabilityResponse;
      if (!res.ok) {
        setTables([]);
        setClosedReason("error" in json ? json.error : "Uygunluk sorgulanamadı.");
        setTableId("");
        return;
      }
      if ("closed" in json && json.closed) {
        setTables([]);
        setClosedReason(json.reason ?? "Kapalı gün.");
        setTableId("");
        return;
      }
      setClosedReason(null);
      setTables("tables" in json ? json.tables ?? [] : []);
      setTableId((prev) => {
        const list = "tables" in json ? json.tables : [];
        if (list?.some((x) => x.id === prev)) return prev;
        return list?.[0]?.id ?? "";
      });
    } catch {
      setTables([]);
      setClosedReason("Bağlantı hatası.");
      setTableId("");
    } finally {
      setLoadingTables(false);
    }
  }

  useEffect(() => {
    if (date) void loadAvailability(date, time);
  }, [date, time, areaId, serviceType]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          date,
          time,
          areaId,
          tableId,
          fullName,
          phone,
          tckn,
          partySize,
          note,
        }),
      });
      const json = (await res.json()) as ReservationCreateResponse;
      if (!res.ok || !("reservation" in json)) {
        setError("error" in json ? json.error : "Rezervasyon tamamlanamadı.");
        return;
      }
      setSuccess({
        id: json.reservation.id,
        time: json.reservation.time,
        tableName: json.reservation.table.name,
        dateISO: json.reservation.date,
      });
      // formu kısmi temizle
      setFullName("");
      setPhone("");
      setTckn("");
      setPartySize(2);
      setNote("");
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setSubmitting(false);
    }
  }

  const breakfastTotal =
    serviceType === "BREAKFAST" && breakfastPricePerPerson != null
      ? breakfastPricePerPerson * partySize
      : null;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Hizmet"
          value={serviceType}
          onChange={(e) => setServiceType(e.target.value as ServiceType)}
        >
          <option value="BREAKFAST">Kahvaltı</option>
          <option value="CAFE">Kafe</option>
        </Select>

        <Select
          label="Alan"
          value={areaCode}
          onChange={(e) => setAreaCode(e.target.value as AreaCode)}
          disabled={loadingAreas || !!areasError}
          hint={
            areasError
              ? areasError
              : loadingAreas
                ? "Alanlar yükleniyor…"
                : areaId
                  ? undefined
                  : "Alan seçimi için alanlar yükleniyor."
          }
        >
          <option value="CAMEKAN">
            {areas.find((a) => a.code === "CAMEKAN")?.title ?? "Camekan"}
          </option>
          <option value="SALON">{areas.find((a) => a.code === "SALON")?.title ?? "Salon"}</option>
        </Select>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Tarih"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          hint="Kapalı günlerde uygun masa listesi gelmez."
        />
        <Select label="Saat" value={time} onChange={(e) => setTime(e.target.value)}>
          {timeSlots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {serviceType === "BREAKFAST" && breakfastTotal != null ? (
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
          Kahvaltı kişi başı: <b>{breakfastPricePerPerson}₺</b> — Toplam: <b>{breakfastTotal}₺</b>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Masa"
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
          disabled={!date || !areaId || loadingTables || !!closedReason || tables.length === 0}
          hint={
            closedReason
              ? closedReason
              : loadingTables
                ? "Uygun masalar yükleniyor…"
                : date
                  ? `${tables.length} uygun masa`
                  : "Önce tarih seçin"
          }
        >
          {tables.length === 0 ? (
            <option value="">{date ? "Uygun masa bulunamadı" : "Tarih seçin"}</option>
          ) : (
            tables.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))
          )}
        </Select>

        <Input
          label="Kişi Sayısı"
          type="number"
          min={1}
          max={4}
          value={partySize}
          onChange={(e) => {
            const raw = Number(e.target.value);
            const next = Number.isFinite(raw) ? raw : 1;
            setPartySize(Math.min(4, Math.max(1, Math.trunc(next))));
          }}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="T.C. Kimlik No"
          value={tckn}
          onChange={(e) => setTckn(e.target.value.replace(/\D/g, "").slice(0, 11))}
          placeholder="11 haneli"
          hint="Sadece rezervasyonu yapan kişiden istenir."
          inputMode="numeric"
        />
        <TextArea
          label="Not (opsiyonel)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Örn: bebek sandalyesi"
        />
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mt-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          Rezervasyon alındı. Kod: <b>{success.id}</b> — {success.tableName} / {date} {success.time}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          onClick={submit}
          disabled={
            submitting ||
            !areaId ||
            !date ||
            !time ||
            !tableId ||
            !fullName.trim() ||
            !phone.trim() ||
            tckn.length !== 11 ||
            !isAllowedDate(date) ||
            partySize < 1 ||
            partySize > 4 ||
            !!closedReason
          }
        >
          {submitting ? "Gönderiliyor…" : "Rezervasyonu Tamamla"}
        </Button>
      </div>
    </div>
  );
}
