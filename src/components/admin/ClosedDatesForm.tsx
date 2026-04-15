"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ClosedDatesForm() {
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/closed-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, reason }),
      });
      const json = (await res.json()) as { ok: true } | { ok: false; error: string };
      if (!res.ok) {
        setError("error" in json ? json.error : "Kaydedilemedi.");
        return;
      }
      window.location.reload();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Input label="Tarih" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <Input
        label="Açıklama (opsiyonel)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Örn: Bayram"
      />
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      <Button onClick={submit} disabled={loading || !date} className="w-full">
        {loading ? "Kaydediliyor…" : "Kapalı Günü Kaydet"}
      </Button>
    </div>
  );
}
