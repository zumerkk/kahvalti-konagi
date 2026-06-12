import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Star, MapPin, Clock, Phone, ArrowRight, Utensils, Check } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Kırıkkale Açık Büfe Kahvaltı - En İyi Kahvaltı Mekanları | Kahvaltı Konağı",
  description:
    "Kırıkkale'nin en popüler açık büfe kahvaltı salonu: Kahvaltı Konağı. Her gün 08:00 - 15:00 saatleri arasında 450₺'ye sınırsız kahvaltı keyfi. Hemen rezervasyon yapın.",
  alternates: {
    canonical: "/kahvalti",
  },
  keywords: [
    "Kırıkkale açık büfe kahvaltı",
    "Kırıkkale kahvaltı mekanları",
    "Kırıkkale serpme kahvaltı",
    "Kırıkkale kahvaltı salonu",
    "Kahvaltı Konağı fiyatı",
    "Kırıkkale en ucuz kahvaltı",
    "Kırıkkale en iyi kahvaltı",
    "Kırıkkale merkez kahvaltı"
  ],
};

export default function BreakfastSeoPage() {
  const phoneText = "+90 546 898 30 14";
  const phoneHref = "tel:+905468983014";
  const address = "Yenimahalle Tuna Caddesi 55/B Kırıkkale/Merkez";
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);

  // Specialized FoodEstablishment Service Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FoodEstablishment",
        "@id": "https://kahvaltikonagi.com.tr/kahvalti/#service",
        "name": "Kahvaltı Konağı Sınırsız Açık Büfe Kahvaltı",
        "image": "https://kahvaltikonagi.com.tr/media/turkish_breakfast_spread.png",
        "description": "Kırıkkale'de her gün 08:00 ile 15:00 saatleri arasında kişi başı sadece 450₺'ye sınırsız açık büfe kahvaltı.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yenimahalle Tuna Caddesi 55/B",
          "addressLocality": "Kırıkkale",
          "addressRegion": "Merkez",
          "addressCountry": "TR"
        },
        "telephone": "+905468983014",
        "priceRange": "₺₺",
        "servesCuisine": "Turkish Breakfast",
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "08:00",
          "closes": "15:00"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://kahvaltikonagi.com.tr/kahvalti/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Ana Sayfa",
            "item": "https://kahvaltikonagi.com.tr/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Açık Büfe Kahvaltı",
            "item": "https://kahvaltikonagi.com.tr/kahvalti"
          }
        ]
      }
    ]
  };

  const breakfastHighlights = [
    "Sıcak Pişi ve Sigara Böreği 🥐",
    "Gözleme ve Menemen Çeşitleri 🍳",
    "Doğal Petek ve Süzme Bal 🍯",
    "Yöresel Peynir Çeşitleri 🧀",
    "Ev Yapımı Doğal Reçeller 🍓",
    "Organik Köy Tereyağı 🧈",
    "Siyah ve Yeşil Zeytin Seçenekleri 🫒",
    "Sınırsız Demleme Türk Çayı ☕"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-[#3d3023] selection:bg-orange-200/50">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-b from-orange-50/50 via-[#faf6ee] to-white border-b border-[#e6dfd5]/40">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

          <div className="mx-auto max-w-6xl px-5 relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700 shadow-sm mb-6">
              <Star className="h-3.5 w-3.5 fill-orange-600 text-orange-600 animate-spin" />
              Kırıkkale'nin 1 Numaralı Kahvaltı Salonu 🍳
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#3d3023] leading-tight">
                  Kırıkkale <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Açık Büfe Kahvaltı</span> & Serpme Lezzet Konağı
                </h1>
                <p className="text-base md:text-lg text-[#5c4d3c] leading-relaxed max-w-2xl">
                  Güne enfes ve zengin bir başlangıç yapmak isteyenler için <b>Kahvaltı Konağı</b>, Kırıkkale merkezinde benzersiz bir açık büfe deneyimi sunuyor. Tamamen doğal, taze ve yöresel lezzetlerle hazırlanmış menümüzle her sabah sizlerleyiz.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[#5c4d3c] font-bold text-sm bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Her Gün: 08:00 - 15:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5c4d3c] font-bold text-sm bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
                    <Utensils className="h-4 w-4 text-orange-600" />
                    <span>Kişi Başı: 450₺ (Sınırsız)</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <ButtonLink href="/rezervasyon" variant="primary" className="px-8 py-4">
                    Online Masa Rezervasyonu Yap
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonLink>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-8 py-4 text-sm font-bold text-orange-950 hover:bg-orange-100 transition shadow-sm"
                  >
                    <Phone className="mr-2 h-4 w-4 text-orange-600" />
                    Bizi Arayın: {phoneText}
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-square rounded-[3rem] overflow-hidden border border-orange-200/60 bg-white p-4 shadow-xl shadow-orange-950/5">
                <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
                  <Image
                    src="/media/turkish_breakfast_spread.png"
                    alt="Kırıkkale Kahvaltı Konağı Zengin Açık Büfe Sunumu"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-md border border-[#e6dfd5] p-4 rounded-2xl flex items-center justify-between shadow-md">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#8c7d6c]">Sınırsız Açık Büfe</p>
                        <p className="text-lg font-black text-orange-600">Sadece 450 ₺</p>
                      </div>
                      <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full font-bold">
                        Her Şey Dahil
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section className="py-16 md:py-24 bg-white border-b border-[#e6dfd5]/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600">Neler Var?</h2>
              <p className="text-3xl font-extrabold text-[#3d3023] md:text-4xl">Kahvaltı Konağı'nda Sizi Neler Bekliyor?</p>
              <p className="text-[#7c6f62] text-sm md:text-base leading-relaxed">
                Kırıkkale'nin en nezih ve kaliteli kahvaltı salonunda, taze sıcaklardan ev yapımı tatlı reçellere kadar 40'tan fazla çeşit açık büfede sizleri bekliyor.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {breakfastHighlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-5 rounded-2xl border border-[#e6dfd5] bg-[#faf6ee]/30 hover:border-orange-300 hover:bg-white hover:shadow-md transition duration-300">
                  <div className="h-8 w-8 shrink-0 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                    <Check className="h-4 w-4 stroke-[3]" />
                  </div>
                  <span className="font-bold text-sm text-[#5c4d3c]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* INFO CALLOUT SECTION */}
        <section className="py-16 md:py-24 bg-[#faf6ee]/50">
          <div className="mx-auto max-w-4xl px-5 text-center space-y-8 relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-[#3d3023]">
              Kırıkkale'de Ailenizle ve Sevdiklerinizle <br />
              <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Unutulmaz Bir Sabah Keyfi</span>
            </h2>
            <p className="text-[#7c6f62] text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
              Tuna Caddesi'ndeki ferah salonumuzda ve geniş kış bahçemizde (camekan bölümü), çocuk oyun alanları ve konforlu masalarımızla hizmet veriyoruz. Rezervasyon sistemi sayesinde masanız siz gelmeden önce sizin için hazır tutulur.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <ButtonLink href="/rezervasyon" variant="primary" className="px-8 py-4 w-full sm:w-auto">
                Şimdi Masanı Ayır
              </ButtonLink>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-8 py-4 text-sm font-bold text-orange-950 hover:bg-orange-100 transition w-full sm:w-auto shadow-sm"
              >
                <MapPin className="mr-2 h-4 w-4 text-orange-600" />
                Yol Tarifi Al
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#e6dfd5]/60 bg-[#faf6ee] py-12 text-center text-sm font-semibold text-[#8c7d6c]">
        <div className="mx-auto max-w-6xl px-5 space-y-3">
          <p className="font-bold text-[#3d3023]">Kahvaltı Konağı Kırıkkale Merkez</p>
          <p className="max-w-md mx-auto text-xs leading-relaxed text-[#7c6f62]">
            Adres: {address} <br />
            Rezervasyon & İletişim Hattı: {phoneText}
          </p>
          <p className="text-[11px] pt-4 border-t border-[#e6dfd5]/40 text-[#8c7d6c]/60">
            &copy; {new Date().getFullYear()} Kahvaltı Konağı. Tüm Hakları Saklıdır. Kırıkkale Açık Büfe Kahvaltı ve Cafe Hizmetleri.
          </p>
        </div>
      </footer>
    </div>
  );
}
