"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, TextArea } from "@/components/ui/Input";

type CategoryDto = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  productsCount: number;
};

export function MenuCategoriesManager({ initialCategories }: { initialCategories: CategoryDto[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => name.trim().length >= 2 && !Number.isNaN(Number(sortOrder)), [name, sortOrder]);

  function resetForm() {
    setEditingId(null);
    setName("");
    setDescription("");
    setSortOrder("0");
    setIsActive(true);
    setError(null);
  }

  function startEdit(c: CategoryDto) {
    setEditingId(c.id);
    setName(c.name);
    setDescription(c.description ?? "");
    setSortOrder(String(c.sortOrder ?? 0));
    setIsActive(c.isActive);
    setError(null);
  }

  async function upsert(payload: {
    id?: string;
    name: string;
    description?: string;
    sortOrder: number;
    isActive: boolean;
  }) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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

  async function submit() {
    if (!canSubmit) return;
    await upsert({
      id: editingId ?? undefined,
      name,
      description,
      sortOrder: Number(sortOrder),
      isActive,
    });
  }

  async function toggleActive(c: CategoryDto) {
    await upsert({
      id: c.id,
      name: c.name,
      description: c.description ?? "",
      sortOrder: c.sortOrder,
      isActive: !c.isActive,
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">
          {editingId ? "Kategori Güncelle" : "Yeni Kategori"}
        </div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Link href="/admin/menu/urunler" className="hover:text-white">
            Ürünler →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Input label="Kategori adı" value={name} onChange={(e) => setName(e.target.value)} />
        <Input
          label="Sıralama"
          type="number"
          inputMode="numeric"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
      </div>

      <TextArea
        label="Açıklama (opsiyonel)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Örn: Sıcak kahvaltılıklar"
      />

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
        />
        Aktif
      </label>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button onClick={submit} disabled={loading || !canSubmit} className="w-full sm:w-auto">
          {loading ? "Kaydediliyor…" : editingId ? "Güncelle" : "Ekle"}
        </Button>
        {editingId ? (
          <Button
            variant="secondary"
            onClick={resetForm}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Vazgeç
          </Button>
        ) : null}
      </div>

      <div className="pt-4">
        <div className="text-sm font-semibold">Kayıtlı Kategoriler</div>
        <div className="mt-3 space-y-2">
          {initialCategories.length === 0 ? (
            <div className="text-sm text-white/60">Kayıt yok.</div>
          ) : (
            initialCategories.map((c) => (
              <div
                key={c.id}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-white">{c.name}</div>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                    Sıra: {c.sortOrder}
                  </span>
                  <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                    Ürün: {c.productsCount}
                  </span>
                  {c.isActive ? (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">
                      Aktif
                    </span>
                  ) : (
                    <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                      Pasif
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(c)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(c)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
                  >
                    {c.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

