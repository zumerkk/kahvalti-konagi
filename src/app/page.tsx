import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Star, MapPin, Clock, Phone, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const phoneText = "+90 546 898 30 14";
  const phoneHref = "tel:+905468983014";
  const address = "Yenimahalle Tuna Caddesi 55/B Kırıkkale/Merkez";
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);

  // LocalBusiness Schema Markup for Local SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Restaurant",
        "@id": "https://kahvaltikonagi.com.tr/#localbusiness",
        "name": "Kahvaltı Konağı",
        "image": "https://kahvaltikonagi.com.tr/media/mekan.jpeg",
        "description": "Kırıkkale'nin en iyi açık büfe kahvaltı mekanı ve kafesi. Kahve ve tatlı keyfi.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Yenimahalle Tuna Caddesi 55/B",
          "addressLocality": "Kırıkkale",
          "addressRegion": "Merkez",
          "addressCountry": "TR"
        },
        "telephone": "+905468983014",
        "servesCuisine": ["Breakfast", "Turkish", "Cafe"],
        "url": "https://kahvaltikonagi.com.tr",
        "priceRange": "$$"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://kahvaltikonagi.com.tr/#breadcrumb",
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
            "name": "Menü",
            "item": "https://kahvaltikonagi.com.tr/menu"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Rezervasyon",
            "item": "https://kahvaltikonagi.com.tr/rezervasyon"
          }
        ]
      }
    ]
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-950 text-white">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />

      <main className="flex-1 bg-zinc-950 text-white">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(1100px_circle_at_20%_0%,rgba(245,158,11,0.18),transparent_55%),radial-gradient(800px_circle_at_80%_10%,rgba(15,23,42,0.06),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,9,11,0.95),rgba(9,9,11,1))]" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-zinc-950 px-3 py-1 text-xs text-zinc-400 shadow-sm">
                <Star className="h-4 w-4 text-amber-600" />
                Kırıkkale’nin en çok tercih edilen kahvaltı mekanı
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Kırıkkale'de <span className="text-amber-700">Açık Büfe Kahvaltı</span> & Cafe Deneyimi
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 md:text-lg">
                <b>Kahvaltı Konağı:</b> Kırıkkale'nin merkezinde 08:00–14:00 arası 350₺'ye sınırsız açık büfe kahvaltı.{" "}
                <b>14:00 sonrası:</b> Cafe bölümümüzde en taze kahve çeşitleri, özel tatlılar (tiramisu, ekler, trileçe) ile keyifli sohbetler sizi bekliyor.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/rezervasyon" variant="primary">
                  Rezervasyon Yap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href="/menu"
                  variant="secondary"
                  className="border border-white/10 bg-zinc-950 text-white shadow-sm hover:bg-zinc-900"
                >
                  Menüyü İncele
                  <ArrowRight className="ml-2 h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href="#iletisim"
                  variant="ghost"
                  className="text-zinc-300 hover:bg-zinc-800"
                >
                  Yol Tarifi
                </ButtonLink>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 text-sm text-zinc-300 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-white">Kahvaltı</span>
                  </div>
                  <div className="mt-2">08:00–14:00 (sınırsız açık büfe)</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-white">Konum</span>
                  </div>
                  <div className="mt-2">Kırıkkale / Merkez</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-700" />
                    <span className="font-medium text-white">Telefon</span>
                  </div>
                  <div className="mt-2">
                    <a className="hover:text-white" href={phoneHref}>
                      {phoneText}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(420px_circle_at_50%_30%,rgba(245,158,11,0.25),transparent_60%)] blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 p-6 shadow-sm">
                <div className="h-full w-full rounded-[2rem] bg-zinc-900 p-6">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-xs font-medium tracking-wide text-zinc-500">
                        Bugünün planı
                      </div>
                      <div className="text-2xl font-semibold tracking-tight text-white">
                        Kahvaltı + Cafe & Bistro
                      </div>
                    <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
                      <Image
                        src="/media/mekan.jpeg"
                        alt="Kırıkkale Kahvaltı Konağı - Premium Açık Büfe Kahvaltı ve Cafe Mekan Görseli"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-slate-900/0 to-slate-900/0" />
                    </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                        <div className="text-xs text-zinc-500">Kahvaltı</div>
                        <div className="mt-1 text-lg font-semibold text-white">08:00–14:00</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                        <div className="text-xs text-zinc-500">Kişi başı</div>
                        <div className="mt-1 text-lg font-semibold text-white">350₺</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                        <div className="text-xs text-zinc-500">Cafe & Bistro</div>
                        <div className="mt-1 text-lg font-semibold text-white">14:00 sonrası</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
                        <div className="text-xs text-zinc-500">Tatlılar</div>
                        <div className="mt-1 text-lg font-semibold text-white">Tiramisu +</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="hakkinda" className="border-t border-white/10 bg-zinc-950">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Kırıkkale Kahvaltı Konağı
                </h2>
                <p className="mt-4 leading-7 text-zinc-400">
                  Kırıkkale’de açık büfe kahvaltıyı “özel gün” gibi yaşatmak için buradayız: ferah
                  mekân, özenli servis, taze ürünler ve sıcak lezzetler.
                </p>
                <p className="mt-4 leading-7 text-zinc-400">
                  Kahvaltı servisimiz <b>08:00–14:00</b> arası. <b>14:00 sonrası</b> ise Cafe & Bistro
                  konseptiyle kahve ve tatlı servisimiz devam eder.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/rezervasyon" variant="primary">
                    Hemen Rezervasyon
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink
                    href="/menu"
                    variant="secondary"
                    className="border border-white/10 bg-zinc-950 text-white shadow-sm hover:bg-zinc-900"
                  >
                    Menüye Göz At
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonLink>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: "350₺ kişi başı", desc: "Sınırsız açık büfe kahvaltı." },
                  { title: "08:00–14:00", desc: "Kahvaltı servis saatleri." },
                  { title: "Cafe & Bistro", desc: "14:00 sonrası kahve & tatlı." },
                  { title: "Tatlı seçkisi", desc: "Tiramisu, ekler, trileçe, alman pastası." },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-sm"
                  >
                    <div className="text-sm font-semibold">{f.title}</div>
                    <div className="mt-2 text-sm leading-6 text-zinc-400">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MENU */}
        <section id="menu" className="border-t border-white/10 bg-zinc-900">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Açık Büfe Kahvaltı (08:00–14:00)
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
                  Peynir çeşitleri, sıcaklar, yöresel lezzetler, reçeller, zeytinler ve daha fazlası…
                  <b> 350₺ kişi başı</b> sınırsız açık büfe.
                </p>
              </div>
              <div className="hidden items-center gap-3 sm:flex">
                <ButtonLink
                  href="/menu"
                  variant="secondary"
                  className="border border-white/10 bg-zinc-950 text-white shadow-sm hover:bg-zinc-900"
                >
                  Menü Detayı
                </ButtonLink>
                <ButtonLink href="/rezervasyon" variant="primary">
                  Rezervasyon Yap
                </ButtonLink>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Sıcak çeşitler",
                "Peynir & şarküteri",
                "Yöresel reçeller",
                "Taze ekmekler",
                "Zeytin & mezeler",
                "Çay / kahve",
              ].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-zinc-950 p-5 shadow-sm">
                  <div className="text-sm font-semibold">{i}</div>
                  <div className="mt-2 text-sm text-zinc-400">
                    Lezzet standardımızı her servis aynı özenle koruruz.
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="text-xs font-medium tracking-wide text-zinc-500">
                    14:00 sonrası
                  </div>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight md:text-2xl">
                    Cafe & Bistro: kahve + tatlı
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
                    Günün devamında kahve eşliğinde tatlı seçkimizle keyifli bir mola verin.
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                    {["Tiramisu", "Ekler", "Trileçe", "Alman pastası"].map((d) => (
                      <li
                        key={d}
                        className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 font-medium text-amber-900"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/menu" variant="primary">
                    Cafe & Bistro Menüsü
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </ButtonLink>
                  <ButtonLink
                    href="/rezervasyon"
                    variant="secondary"
                    className="border border-white/10 bg-zinc-950 text-white shadow-sm hover:bg-zinc-900"
                  >
                    Masa Ayırt
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeri" className="border-t border-white/10 bg-zinc-950">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Galeri</h2>
            <p className="mt-3 max-w-2xl leading-7 text-zinc-400">
              Mekân fotoğrafları ve tanıtım videosu:
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-800 md:col-span-2">
                <video
                  className="h-full w-full object-cover"
                  src="/media/tanitim.mp4"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
                <Image src="/media/mekan.jpeg" alt="Kırıkkale Açık Büfe Kahvaltı ve Cafe İç Mekan Görünümü" fill sizes="(max-width: 768px) 100vw, 33vw" loading="lazy" className="object-cover" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-800">
                <Image
                  src="/media/logo.png"
                  alt="Kahvaltı Konağı Kırıkkale Logo"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  className="object-contain p-8"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="iletisim" className="border-t border-white/10 bg-zinc-900">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">İletişim</h2>
                <p className="mt-3 leading-7 text-zinc-400">
                  Adres ve telefon bilgileri aşağıda. Harita için bağlantıdan yol tarifi alabilirsiniz.
                </p>
                <div className="mt-6 space-y-3 text-sm text-zinc-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-700" />
                    <a
                      className="hover:text-white"
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {address}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-700" />
                    <a className="hover:text-white" href={phoneHref}>
                      {phoneText}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-700" />
                    <span>Kahvaltı: 08:00–14:00 • Cafe & Bistro: 14:00 sonrası</span>
                  </div>
                </div>
                <div className="mt-8">
                  <ButtonLink href="/rezervasyon" variant="primary">
                    Online Rezervasyon
                  </ButtonLink>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-3 inline-flex items-center justify-center rounded-full border border-white/10 bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-900"
                  >
                    Yol Tarifi
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-sm">
                <div className="text-sm font-semibold">Hızlı Not</div>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Kahvaltı servisimiz 08:00–14:00 arasıdır. 14:00 sonrasında Cafe & Bistro servisimiz
                  devam eder.
                </p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900 p-5 text-sm text-zinc-300">
                  <div className="font-medium text-white">İpucu</div>
                  <div className="mt-1 leading-6">
                    Masa ayırtmak için online rezervasyon sayfasını kullanabilir, menüyü incelemek
                    için /menu sayfasına geçebilirsiniz.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-zinc-950">
          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-zinc-500">
            © {new Date().getFullYear()} Kahvaltı Konağı — Kırıkkale
          </div>
        </footer>
      </main>
    </div>
  );
}
