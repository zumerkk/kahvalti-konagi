"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, Plus, Minus, Trash2, Receipt, CreditCard, Wallet,
  Loader2, RefreshCw, Users, Clock, Search, Ban, CheckCircle2, Armchair, ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";

type Product = {
  id: string;
  categoryId: string;
  name: string;
  priceCents: number | null;
  stockQty: number;
  isActive: boolean;
};
type Category = { id: string; name: string };
type OrderItem = { id: string; productId: string; quantity: number; priceCents: number; product?: { name: string } };
type Order = { id: string; tableId: string; status: string; totalAmount: number; items: OrderItem[]; payments: { amountCents: number }[] };
type Reservation = { id: string; fullName: string; time: string; partySize: number; status: string; source: string };
type Table = { id: string; name: string; orders?: Order[]; reservations?: Reservation[] };
type Area = { id: string; title: string; tables: Table[] };

const lira = (cents: number) => (cents / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function tableVisual(table: Table) {
  const open = table.orders?.find((o) => o.status === "OPEN");
  const res = table.reservations?.[0];
  if (open) return { cls: "border-amber-500/50 bg-amber-500/[0.12] text-amber-100", label: "Dolu", dot: "bg-amber-400" };
  if (res?.status === "SEATED") return { cls: "border-indigo-500/40 bg-indigo-500/[0.1] text-indigo-100", label: "Oturdu", dot: "bg-indigo-400" };
  if (res?.status === "ARRIVED") return { cls: "border-purple-500/40 bg-purple-500/[0.1] text-purple-100", label: "Geldi", dot: "bg-purple-400" };
  if (res?.status === "PENDING" || res?.status === "CONFIRMED") return { cls: "border-sky-500/30 bg-sky-500/[0.08] text-sky-100", label: `Rezerve ${res.time}`, dot: "bg-sky-400" };
  return { cls: "border-white/10 bg-white/[0.03] text-white/70", label: "Boş", dot: "bg-emerald-400/70" };
}

export default function KasaClient({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);

  const fetchTables = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const r = await fetch("/api/admin/pos/tables");
      const d = await r.json();
      if (d.ok) setAreas(d.data);
      else toast.error(d.error || "Masalar alınamadı");
    } catch {
      toast.error("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTables();
    const i = setInterval(() => fetchTables(true), 20000);
    return () => clearInterval(i);
  }, [fetchTables]);

  const selectedTable = useMemo(() => {
    if (!selectedTableId) return null;
    for (const a of areas) for (const t of a.tables) if (t.id === selectedTableId) return { table: t, area: a };
    return null;
  }, [areas, selectedTableId]);

  const openOrder = selectedTable?.table.orders?.find((o) => o.status === "OPEN") ?? null;

  // Sunucudan dönen güncel adisyonu state'e işle (anlık güncelleme, ekstra fetch yok)
  const applyOrder = useCallback((order: Order) => {
    setAreas((prev) =>
      prev.map((a) => ({
        ...a,
        tables: a.tables.map((t) => {
          if (t.id !== order.tableId) return t;
          const others = (t.orders ?? []).filter((o) => o.id !== order.id);
          return { ...t, orders: order.status === "OPEN" ? [...others, order] : others };
        }),
      }))
    );
  }, []);

  async function openTable() {
    if (!selectedTable || busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/pos/order/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId: selectedTable.table.id, areaId: selectedTable.area.id }),
      });
      const d = await r.json();
      if (d.ok) { applyOrder(d.data); toast.success("Masa açıldı."); }
      else toast.error(d.error || "Açılamadı");
    } catch { toast.error("Bağlantı hatası"); } finally { setBusy(false); }
  }

  async function changeLine(productId: string, opts: { delta?: number; setQty?: number }) {
    if (!openOrder || busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/pos/order/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: openOrder.id, productId, ...opts }),
      });
      const d = await r.json();
      if (d.ok) applyOrder(d.data);
      else toast.error(d.error || "Güncellenemedi");
    } catch { toast.error("Bağlantı hatası"); } finally { setBusy(false); }
  }

  async function pay(method: "CASH" | "CREDIT_CARD") {
    if (!openOrder || busy) return;
    if (openOrder.totalAmount <= 0) return toast.error("Adisyon boş.");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/pos/order/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: openOrder.id, amountCents: openOrder.totalAmount, method }),
      });
      const d = await r.json();
      if (d.ok) {
        toast.success(`Hesap kesildi · ${method === "CASH" ? "Nakit" : "Kart"} ${lira(openOrder.totalAmount)}₺`);
        setSelectedTableId(null);
        await fetchTables(true);
      } else toast.error(d.error || "Ödeme alınamadı");
    } catch { toast.error("Bağlantı hatası"); } finally { setBusy(false); }
  }

  async function cancelOrder() {
    if (!openOrder || busy) return;
    if (!confirm("Bu adisyonu iptal edip masayı boşaltmak istiyor musunuz?")) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/pos/order/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: openOrder.id }),
      });
      const d = await r.json();
      if (d.ok) { toast.success("Adisyon iptal edildi."); setSelectedTableId(null); await fetchTables(true); }
      else toast.error(d.error || "İptal edilemedi");
    } catch { toast.error("Bağlantı hatası"); } finally { setBusy(false); }
  }

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialProducts.filter((p) => {
      const matchCat = activeCategory === "all" || p.categoryId === activeCategory;
      const matchSearch = !q || p.name.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [initialProducts, activeCategory, search]);

  const openTablesCount = useMemo(
    () => areas.reduce((n, a) => n + a.tables.filter((t) => t.orders?.some((o) => o.status === "OPEN")).length, 0),
    [areas]
  );

  // ─────────── ORDER SCREEN ───────────
  if (selectedTable) {
    const { table, area } = selectedTable;
    const res = table.reservations?.[0];
    return (
      <div className="flex h-[calc(100dvh-64px)] flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-3">
          <button onClick={() => setSelectedTableId(null)} className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-white/70 transition hover:bg-white/[0.08]">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-white">{table.name} <span className="text-white/30">·</span> <span className="text-sm font-medium text-white/50">{area.title}</span></h1>
            {res && <p className="text-xs text-white/40">{res.source === "WALK_IN" ? "Walk-in" : res.fullName} · {res.partySize} kişi · {res.time}</p>}
          </div>
          {openOrder && (
            <button onClick={cancelOrder} disabled={busy} className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/20 disabled:opacity-50">
              <Ban className="h-3.5 w-3.5" /> Adisyonu İptal
            </button>
          )}
        </div>

        {!openOrder ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-400"><Armchair className="h-9 w-9" /></div>
            <div>
              <p className="text-lg font-semibold text-white">Masa {res ? "rezervasyonu bekliyor" : "boş"}</p>
              <p className="text-sm text-white/40">{res ? "Müşteri geldiyse masayı açıp sipariş alın." : "Walk-in müşteri için masayı açın."}</p>
            </div>
            <button onClick={openTable} disabled={busy} className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-black shadow-lg shadow-amber-500/20 transition hover:shadow-amber-500/30 disabled:opacity-50">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Masayı Aç
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-4 overflow-hidden pt-4 lg:flex-row">
            {/* LEFT: product picker */}
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="mb-3 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Ürün ara..." className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 outline-none focus:border-amber-500/30" />
                </div>
              </div>
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                <CatBtn active={activeCategory === "all"} onClick={() => setActiveCategory("all")}>Tümü</CatBtn>
                {categories.map((c) => <CatBtn key={c.id} active={activeCategory === c.id} onClick={() => setActiveCategory(c.id)}>{c.name}</CatBtn>)}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-3">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((p) => (
                    <button key={p.id} onClick={() => changeLine(p.id, { delta: 1 })} disabled={busy}
                      className="group rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-left transition hover:border-amber-500/30 hover:bg-amber-500/[0.06] active:scale-[0.97] disabled:opacity-60">
                      <div className="text-sm font-medium text-white">{p.name}</div>
                      <div className="mt-1.5 text-base font-bold text-amber-400">{p.priceCents != null ? `${lira(p.priceCents)}₺` : "—"}</div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && <div className="col-span-full py-10 text-center text-sm text-white/30">Ürün bulunamadı</div>}
                </div>
              </div>
            </div>

            {/* RIGHT: bill */}
            <div className="flex w-full flex-col rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-transparent lg:w-[380px]">
              <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15"><Receipt className="h-4 w-4 text-amber-400" /></div>
                <div className="text-sm font-semibold text-white">Adisyon</div>
                <div className="ml-auto text-xs text-white/40">{openOrder.items.reduce((n, i) => n + i.quantity, 0)} ürün</div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                {openOrder.items.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-2 py-10 text-white/20">
                    <ShoppingCart className="h-9 w-9" /><span className="text-sm">Soldan ürün ekleyin</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {openOrder.items.map((it) => (
                      <div key={it.id} className="flex items-center gap-2 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-white">{it.product?.name ?? "Ürün"}</div>
                          <div className="text-xs text-white/40">{lira(it.priceCents)}₺ × {it.quantity}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => changeLine(it.productId, { delta: -1 })} disabled={busy} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08]"><Minus className="h-3 w-3" /></button>
                          <span className="w-5 text-center text-sm font-semibold text-white">{it.quantity}</span>
                          <button onClick={() => changeLine(it.productId, { delta: 1 })} disabled={busy} className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 transition hover:bg-amber-500/20"><Plus className="h-3 w-3" /></button>
                        </div>
                        <div className="w-16 text-right text-sm font-semibold text-white">{lira(it.priceCents * it.quantity)}₺</div>
                        <button onClick={() => changeLine(it.productId, { setQty: 0 })} disabled={busy} className="flex h-7 w-7 items-center justify-center rounded-lg text-white/20 transition hover:bg-red-500/10 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="border-t border-white/[0.06] px-4 py-3">
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-white/70">Toplam <span className="text-[10px] text-white/30">(KDV dahil)</span></span>
                  <span className="text-2xl font-bold text-amber-400">{lira(openOrder.totalAmount)}₺</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => pay("CASH")} disabled={busy || openOrder.totalAmount <= 0} className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white transition hover:bg-emerald-500 disabled:opacity-40">
                    <Wallet className="h-4 w-4" /> Nakit
                  </button>
                  <button onClick={() => pay("CREDIT_CARD")} disabled={busy || openOrder.totalAmount <= 0} className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 py-3 text-sm font-bold text-white transition hover:bg-sky-500 disabled:opacity-40">
                    <CreditCard className="h-4 w-4" /> Kart
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─────────── TABLES SCREEN ───────────
  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">Hızlı Satış</span>
          </h1>
          <p className="mt-0.5 text-xs text-white/40">Masaya dokunup adisyon açın · {openTablesCount} açık masa</p>
        </div>
        <button onClick={() => fetchTables()} disabled={loading} className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.08]">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Yenile
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading && areas.length === 0 ? (
          <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>
        ) : areas.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-white/30"><Armchair className="h-10 w-10" /><span className="text-sm">Aktif masa yok</span></div>
        ) : (
          <div className="space-y-8 pb-6">
            {areas.map((area) => (
              <div key={area.id}>
                <h2 className="mb-3 border-b border-white/[0.06] pb-2 text-sm font-semibold tracking-wide text-white/60 uppercase">{area.title}</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {area.tables.map((t) => {
                    const v = tableVisual(t);
                    const open = t.orders?.find((o) => o.status === "OPEN");
                    const res = t.reservations?.[0];
                    return (
                      <button key={t.id} onClick={() => setSelectedTableId(t.id)}
                        className={`relative flex h-28 flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 transition hover:scale-[1.02] active:scale-[0.98] ${v.cls}`}>
                        <span className="absolute right-2.5 top-2.5 flex items-center gap-1 text-[10px] font-medium opacity-80">
                          <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} /> {v.label}
                        </span>
                        <span className="text-lg font-bold">{t.name}</span>
                        {open ? (
                          <span className="rounded-full bg-black/20 px-2 py-0.5 text-xs font-bold">{lira(open.totalAmount)}₺</span>
                        ) : res ? (
                          <span className="flex items-center gap-2 text-[11px] opacity-80">
                            <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{res.partySize}</span>
                            <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{res.time}</span>
                          </span>
                        ) : (
                          <span className="text-[11px] opacity-50">Dokun → aç</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CatBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`shrink-0 rounded-xl px-4 py-2 text-xs font-medium transition ${active ? "bg-amber-500 text-black shadow-md shadow-amber-500/20" : "border border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70"}`}>
      {children}
    </button>
  );
}
