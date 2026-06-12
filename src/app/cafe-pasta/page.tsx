import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Star, MapPin, Clock, Phone, ArrowRight, Coffee, Heart, Check } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Kırıkkale Cafe & Pasta Salonu - Tatlı ve Kahve Keyfi | Kahvaltı Konağı",
  description:
    "Kırıkkale'nin en nezih cafesi ve pasta salonu: Kahvaltı Konağı. 15:00 sonrası taze kahveler, Mascarpone'li Tiramisu, Alman Pastası, Ekler ve Trileçe lezzetleri. Rezervasyon yapın.",
  alternates: {
    canonical: "/cafe-pasta",
  },
  keywords: [
    "Kırıkkale cafe",
    "Kırıkkale pasta cafe",
    "Kırıkkale tatlı mekanları",
    "Kırıkkale en iyi cafe",
    "Kırıkkale tiramisu",
    "Kırıkkale alman pastası",
    "Kırıkkale ekler trileçe",
    "Kırıkkale kahve keyfi",
    "Kırıkkale merkez cafe"
  ],
};

export default function CafePastaSeoPage() {
  const phoneText = "+90 546 898 30 14";
  const phoneHref = "tel:+905468983014";
  const address = "Yenimahalle Tuna Caddesi 55/B Kırıkkale/Merkez";
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);

  // Cafe and Bakery JSON-LD LocalBusiness Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CafeOrCoffeeShop",
        "@id": "https://kahvaltikonagi.com.tr/cafe-pasta/#cafe",
        "name": "Kahvaltı Konağı Cafe & Butik Pasta Salonu",
        "image": "https://kahvaltikonagi.com.tr/media/cafe_desserts.png",
        "description": "Kırıkkale'de 15:00 ile 23:00 saatleri arasında butik kahveler ve taze el yapımı İtalyan Tiramisusu, Alman Pastası lezzetleri sunan cafe.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yenimahalle Tuna Caddesi 55/B",
          "addressLocality": "Kırıkkale",
          "addressRegion": "Merkez",
          "addressCountry": "TR"
        },
        "telephone": "+905468983014",
        "priceRange": "₺₺",
        "servesCuisine": ["Coffee", "Desserts", "Bakery"],
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "15:00",
          "closes": "23:00"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://kahvaltikonagi.com.tr/cafe-pasta/#breadcrumb",
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
            "name": "Cafe & Pasta",
            "item": "https://kahvaltikonagi.com.tr/cafe-pasta"
          }
        ]
      }
    ]
  };

  const signatureDesserts = [
    {
      name: "Gourmet İtalyan Tiramisu 🍰",
      desc: "Orijinal savoyer kedidili bisküvileri, espresso şurubu ve gerçek Mascarpone peynirli özel kreması ile hazırlanan imza lezzetimiz."
    },
    {
      name: "Klasik Alman Pastası 🥐",
      desc: "Yumuşacık mayalı hamur arasında hafif vanilyalı pastacı kreması ve taze muz dilimleri dolgusu, üzeri pudra şekeri kaplı."
    },
    {
      name: "Taze Çikolatalı Ekler 🍫",
      desc: "İçi yoğun kremalı çıtır şö hamuru, üzeri enfes Belçika çikolatası ganajı ile kaplı günlük taze porsiyonluk ekler."
    },
    {
      name: "Karamelli Trileçe 🥛",
      desc: "Üç farklı özel süt karışımıyla ıslatılmış pamuk gibi pandispanya ve üzerinde el yapımı nefis karamel sosu."
    }
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
              <Star className="h-3.5 w-3.5 fill-orange-600 text-orange-600 animate-pulse" />
              15:00 Sonrası Butik Cafe & Bistro Keyfi 🍰
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#3d3023] leading-tight">
                  Kırıkkale'de Keyifli <br />
                  <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Cafe & Pasta</span> Durağınız
                </h1>
                <p className="text-base md:text-lg text-[#5c4d3c] leading-relaxed max-w-2xl">
                  Günün tatlı bir mola zamanında, <b>Kahvaltı Konağı Cafe</b> bölümüyle kapılarını aralıyor. Profesyonel baristalarımızın hazırladığı sıcak & soğuk nitelikli kahveler ve günlük taze butik pastalarımızla sohbetlerinizi tatlandırıyoruz.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-[#5c4d3c] font-bold text-sm bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>Her Gün: 15:00 - 23:00</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5c4d3c] font-bold text-sm bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
                    <Coffee className="h-4 w-4 text-orange-600" />
                    <span>Barista Kahveleri & Taze Tatlılar</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <ButtonLink href="/rezervasyon" variant="primary" className="px-8 py-4">
                    Masa Rezervasyonu Yap
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonLink>
                  <a
                    href={phoneHref}
                    className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-8 py-4 text-sm font-bold text-orange-950 hover:bg-orange-100 transition shadow-sm"
                  >
                    <Phone className="mr-2 h-4 w-4 text-orange-600" />
                    Arama Yap: {phoneText}
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 relative aspect-square rounded-[3rem] overflow-hidden border border-orange-200/60 bg-white p-4 shadow-xl shadow-orange-950/5">
                <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
                  <Image
                    src="/media/cafe_desserts.png"
                    alt="Kırıkkale Kahvaltı Konağı Cafe ve Tatlı Bölümü Görünümü"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-md border border-[#e6dfd5] p-4 rounded-2xl flex items-center justify-between shadow-md">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-[#8c7d6c]">Taze Nitelikli</p>
                        <p className="text-sm font-black text-orange-600">Espresso & Soğuk Kahveler</p>
                      </div>
                      <span className="text-[11px] bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-full font-bold">
                        Butik Barista
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIGNATURE DESSERTS SECTION */}
        <section className="py-16 md:py-24 bg-white border-b border-[#e6dfd5]/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600">Menüden Seçkiler</h2>
              <p className="text-3xl font-extrabold text-[#3d3023] md:text-4xl">Özel Butik Pastalarımız ve Tatlılarımız</p>
              <p className="text-[#7c6f62] text-sm md:text-base leading-relaxed">
                Kırıkkale'de başka hiçbir yerde bulamayacağınız, tamamen kendi mutfağımızda günlük olarak üretilen imza lezzetlerimiz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {signatureDesserts.map((dessert, idx) => (
                <div key={idx} className="p-6 rounded-[2rem] border border-[#e6dfd5] bg-[#faf6ee]/30 hover:border-orange-300 hover:bg-white hover:shadow-md transition duration-300 flex items-start gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 text-lg">
                    ❤️
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-[#3d3023]">{dessert.name}</h3>
                    <p className="text-xs text-[#7c6f62] leading-relaxed font-medium">{dessert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* COFFEE SECTION */}
        <section className="py-16 md:py-24 bg-[#faf6ee]/50">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#3d3023]">
                  Taze Kavrulmuş Çekirdeklerden <br />
                  <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Nitelikli Kahve Deneyimi</span>
                </h2>
                <p className="text-[#7c6f62] leading-relaxed font-medium">
                  Kahve tutkumuzu bardağınıza taşıyoruz. Dünyanın en seçkin kahve çiftliklerinden gelen %100 Arabica çekirdeklerini en ideal dereceyle öğütüyor, Espresso, Latte, Cappuccino ve buzlu soğuk kahve seçeneklerimizi taze taze servis ediyoruz.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-[#5c4d3c]">Sıcak Kahve Çeşitleri</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-[#5c4d3c]">Soğuk & Milkshake</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-[#5c4d3c]">Özel Demleme Filtre</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                    <span className="text-sm font-bold text-[#5c4d3c]">Yöresel Türk Kahvesi</span>
                  </div>
                </div>
              </div>
              
              <div className="p-8 rounded-[2.5rem] border border-orange-200/60 bg-white shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 h-24 w-24 bg-orange-500/5 rounded-bl-full pointer-events-none" />
                <h3 className="text-xl font-extrabold text-[#3d3023] mb-4">Cafe Çalışma Saatleri</h3>
                <p className="text-sm text-[#7c6f62] leading-relaxed mb-6 font-medium">
                  Kırıkkale'de akşam sohbetlerinin, ders çalışma ve kitap okuma molalarının vazgeçilmez adresi.
                </p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-[#faf6ee] pb-2 font-bold">
                    <span className="text-[#7c6f62]">Pazartesi - Cuma</span>
                    <span className="text-orange-600">15:00 - 23:00</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-[#faf6ee] pb-2 font-bold">
                    <span className="text-[#7c6f62]">Cumartesi - Pazar</span>
                    <span className="text-orange-600">15:00 - 23:00</span>
                  </div>
                </div>
                <div className="pt-6">
                  <ButtonLink href="/rezervasyon" variant="primary" className="w-full">
                    Grup Rezervasyonu Yap
                  </ButtonLink>
                </div>
              </div>
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
            &copy; {new Date().getFullYear()} Kahvaltı Konağı. Tüm Hakları Saklıdır. Kırıkkale Butik Cafe, Pasta ve Kahve Hizmetleri.
          </p>
        </div>
      </footer>
    </div>
  );
}
