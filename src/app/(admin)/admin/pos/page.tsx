import { redirect } from "next/navigation";

// Eski POS ekranı, tek "Hızlı Satış" akışında (/admin/kasa) birleştirildi.
export default function PosRedirect() {
  redirect("/admin/kasa");
}
