import { AdminManualReservationForm } from "@/components/admin/AdminManualReservationForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewAdminReservationPage() {
  return <AdminManualReservationForm />;
}
