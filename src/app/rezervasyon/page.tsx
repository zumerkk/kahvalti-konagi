import { Navbar } from "@/components/Navbar";
import { ReservationForm } from "@/components/ReservationForm";
import { Clock, Info, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Rezervasyon Yap",
  description: "Kırıkkale Kahvaltı Konağı için online rezervasyon yapın. Hafta sonu açık büfe kahvaltı veya cafe masanızı anında ayırtın. Hızlı ve güvenli rezervasyon sistemi.",
  keywords: ["Kırıkkale rezervasyon", "Kırıkkale kahvaltı mekanları rezervasyon", "Kahvaltı Konağı masa ayırtma"],
  alternates: {
    canonical: "/rezervasyon",
  },
};

export default function ReservationPage() {
  return (
    <div className="flex flex-1 flex-col bg-background text-[#3d3023] selection:bg-orange-200/50">
      <Navbar />
      
      <main className="flex-1 pb-20">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-[#e6dfd5]/40 bg-gradient-to-b from-orange-50/60 to-white py-12 md:py-16">
          <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />
          
          <div className="relative mx-auto max-w-3xl px-5 text-center">
            <span className="text-2xl">🥞</span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-[#3d3023] md:text-5xl">
              Masanızı <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Hemen Ayırtın</span>
            </h1>
            <p className="mt-4 text-[#7c6f62] font-semibold leading-relaxed">
              Kırıkkale'nin en nefis açık büfe kahvaltısı ve cafe keyfi için online rezervasyon formunu doldurun. Masanız anında adınıza rezerve edilsin!
            </p>
          </div>
        </section>

        {/* Reservation Form Wrapper */}
        <section className="mx-auto max-w-3xl px-5 py-10">
          <ReservationForm />
        </section>

        {/* Extra Security/Info badging */}
        <section className="mx-auto max-w-3xl px-5 flex flex-col sm:flex-row gap-6 justify-center items-center mt-6 text-xs text-[#8c7d6c] font-bold">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
            <span>%100 Güvenli & KVKK Uyumlu</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500 shrink-0" />
            <span>Anında Otomatik Masa Ataması</span>
          </div>
        </section>
      </main>
    </div>
  );
}
