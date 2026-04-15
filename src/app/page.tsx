import { Navbar } from "@/components/Navbar";
import { ButtonLink } from "@/components/ui/Button";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const phoneText = "+90 546 898 30 14";
  const phoneHref = "tel:+905468983014";
  const address = "Yenimahalle Tuna Caddesi 55/B Kırıkkale/Merkez";
  const mapsUrl =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(address);

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(245,158,11,0.25),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(255,255,255,0.07),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.65),rgba(0,0,0,0.92))]" />
          <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-18 md:grid-cols-2 md:py-24">
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <Star className="h-4 w-4 text-amber-400" />
                Kırıkkale’nin tek açık büfe kahvaltısı
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Açık Büfe Kahvaltının
                <span className="text-amber-400"> en lezzetli</span> hâli.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/70 md:text-lg">
                Kahvaltı Konağı’nda taptaze ürünler, sıcak lezzetler ve ferah bir atmosfer.
                Hafta sonu 08:00–14:00 arası rezervasyonunuzu online oluşturun.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/rezervasyon" variant="primary">
                  Rezervasyon Yap
                </ButtonLink>
                <ButtonLink href="#iletisim" variant="secondary">
                  Yol Tarifi / İletişim
                </ButtonLink>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-4 text-sm text-white/75 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span className="font-medium text-white">Saatler</span>
                  </div>
                  <div className="mt-2">Hafta sonu 08:00–14:00</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-400" />
                    <span className="font-medium text-white">Konum</span>
                  </div>
                  <div className="mt-2">Kırıkkale</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-400" />
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
              <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(400px_circle_at_50%_30%,rgba(245,158,11,0.35),transparent_60%)] blur-2xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/0 p-6">
                <div className="h-full w-full rounded-[2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] p-6">
                  <div className="flex h-full flex-col justify-between">
                    <div className="space-y-3">
                      <div className="text-xs font-medium tracking-wide text-white/60">
                        Açık Büfe Deneyimi
                      </div>
                      <div className="text-2xl font-semibold tracking-tight">
                        Sınırsız çeşit, sıcak servis, taze ürün.
                      </div>
                      <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                        <Image
                          src="/media/mekan.jpeg"
                          alt="Kahvaltı Konağı dış cephe"
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-white/60">Çeşit</div>
                        <div className="mt-1 text-lg font-semibold">80+ ürün</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-white/60">Masa</div>
                        <div className="mt-1 text-lg font-semibold">12 masa</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-white/60">Rezervasyon</div>
                        <div className="mt-1 text-lg font-semibold">Online</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                        <div className="text-xs text-white/60">Konum</div>
                        <div className="mt-1 text-lg font-semibold">Kırıkkale</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="hakkinda" className="border-t border-white/10 bg-black">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Kahvaltı Konağı
                </h2>
                <p className="mt-4 text-white/70 leading-7">
                  Kırıkkale’de açık büfe kahvaltıyı “özel gün” gibi yaşatmak için buradayız. Her
                  tabakta tazelik, her serviste özen, her masada keyif.
                </p>
                <p className="mt-4 text-white/70 leading-7">
                  Hafta sonları 08:00–14:00 arasında açık büfe kahvaltımız için online rezervasyon
                  oluşturabilirsiniz.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  { title: "Taze ürün", desc: "Günlük tedarik ve sıcak servis." },
                  { title: "Açık büfe", desc: "Zengin çeşit, sınırsız keyif." },
                  { title: "Aile dostu", desc: "Konforlu alan ve hızlı servis." },
                  { title: "Rezervasyon", desc: "Masa seçerek online rezervasyon." },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <div className="text-sm font-semibold">{f.title}</div>
                    <div className="mt-2 text-sm text-white/70 leading-6">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MENU */}
        <section id="menu" className="border-t border-white/10 bg-black">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Açık Büfe</h2>
                <p className="mt-3 text-white/70 max-w-2xl leading-7">
                  Peynir çeşitleri, sıcaklar, yöresel lezzetler, reçeller, zeytinler ve daha fazlası…
                  (Menü detayları admin panelden yönetilebilir şekilde sonraki adımda eklenebilir.)
                </p>
              </div>
              <ButtonLink href="/rezervasyon" variant="secondary" className="hidden sm:inline-flex">
                Hemen Rezervasyon
              </ButtonLink>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "Sıcak çeşitler",
                "Peynir tabakları",
                "Yöresel reçeller",
                "Taze ekmekler",
                "Zeytin & meze",
                "Çay / kahve",
              ].map((i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm font-semibold">{i}</div>
                  <div className="mt-2 text-sm text-white/70">
                    Lezzet standardımızı her hafta sonu aynı özenle koruruz.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="galeri" className="border-t border-white/10 bg-black">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">Galeri</h2>
            <p className="mt-3 text-white/70 max-w-2xl leading-7">
              Mekân fotoğrafları ve tanıtım videosu:
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:col-span-2">
                <video
                  className="h-full w-full object-cover"
                  src="/media/tanitim.mp4"
                  controls
                  playsInline
                  preload="metadata"
                />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image src="/media/mekan.jpeg" alt="Kahvaltı Konağı" fill className="object-cover" />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                <Image src="/media/logo.png" alt="Kahvaltı Konağı logo" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="iletisim" className="border-t border-white/10 bg-black">
          <div className="mx-auto max-w-6xl px-5 py-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">İletişim</h2>
                <p className="mt-3 text-white/70 leading-7">
                  Adres, telefon ve sosyal medya bilgileri buraya gelecek. Harita embed’i bir sonraki
                  adımda ekleyebiliriz.
                </p>
                <div className="mt-6 space-y-3 text-white/80 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-400" />
                    <a className="hover:text-white" href={mapsUrl} target="_blank" rel="noreferrer">
                      {address}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-400" />
                    <a className="hover:text-white" href={phoneHref}>
                      {phoneText}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span>Hafta sonu 08:00–14:00</span>
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
                    className="ml-3 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                  >
                    Yol Tarifi
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold">Hızlı Not</div>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  Rezervasyonlar hafta sonu 08:00–14:00 için alınır. Kapalı günler admin panelden
                  yönetilir.
                </p>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-white/75">
                  <div className="font-medium text-white">KVKK</div>
                  <div className="mt-1 leading-6">
                    TCKN, rezervasyon sahibinden 1 kez istenir ve sistemde şifreli saklanır.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-black">
          <div className="mx-auto max-w-6xl px-5 py-10 text-sm text-white/60">
            © {new Date().getFullYear()} Kahvaltı Konağı — Kırıkkale
          </div>
        </footer>
      </main>
    </div>
  );
}
