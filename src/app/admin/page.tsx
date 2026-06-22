import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { CalendarCheck, Users, Utensils, AlertTriangle, TrendingUp, Wallet, CreditCard, Receipt, ArrowRight } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const lira = (cents: number) => (cents / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default async function AdminDashboard() {
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  const [todayReservations, pendingReservations, activeTables, lowStockProducts, openOrders, paymentsToday] = await Promise.all([
    prisma.reservation.count({ where: { date: { gte: start, lte: end }, status: { not: "CANCELLED" } } }),
    prisma.reservation.count({ where: { status: "PENDING" } }),
    prisma.table.count({ where: { isActive: true } }),
    prisma.product.count({ where: { stockQty: { lte: 5 }, isActive: true } }),
    prisma.order.count({ where: { status: "OPEN" } }),
    prisma.payment.findMany({
      where: { status: "COMPLETED", createdAt: { gte: start, lte: end } },
      select: { amountCents: true, method: true },
    }),
  ]);

  // Gerçek günlük ciro (alınan ödemelerden)
  const realRevenue = paymentsToday.reduce((acc, p) => acc + p.amountCents, 0);
  const cash = paymentsToday.filter((p) => p.method === "CASH").reduce((a, p) => a + p.amountCents, 0);
  const card = paymentsToday.filter((p) => p.method === "CREDIT_CARD").reduce((a, p) => a + p.amountCents, 0);
  const other = realRevenue - cash - card;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
        <Link href="/admin/gun-sonu" className="flex items-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-400 transition hover:bg-amber-500/20">
          <Receipt className="h-4 w-4" /> Gün Sonu Raporu <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard label="Bugünkü Ciro (Gerçek)" value={`${lira(realRevenue)} ₺`} icon={<TrendingUp className="h-5 w-5" />} gradient="emerald" />
        <StatCard label="Açık Masalar" value={openOrders} icon={<Utensils className="h-5 w-5" />} gradient="amber" />
        <StatCard label="Bugünkü Rezervasyonlar" value={todayReservations} icon={<CalendarCheck className="h-5 w-5" />} gradient="sky" />
        <StatCard label="Bekleyen Rezervasyon" value={pendingReservations} icon={<Users className="h-5 w-5" />} gradient="violet" />
        <StatCard label="Aktif Masalar" value={activeTables} icon={<Utensils className="h-5 w-5" />} gradient="sky" />
        <StatCard
          label="Kritik Stok Uyarıları"
          value={lowStockProducts}
          icon={<AlertTriangle className="h-5 w-5" />}
          gradient="rose"
          trend={lowStockProducts > 0 ? { label: "Stok kontrolü yapın!", isPositive: false } : undefined}
        />
      </div>

      {/* Bugünün ödeme özeti */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Bugünün Tahsilat Özeti</h2>
          <span className="text-xs text-white/40">{paymentsToday.length} işlem</span>
        </div>
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
        {paymentsToday.length === 0 && <p className="mt-4 text-center text-sm text-white/30">Bugün henüz tahsilat yok. Hızlı Satış'tan adisyon kapatınca burada görünür.</p>}
      </div>
    </div>
  );
}
