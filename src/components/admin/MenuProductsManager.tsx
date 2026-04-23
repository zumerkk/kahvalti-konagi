"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Select, TextArea } from "@/components/ui/Input";

type CategoryDto = { id: string; name: string; isActive: boolean; sortOrder: number };

type ProductDto = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  sortOrder: number;
  isActive: boolean;
  stock?: number | null;
  category: { id: string; name: string };
};

function centsToTlInput(priceCents: number | null) {
  if (priceCents === null || priceCents === undefined) return "";
  return (priceCents / 100).toFixed(2);
}

function tlInputToCents(value: string): number | null {
  const v = value.trim();
  if (!v) return null;
  const n = Number(v.replace(",", "."));
  if (Number.isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

export function MenuProductsManager({ categories }: { categories: CategoryDto[] }) {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterCategoryId, setFilterCategoryId] = useState<string>("all");

  // form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id ?? "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceTl, setPriceTl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [stock, setStock] = useState("");

  const [stockDrafts, setStockDrafts] = useState<Record<string, string>>({});

  const canSubmit = useMemo(() => {
    if (name.trim().length < 2) return false;
    if (!categoryId) return false;
    if (Number.isNaN(Number(sortOrder))) return false;
    if (priceTl.trim() && tlInputToCents(priceTl) === null) return false;
    if (stock.trim() && Number.isNaN(Number(stock))) return false;
    return true;
  }, [name, categoryId, sortOrder, priceTl, stock]);

  async function fetchProducts(nextFilterCategoryId: string) {
    setLoading(true);
    setError(null);
    try {
      const qs =
        nextFilterCategoryId && nextFilterCategoryId !== "all"
          ? `?categoryId=${encodeURIComponent(nextFilterCategoryId)}`
          : "";
      const res = await fetch(`/api/admin/products${qs}`, { method: "GET" });
      const json = (await res.json()) as
        | { ok: true; products: ProductDto[] }
        | { ok: false; error: string };
      if (!res.ok || !("products" in json)) {
        setError("error" in json ? json.error : "Ürünler getirilemedi.");
        return;
      }
      setProducts(json.products);
      setStockDrafts((prev) => {
        const next: Record<string, string> = { ...prev };
        for (const p of json.products) {
          if (next[p.id] === undefined) next[p.id] = String(p.stock ?? 0);
        }
        return next;
      });
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchProducts(filterCategoryId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategoryId]);

  function resetForm() {
    setEditingId(null);
    setCategoryId(categories[0]?.id ?? "");
    setName("");
    setDescription("");
    setPriceTl("");
    setSortOrder("0");
    setIsActive(true);
    setStock("");
    setError(null);
  }

  function startEdit(p: ProductDto) {
    setEditingId(p.id);
    setCategoryId(p.categoryId);
    setName(p.name);
    setDescription(p.description ?? "");
    setPriceTl(centsToTlInput(p.priceCents));
    setSortOrder(String(p.sortOrder ?? 0));
    setIsActive(p.isActive);
    setStock(p.stock === null || p.stock === undefined ? "" : String(p.stock));
    setError(null);
  }

  async function upsert(payload: Record<string, unknown>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: true } | { ok: false; error: string };
      if (!res.ok) {
        setError("error" in json ? json.error : "Kaydedilemedi.");
        return;
      }
      await fetchProducts(filterCategoryId);
      resetForm();
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    if (!canSubmit) return;
    const priceCents = tlInputToCents(priceTl);
    const payload: Record<string, unknown> = {
      id: editingId ?? undefined,
      categoryId,
      name,
      description,
      priceCents,
      sortOrder: Number(sortOrder),
      isActive,
    };
    if (stock.trim()) payload.stock = Number(stock);
    await upsert(payload);
  }

  async function toggleActive(p: ProductDto) {
    const payload: Record<string, unknown> = {
      id: p.id,
      categoryId: p.categoryId,
      name: p.name,
      description: p.description ?? "",
      priceCents: p.priceCents,
      sortOrder: p.sortOrder,
      isActive: !p.isActive,
    };
    if (p.stock !== undefined && p.stock !== null) payload.stock = p.stock;
    await upsert(payload);
  }

  async function updateStock(id: string) {
    const v = stockDrafts[id]?.trim();
    if (!v) return;
    if (Number.isNaN(Number(v)) || Number(v) < 0) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/products/${id}/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: Number(v) }),
      });
      const json = (await res.json()) as { ok: true } | { ok: false; error: string };
      if (!res.ok) {
        setError("error" in json ? json.error : "Stok güncellenemedi.");
        return;
      }
      await fetchProducts(filterCategoryId);
    } catch {
      setError("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">{editingId ? "Ürün Güncelle" : "Yeni Ürün"}</div>
        <div className="flex items-center gap-2 text-xs text-white/70">
          <Link href="/admin/menu/kategoriler" className="hover:text-white">
            ← Kategoriler
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Select label="Kategori" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} {c.isActive ? "" : "(pasif)"}
            </option>
          ))}
        </Select>
        <Input label="Ürün adı" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <TextArea
        label="Açıklama (opsiyonel)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Örn: Kaşarlı tost"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Input
          label="Fiyat (₺) (opsiyonel)"
          value={priceTl}
          onChange={(e) => setPriceTl(e.target.value)}
          placeholder="Örn: 79.90"
          inputMode="decimal"
        />
        <Input
          label="Sıralama"
          type="number"
          inputMode="numeric"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        />
        <Input
          label="Stok (opsiyonel)"
          type="number"
          inputMode="numeric"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Örn: 25"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-white/80">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
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

      <div className="pt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm font-semibold">Kayıtlı Ürünler</div>
          <div className="w-full sm:w-72">
            <Select
              label="Filtre (kategori)"
              value={filterCategoryId}
              onChange={(e) => setFilterCategoryId(e.target.value)}
            >
              <option value="all">Tümü</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {loading && products.length === 0 ? (
            <div className="text-sm text-white/60">Yükleniyor…</div>
          ) : products.length === 0 ? (
            <div className="text-sm text-white/60">Kayıt yok.</div>
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-white">{p.name}</div>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                        {p.category?.name ?? "Kategori yok"}
                      </span>
                      {p.isActive ? (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-200">
                          Aktif
                        </span>
                      ) : (
                        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                          Pasif
                        </span>
                      )}
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                        Sıra: {p.sortOrder}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                        Fiyat:{" "}
                        {p.priceCents === null
                          ? "—"
                          : `${(p.priceCents / 100).toFixed(2)}₺`}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">
                        Stok: {p.stock ?? 0}
                      </span>
                    </div>
                    {p.description ? <div className="text-xs text-white/60">{p.description}</div> : null}
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2">
                      <input
                        className="w-24 rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-amber-400/70 focus:ring-2 focus:ring-amber-500/20"
                        type="number"
                        inputMode="numeric"
                        value={stockDrafts[p.id] ?? String(p.stock ?? 0)}
                        onChange={(e) =>
                          setStockDrafts((m) => ({ ...m, [p.id]: e.target.value }))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => updateStock(p.id)}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                      >
                        Stok Güncelle
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleActive(p)}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 hover:bg-white/10"
                      >
                        {p.isActive ? "Pasif Yap" : "Aktif Yap"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
