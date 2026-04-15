"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function TablesForm() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
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
      <Input
        label="Masa adı"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Örn: Masa 13"
      />
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      <Button onClick={submit} disabled={loading || name.trim().length < 2} className="w-full">
        {loading ? "Ekleniyor…" : "Masa Ekle"}
      </Button>
    </div>
  );
}
