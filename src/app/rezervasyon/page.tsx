import { Navbar } from "@/components/Navbar";
import { ReservationForm } from "@/components/ReservationForm";

export const metadata = {
  title: "Online Rezervasyon | Kahvaltı Konağı",
};

export default function ReservationPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_0%,rgba(245,158,11,0.22),transparent_55%),radial-gradient(900px_circle_at_80%_10%,rgba(255,255,255,0.06),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.65),rgba(0,0,0,0.95))]" />
          <div className="relative mx-auto max-w-3xl px-5 py-14">
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Online Rezervasyon</h1>
            <div className="mt-3 space-y-2 text-white/70 leading-7">
              <p>
                Lütfen hizmeti ve alanı seçip uygun saat aralığından devam edin:
              </p>
              <ul className="list-disc pl-5">
                <li>
                  <b>Kahvaltı</b>: 08:00–14:00
                </li>
                <li>
                  <b>Kafe</b>: 14:00–23:00
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-5 py-10">
          <ReservationForm />
        </section>
      </main>
    </div>
  );
}
