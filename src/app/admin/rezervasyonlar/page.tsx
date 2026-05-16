import { CalendarCheck, Plus } from "lucide-react";
import { AdminReservationsBrowser } from "@/components/admin/AdminReservationsBrowser";
import { ButtonLink } from "@/components/ui/Button";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminReservationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <CalendarCheck className="h-6 w-6 text-amber-400" />
            Rezervasyonlar
          </h1>
        </div>
        <ButtonLink href="/admin/rezervasyonlar/yeni" className="gap-2">
          <Plus className="h-4 w-4" />
          Yeni Rezervasyon
        </ButtonLink>
      </div>

      <AdminReservationsBrowser />
    </div>
  );
}
