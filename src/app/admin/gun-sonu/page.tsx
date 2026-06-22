import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { Receipt, Wallet, CreditCard, TrendingUp, ShoppingBag, Trophy } from "lucide-react";
import { startOfDay, endOfDay, format, subDays } from "date-fns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const lira = (cents: number) => (cents / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const methodLabel = (m: string) => (m === "CASH" ? "Nakit" : m === "CREDIT_CARD" ? "Kart" : m === "IBAN" ? "IBAN" : "Diğer");

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> };

export default async function GunSonuPage({ searchParams }: Props) {
  const params = await searchParams;
  const dateParam = typeof params.date === "string" ? params.date : undefined;
  const base = dateParam ? new Date(`${dateParam}T12:00:00`) : new Date();
  const day = isNaN(base.getTime()) ? new Date() : base;
  const start = startOfDay(day);
  const end = endOfDay(day);
  const dateStr = format(day, "yyyy-MM-dd");
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const yesterdayStr = format(subDays(new Date(), 1), "yyyy-MM-dd");

  const [payments, closedOrders] = await Promise.all([
    prisma.payment.findMany({
      where: { status: "COMPLETED", createdAt: { gte: start, lte: end } },
      select: { amountCents: true, method: true },
    }),
    prisma.order.findMany({
      where: { status: "CLOSED", updatedAt: { gte: start, lte: end } },
      include: {
        table: { select: { name: true } },
        payments: { select: { method: true } },
        items: { select: { quantity: true, priceCents: true, product: { select: { name: true } } } },
      },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const total = payments.reduce((a, p) => a + p.amountCents, 0);
  const cash = payments.filter((p) => p.method === "CASH").reduce((a, p) => a + p.amountCents, 0);
  const card = payments.filter((p) => p.method === "CREDIT_CARD").reduce((a, p) => a + p.amountCents, 0);
  const other = total - cash - card;

  // En çok satan ürünler
  const productMap = new Map<string, { name: string; qty: number; total: number }>();
  let totalItems = 0;
  for (const o of closedOrders) {
    for (const it of o.items) {
      totalItems += it.quantity;
      const key = it.product?.name ?? "Ürün";
      const cur = productMap.get(key) ?? { name: key, qty: 0, total: 0 };
      cur.qty += it.quantity;
      cur.total += it.priceCents * it.quantity;
      productMap.set(key, cur);
    }
  }
  const topProducts = [...productMap.values()].sort((a, b) => b.total - a.total).slice(0, 8);
  const avgTicket = closedOrders.length > 0 ? total / closedOrders.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-100">
            <Receipt className="h-6 w-6 text-amber-400" /> Gün Sonu Raporu
          </h1>
          <p className="mt-1 text-sm text-white/40">{format(day, "dd.MM.yyyy")} · {closedOrders.length} adisyon kapatıldı</p>
        </div>
        <form method="get" action="/admin/gun-sonu" className="flex items-center gap-2">
          <Link href={`/admin/gun-sonu?date=${yesterdayStr}`} className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/60 hover:bg-white/[0.08]">Dün</Link>
          <Link href={`/admin/gun-sonu?date=${todayStr}`} className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/60 hover:bg-white/[0.08]">Bugün</Link>
          <input type="date" name="date" defaultValue={dateStr} className="rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-amber-500/30 [color-scheme:dark]" />
          <button type="submit" className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400">Getir</button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Toplam Ciro" value={`${lira(total)} ₺`} icon={<TrendingUp className="h-5 w-5" />} gradient="emerald" />
        <StatCard label="Adisyon Sayısı" value={closedOrders.length} icon={<Receipt className="h-5 w-5" />} gradient="amber" />
        <StatCard label="Satılan Ürün" value={totalItems} icon={<ShoppingBag className="h-5 w-5" />} gradient="sky" />
        <StatCard label="Ortalama Adisyon" value={`${lira(avgTicket)} ₺`} icon={<TrendingUp className="h-5 w-5" />} gradient="violet" />
      </div>

      {/* Ödeme türü kırılımı */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400"><Wallet className="h-5 w-5" /></div>
          <div><div className="text-xs text-white/40">Nakit</div><div className="text-lg font-bold text-white">{lira(cash)} ₺</div></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sky-500/15 bg-sky-500/[0.06] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400"><CreditCard className="h-5 w-5" /></div>
          <div><div className="text-xs text-white/40">Kredi Kartı</div><div className="text-lg font-bold text-white">{lira(card)} ₺</div></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/60"><Receipt className="h-5 w-5" /></div>
          <div><div className="text-xs text-white/40">Diğer</div><div className="text-lg font-bold text-white">{lira(other)} ₺</div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* En çok satanlar */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white"><Trophy className="h-4 w-4 text-amber-400" /> En Çok Satan Ürünler</h2>
          {topProducts.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/30">Bu gün için satış yok.</p>
          ) : (
            <ul className="space-y-2">
              {topProducts.map((p, i) => (
                <li key={p.name} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-xs font-bold text-amber-400">{i + 1}</span>
                  <span className="flex-1 truncate text-white/80">{p.name}</span>
                  <span className="text-white/40">{p.qty} adet</span>
                  <span className="w-20 text-right font-semibold text-white">{lira(p.total)}₺</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Adisyon listesi */}
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-white"><Receipt className="h-4 w-4 text-amber-400" /> Kapatılan Adisyonlar</h2>
          {closedOrders.length === 0 ? (
            <p className="py-6 text-center text-sm text-white/30">Bu gün kapatılan adisyon yok.</p>
          ) : (
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {closedOrders.map((o) => (
                <li key={o.id} className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2 text-sm">
                  <span className="font-medium text-white">{o.table?.name ?? "—"}</span>
                  <span className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white/50">{o.payments.map((p) => methodLabel(p.method)).join(", ") || "—"}</span>
                  <span className="ml-auto font-semibold text-amber-400">{lira(o.totalAmount)}₺</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
