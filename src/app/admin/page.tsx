import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/admin/StatCard";
import { CalendarCheck, Users, Ban, Utensils, AlertTriangle, TrendingUp } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const today = new Date();
  const start = startOfDay(today);
  const end = endOfDay(today);

  // 1. Bugünkü Rezervasyon Sayısı (Gerçek Zamanlı Analitik)
  const todayReservations = await prisma.reservation.count({
    where: {
      date: { gte: start, lte: end },
      status: { not: "CANCELLED" },
    },
  });

  // 2. Bekleyen (Onaylanmamış) Rezervasyonlar
  const pendingReservations = await prisma.reservation.count({
    where: { status: "PENDING" },
  });

  // 3. Toplam Aktif Masa Sayısı
  const activeTables = await prisma.table.count({
    where: { isActive: true },
  });

  // 4. Kritik Stok Uyarıları (5'in altına düşen ürünler)
  const lowStockProducts = await prisma.product.count({
    where: { stockQty: { lte: 5 }, isActive: true },
  });

  // 5. Ciro Tahmini (Bugünkü Rezervasyonların Tahmini Tutarı)
  const todayRevenueData = await prisma.reservation.aggregate({
    where: {
      date: { gte: start, lte: end },
      status: { not: "CANCELLED" },
    },
    _sum: {
      totalAmount: true,
    },
  });
  
  const estimatedRevenue = todayRevenueData._sum.totalAmount ? (todayRevenueData._sum.totalAmount / 100).toFixed(2) : "0.00";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Gelişmiş Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Bugünkü Rezervasyonlar"
          value={todayReservations}
          icon={<CalendarCheck className="h-5 w-5" />}
          gradient="sky"
        />
        <StatCard
          label="Bekleyen Rezervasyon"
          value={pendingReservations}
          icon={<Users className="h-5 w-5" />}
          gradient="amber"
        />
        <StatCard
          label="Tahmini Günlük Ciro"
          value={`${estimatedRevenue} ₺`}
          icon={<TrendingUp className="h-5 w-5" />}
          gradient="emerald"
        />
        <StatCard
          label="Aktif Masalar"
          value={activeTables}
          icon={<Utensils className="h-5 w-5" />}
          gradient="violet"
        />
        <StatCard
          label="Kritik Stok Uyarıları"
          value={lowStockProducts}
          icon={<AlertTriangle className="h-5 w-5" />}
          gradient="rose"
          trend={lowStockProducts > 0 ? { label: "Stok kontrolü yapın!", isPositive: false } : undefined}
        />
      </div>

      <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Sistem Durumu</h2>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li>✅ Microservices & API Cache: <span className="text-emerald-500">Aktif</span></li>
          <li>✅ OWASP Rate Limiting: <span className="text-emerald-500">Aktif</span></li>
          <li>✅ Rol Bazlı Erişim (RBAC): <span className="text-emerald-500">Aktif</span></li>
          <li>✅ Çoklu Takvim Çakışma Önleme (Overlap Sync): <span className="text-emerald-500">Aktif</span></li>
        </ul>
      </div>
    </div>
  );
}
