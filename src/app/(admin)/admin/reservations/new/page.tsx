import { redirect } from "next/navigation";

export default function NewReservationRedirect() {
  redirect("/admin/rezervasyonlar/yeni");
}
