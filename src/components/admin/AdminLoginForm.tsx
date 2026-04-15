"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const json = (await res.json()) as { ok: true } | { ok: false; error: string };
      if (!res.ok) {
        setError("error" in json ? json.error : "Giriş başarısız.");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Input label="Kullanıcı adı" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Input
        label="Şifre"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      <Button onClick={submit} disabled={loading || !username || !password} className="w-full">
        {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
      </Button>
    </div>
  );
}
