import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Star, MapPin, Clock, Phone, ArrowRight, Coffee, Utensils, Heart, Check } from "lucide-react";
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
        "image": "https://kahvaltikonagi.com.tr/media/turkish_breakfast_spread.png",
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
    <div className="flex flex-1 flex-col bg-background text-[#3d3023] selection:bg-orange-200/50">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-[#faf6ee] to-white py-12 md:py-24 border-b border-[#e6dfd5]/40">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />

          <div className="relative mx-auto max-w-6xl px-5 grid grid-cols-1 gap-12 lg:grid-cols-12 items-center">
            {/* Left Column Text */}
            <div className="flex flex-col lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-2 rounded-full border border-orange-200/60 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700 shadow-sm">
                <Star className="h-4 w-4 fill-orange-600 text-orange-600" />
                Kırıkkale’nin En Sevilen Lezzet Durağı 🍳
              </div>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-[#3d3023] md:text-5xl lg:text-6xl">
                Güne <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Nefis Bir Başlangıç</span> Yapın!
              </h1>
              <p className="mt-6 text-base leading-relaxed text-[#5c4d3c] md:text-lg">
                Güne sıcacık simit kokusu, dumanı tüten taze çay ve <b>sınırsız açık büfe kahvaltı</b> ile başlayın! 
                Kırıkkale'nin merkezinde 08:00–15:00 arası <b>kişi başı sadece 450₺</b>.
                <br className="hidden md:inline" />
                Saat 15:00'ten sonra ise enfes butik kahveler, fırından yeni çıkmış tiramisu ve taze tatlılarımızla sıcacık <b>Cafe & Bistro</b> keyfi sizi bekliyor!
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <ButtonLink href="/rezervasyon" variant="primary" className="px-8 py-4 text-base">
                  Masa Rezervasyonu Yap
                  <ArrowRight className="ml-2 h-5 w-5" />
                </ButtonLink>
                <ButtonLink href="/menu" variant="secondary" className="px-8 py-4 text-base">
                  Dijital Menüyü Keşfet
                </ButtonLink>
              </div>

              {/* Mini Feature Stats */}
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#e6dfd5]/60 pt-8 text-center lg:text-left">
                <div>
                  <div className="text-3xl font-extrabold text-orange-600">450₺</div>
                  <div className="text-xs font-semibold text-[#8c7d6c] mt-1">Sınırsız Kahvaltı</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-orange-600">08:00</div>
                  <div className="text-xs font-semibold text-[#8c7d6c] mt-1">Açılış Saati</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-orange-600">100%</div>
                  <div className="text-xs font-semibold text-[#8c7d6c] mt-1">Taze ve Organik</div>
                </div>
              </div>
            </div>

            {/* Right Column Image Stack */}
            <div className="relative lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-[480px] aspect-square rounded-[3rem] border border-orange-200/60 bg-white p-4 shadow-xl shadow-orange-950/5">
                <div className="relative h-full w-full overflow-hidden rounded-[2.5rem]">
                  <Image
                    src="/media/turkish_breakfast_spread.png"
                    alt="Kahvaltı Konağı Zengin Açık Büfe Kahvaltı Spread"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                  />
                  {/* Floating Price Tag */}
                  <div className="absolute right-6 top-6 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl p-4 shadow-lg flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Kişi Başı</span>
                    <span className="text-2xl font-black">450 ₺</span>
                  </div>
                  {/* Glassmorphism Badge */}
                  <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/80 border border-white/40 rounded-2xl p-4 flex items-center justify-between shadow-md">
                    <div>
                      <h4 className="text-sm font-bold text-[#3d3023]">Açık Büfe Kahvaltı</h4>
                      <p className="text-xs text-[#7c6f62] mt-0.5">Hafta içi & Hafta sonu</p>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100/60 px-2.5 py-1 rounded-lg">08:00 - 15:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section id="hakkinda" className="py-16 md:py-24 bg-white border-b border-[#e6dfd5]/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600">Biz Kimiz?</h2>
              <p className="mt-3 text-3xl font-extrabold text-[#3d3023] md:text-4xl">Günün Her Saatinde Lezzet Dolu Anlar</p>
              <p className="mt-4 text-base text-[#7c6f62]">
                Kırıkkale Yenimahalle'de yer alan şık ve samimi mekanımızda, misafirlerimize en taze malzemelerle hazırlanan eşsiz tatlar sunuyoruz.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Concept 1 */}
              <div className="flex flex-col bg-orange-50/40 border border-orange-100 rounded-3xl p-8 hover:shadow-md transition duration-300">
                <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-md shadow-orange-500/20">
                  <Utensils className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#3d3023]">Zengin Açık Büfe</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#7c6f62]">
                  Sıcak hamur işleri, yöresel peynirler, organik reçeller, taze sebzeler ve dilediğinizce içebileceğiniz sınırsız çay eşliğinde doyumsuz bir kahvaltı keyfi.
                </p>
                <div className="mt-auto pt-6 text-xs font-bold text-orange-600 flex items-center gap-1">
                  Her gün 08:00 - 15:00 arası <Clock className="h-3 w-3" />
                </div>
              </div>

              {/* Concept 2 */}
              <div className="flex flex-col bg-orange-50/40 border border-orange-100 rounded-3xl p-8 hover:shadow-md transition duration-300">
                <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-md shadow-orange-500/20">
                  <Coffee className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#3d3023]">Cafe & Bistro Keyfi</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#7c6f62]">
                  Saat 15:00'ten gece 23:00'e kadar devam eden konseptimizde; üçüncü nesil butik kahveler, serinletici içecekler ve özel İtalyan tatlıları.
                </p>
                <div className="mt-auto pt-6 text-xs font-bold text-orange-600 flex items-center gap-1">
                  Her gün 15:00 - 23:00 arası <Clock className="h-3 w-3" />
                </div>
              </div>

              {/* Concept 3 */}
              <div className="flex flex-col bg-orange-50/40 border border-orange-100 rounded-3xl p-8 hover:shadow-md transition duration-300">
                <div className="h-12 w-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center mb-6 shadow-md shadow-orange-500/20">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-[#3d3023]">Kış Bahçesi & Camekan</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#7c6f62]">
                  Ferah camekan alanımız veya şömineli nezih iç salonumuzla her mevsim bahçe ferahlığında, huzurlu bir ambiyans. Rezervasyon yapmak çok kolay!
                </p>
                <div className="mt-auto pt-6 text-xs font-bold text-orange-600 flex items-center gap-1">
                  İki Farklı Alan Seçeneği <MapPin className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUFFET / KAHVALTI PREVIEW */}
        <section id="menu" className="py-16 md:py-24 bg-[#faf6ee]/50 border-b border-[#e6dfd5]/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Image Column */}
              <div className="lg:col-span-5 order-last lg:order-first flex justify-center">
                <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[2.5rem] border border-orange-200/60 bg-white p-3 shadow-lg">
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
                    <Image
                      src="/media/turkish_tea_and_simit.png"
                      alt="Demleme Türk Çayı ve Çıtır Simit"
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              {/* Text Column */}
              <div className="lg:col-span-7 flex flex-col">
                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600">Açık Büfe Menü</h2>
                <h3 className="mt-3 text-3xl font-extrabold text-[#3d3023] md:text-4xl">Açık Büfede Sizi Neler Bekliyor?</h3>
                <p className="mt-4 text-base text-[#7c6f62] leading-relaxed">
                  Kahvaltı Konağı'nda açık büfe sıradan bir kahvaltı değil, bir şölendir! Her sabah fırından çıkan sıcak pide ve simit kokusu eşliğinde özenle seçilen lezzetler:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  {[
                    "Sıcak Menemen & Sahanda Yumurta",
                    "Ev Yapımı Sıcak Sigara Böreği & Pişiler",
                    "Erzincan Tulumu, Kaşar & Yöresel Peynirler",
                    "Doğal Çilek, Vişne ve Ev Reçelleri",
                    "Hatay Kırma Zeytinleri & Meze Çeşitleri",
                    "Tavşan Kanı Sınırsız Demleme Çay",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-sm font-bold text-[#5c4d3c]">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/menu" variant="primary">
                    Detaylı Menüyü İncele
                  </ButtonLink>
                  <ButtonLink href="/rezervasyon" variant="secondary">
                    Hemen Rezervasyon Yap
                  </ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CAFE & BISTRO PREVIEW */}
        <section className="py-16 md:py-24 bg-white border-b border-[#e6dfd5]/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Text Column */}
              <div className="lg:col-span-7 flex flex-col">
                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600">15:00 Sonrası</h2>
                <h3 className="mt-3 text-3xl font-extrabold text-[#3d3023] md:text-4xl">Nezih Bir Kahve & Tatlı Molası</h3>
                <p className="mt-4 text-base text-[#7c6f62] leading-relaxed">
                  Günün koşturmacasına tatlı bir ara verin. Saat 15:00'ten itibaren baristamızın hazırladığı özel kahve çeşitleri ve taze İtalyan tatlılarımızla keyifli sohbetlerin tadını çıkarın.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex gap-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/60">
                    <span className="text-2xl">🍰</span>
                    <div>
                      <h4 className="font-bold text-[#3d3023] text-sm">Gourmet İtalyan Tiramisu</h4>
                      <p className="text-xs text-[#7c6f62] mt-0.5">Hakiki mascarpone peyniri ve espresso ile ıslatılmış savoyer kedidilleriyle hazırlanan imza tatlımız.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 p-4 rounded-2xl bg-orange-50/50 border border-orange-100/60">
                    <span className="text-2xl">☕</span>
                    <div>
                      <h4 className="font-bold text-[#3d3023] text-sm">Üçüncü Nesil Sıcak Kahveler</h4>
                      <p className="text-xs text-[#7c6f62] mt-0.5">Taze çekilmiş çekirdeklerle hazırlanan Latte, Cappuccino, Americano ve Türk Kahvesi çeşitleri.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <ButtonLink href="/menu" variant="primary">
                    Cafe Menüsünü Görüntüle
                  </ButtonLink>
                </div>
              </div>

              {/* Image Column */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[2.5rem] border border-orange-200/60 bg-white p-3 shadow-lg">
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem]">
                    <Image
                      src="/media/cafe_desserts.png"
                      alt="Mascarpone Peynirli Tiramisu Dilimi ve Cappuccino"
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VIDEO & GALLERY */}
        <section id="galeri" className="py-16 md:py-24 bg-[#faf6ee]/50 border-b border-[#e6dfd5]/40">
          <div className="mx-auto max-w-6xl px-5">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600">Galeri</h2>
              <p className="mt-3 text-3xl font-extrabold text-[#3d3023] md:text-4xl">Konağımızdan Kareler</p>
              <p className="mt-3 text-sm text-[#7c6f62]">
                Sıcak, ferah ve huzur dolu iç mekanımız ile kış bahçemizi keşfedin:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Video Card */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-orange-200/60 bg-white shadow-md p-2">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <video
                    className="h-full w-full object-cover"
                    src="/media/cilek.mp4"
                    controls
                    playsInline
                    preload="metadata"
                  />
                </div>
              </div>
              {/* Portrait Image Card */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-orange-200/60 bg-white shadow-md p-2">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Image 
                    src="/media/galeri_kahve.jpg" 
                    alt="Kahvaltı Konağı Cafe & Tatlı Keyfi" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw" 
                    loading="lazy" 
                    className="object-cover transition-transform duration-500 hover:scale-105" 
                  />
                </div>
              </div>
              {/* Landscape Image Card */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-orange-200/60 bg-white shadow-md p-2">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Image 
                    src="/media/galeri_simit.png" 
                    alt="Kahvaltı Konağı Zengin Açık Büfe Lezzetleri" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 33vw" 
                    loading="lazy" 
                    className="object-cover transition-transform duration-500 hover:scale-105" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT / MAP */}
        <section id="iletisim" className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-6xl px-5">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
              {/* Left Column Information */}
              <div className="lg:col-span-6 flex flex-col">
                <h2 className="text-sm font-bold uppercase tracking-wider text-orange-600">İletişim</h2>
                <h3 className="mt-3 text-3xl font-extrabold text-[#3d3023] md:text-4xl">Konağımıza Bekliyoruz!</h3>
                <p className="mt-4 text-base text-[#7c6f62] leading-relaxed">
                  Kahvaltı Konağı, Kırıkkale'nin en kolay ulaşılabilir noktasında Yenimahalle Tuna Caddesi üzerinde sizleri bekliyor. Sorularınız veya rezervasyon destek talepleriniz için bize ulaşabilirsiniz.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#8c7d6c] block">Adresimiz</span>
                      <a
                        className="text-sm font-bold text-[#3d3023] hover:text-orange-600 transition-colors"
                        href={mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {address}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#8c7d6c] block">Telefon Numaramız</span>
                      <a className="text-sm font-bold text-[#3d3023] hover:text-orange-600 transition-colors" href={phoneHref}>
                        {phoneText}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-[#8c7d6c] block">Hizmet Saatlerimiz</span>
                      <span className="text-sm font-bold text-[#3d3023]">
                        Kahvaltı: 08:00 – 15:00 • Cafe & Bistro: 15:00 – 23:00
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <ButtonLink href="/rezervasyon" variant="primary">
                    Online Rezervasyon Yap
                  </ButtonLink>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-orange-200 bg-orange-50 px-6 py-3 text-sm font-bold text-orange-950 shadow-sm transition hover:bg-orange-100"
                  >
                    Google Haritada Aç
                  </a>
                </div>
              </div>

              {/* Right Column Quick Info Box */}
              <div className="lg:col-span-6 bg-[#faf6ee] border border-orange-200/60 rounded-[2.5rem] p-8 shadow-sm">
                <h4 className="text-lg font-bold text-[#3d3023]">Rezervasyon Hatırlatması</h4>
                <p className="mt-3 text-sm leading-relaxed text-[#7c6f62]">
                  Kahvaltı servisimiz sınırsız açık büfedir ve saat 15:00'te sona ermektedir. Yoğun günlerde (Hafta sonları) mağduriyet yaşamamak adına önceden online sistemimiz üzerinden kolayca masa ayırtmanızı tavsiye ederiz.
                </p>
                <div className="mt-6 rounded-2xl border border-orange-100 bg-white p-5 text-sm">
                  <div className="font-bold text-orange-700 flex items-center gap-1.5">
                    💡 Küçük Bir İpucu:
                  </div>
                  <p className="mt-2 text-[#5c4d3c] leading-relaxed">
                    Masamızı rezerve ederken Camekan (Kış Bahçesi) veya Nezih İç Salon alanlarından dilediğinizi seçebilirsiniz. Rezervasyon talepleriniz anında onaylanmaktadır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#e6dfd5]/60 bg-[#faf6ee] py-12 text-center text-sm font-semibold text-[#8c7d6c]">
          <div className="mx-auto max-w-6xl px-5">
            © {new Date().getFullYear()} Kahvaltı Konağı Kırıkkale. Tüm Hakları Saklıdır.
          </div>
        </footer>
      </main>
    </div>
  );
}
