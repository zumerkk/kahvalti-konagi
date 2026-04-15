"use client";

import { useEffect, useMemo, useState } from "react";
import { getTimeSlots, isAllowedDate } from "@/lib/reservation-rules";
import { Input, Select, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type TableOption = { id: string; name: string };
type AvailabilityResponse =
  | { ok: true; closed: true; reason: string | null; tables: [] }
  | { ok: true; closed: false; tables: TableOption[] }
  | { ok: false; error: string };

type ReservationCreateResponse =
  | {
      ok: true;
      reservation: { id: string; date: string; time: string; table: { name: string } };
    }
  | { ok: false; error: string };

export function ReservationForm() {
  const timeSlots = useMemo(() => getTimeSlots(), []);
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

  async function loadAvailability(d: string, t: string) {
    if (!d || !t) return;
    if (!isAllowedDate(d)) {
      setTables([]);
      setClosedReason("Sadece hafta sonu rezervasyon alınmaktadır.");
      setTableId("");
      return;
    }
    setLoadingTables(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/availability?date=${encodeURIComponent(d)}&time=${encodeURIComponent(t)}`,
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
  }, [date, time]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          time,
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

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Tarih (Cumartesi/Pazar)"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          hint="Sadece hafta sonu tarih seçebilirsiniz."
        />
        <Select label="Saat" value={time} onChange={(e) => setTime(e.target.value)}>
          {timeSlots.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Masa"
          value={tableId}
          onChange={(e) => setTableId(e.target.value)}
          disabled={!date || loadingTables || !!closedReason || tables.length === 0}
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
          max={30}
          value={partySize}
          onChange={(e) => setPartySize(Number(e.target.value))}
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
            !date ||
            !time ||
            !tableId ||
            !fullName.trim() ||
            !phone.trim() ||
            tckn.length !== 11 ||
            !isAllowedDate(date) ||
            !!closedReason
          }
        >
          {submitting ? "Gönderiliyor…" : "Rezervasyonu Tamamla"}
        </Button>
      </div>
    </div>
  );
}
