import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { AdminReservationsBrowser } from "@/components/admin/AdminReservationsBrowser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminReservationsWithFiltersPage() {
  return (
    <div>
      <AdminTopbar title="Rezervasyonlar (Filtreli)" description="Tarih/servis/alan/durum filtreleyin." />
      <AdminReservationsBrowser />
    </div>
  );
}

