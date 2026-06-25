import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { Utensils, Info, Coffee } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menü & Fiyatlar | Kahvaltı Konağı",
  description: "Kahvaltı Konağı'nın eşsiz lezzetlerini keşfedin. Açık büfe kahvaltı, sıcak ve soğuk içecekler, tatlılar.",
  keywords: ["Kırıkkale kahvaltı fiyatları", "Kahvaltı Konağı menü", "Kırıkkale cafe menüsü", "açık büfe kahvaltı menüsü"],
  alternates: {
    canonical: "/menu",
  },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function MenuPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const table = resolvedParams.table as string | undefined;

  // Fetch active categories and their active products
  const categoriesRaw = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    include: {
      products: {
        where: { isActive: true },
        orderBy: { sortOrder: "asc" }
      }
    }
  });

  const categories = categoriesRaw.filter(c => c.products.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-[#FCFBF8] text-[#2C241B] selection:bg-amber-200/50 font-sans">
      <Navbar />

      <main className="flex-1 pb-24">
        {/* Hero Section - Premium Dark/Gold Theme */}
        <div className="relative overflow-hidden bg-[#1A1510] px-5 pb-16 pt-24 text-white rounded-b-[2.5rem] shadow-2xl">
          <div className="absolute inset-0 opacity-20 bg-[url('/media/galeri_kahve.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1510] via-[#1A1510]/80 to-transparent" />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
          
          <div className="relative mx-auto max-w-5xl text-center z-10">
            {table && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-5 py-2 text-sm font-semibold text-amber-300 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-700">
                <Utensils className="h-4 w-4" />
                Masa {table} — Hoş Geldiniz
              </div>
            )}
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Özel <span className="bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">Lezzetlerimiz</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-amber-100/70 text-base sm:text-lg font-medium leading-relaxed">
              Özenle seçilmiş malzemelerle hazırladığımız nefis tatları ve taptaze içeceklerimizi keşfedin.
            </p>
          </div>
        </div>

        {/* Category Navigation (Sticky Glassmorphism) */}
        <div className="sticky top-[64px] z-40 px-5 py-4 backdrop-blur-2xl bg-[#FCFBF8]/80 border-b border-amber-900/5 transition-all">
          <div className="mx-auto flex max-w-5xl gap-3 overflow-x-auto scrollbar-none snap-x pb-1">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="snap-start flex shrink-0 items-center gap-2.5 rounded-full border border-amber-900/10 bg-white px-5 py-2.5 text-[15px] font-bold text-[#4A3D2D] transition-all hover:border-amber-500 hover:bg-amber-50 hover:text-amber-800 active:scale-95 shadow-sm"
              >
                {c.name.includes('İçecek') ? <Coffee className="w-4 h-4 text-amber-600" /> : <span className="text-amber-600">🍽️</span>}
                {c.name}
              </a>
            ))}
          </div>
        </div>

        {/* Menu Content */}
        <div className="mx-auto max-w-5xl px-5 pt-12">
          <div className="space-y-20">
            {categories.map((c) => (
              <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-40">
                {/* Category Header */}
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex flex-col">
                    <h2 className="text-3xl font-black tracking-tight text-[#1A1510]">{c.name}</h2>
                    {c.description && <p className="text-base text-[#7A6B5D] mt-1 font-medium">{c.description}</p>}
                  </div>
                  <div className="h-[2px] flex-1 bg-gradient-to-r from-amber-200/50 to-transparent ml-4 rounded-full" />
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {c.products.map((p) => (
                    <div
                      key={p.id}
                      className="group flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgb(245,158,11,0.1)] border border-amber-900/5"
                    >
                      {/* Image Container (Aspect Square) */}
                      <div className="relative aspect-square w-full overflow-hidden bg-amber-50">
                        {p.imageUrl ? (
                          <Image 
                            src={p.imageUrl} 
                            alt={p.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50/30 text-amber-200">
                            <Utensils className="w-16 h-16 opacity-50 mb-4" />
                            <span className="text-sm font-bold text-amber-800/40 tracking-wider uppercase">Kahvaltı Konağı</span>
                          </div>
                        )}
                        {/* Sold out overlay */}
                        {p.stockQty <= 0 && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                            <span className="rounded-xl bg-red-600 px-4 py-2 text-sm font-black tracking-widest text-white shadow-2xl rotate-[-10deg]">
                              TÜKENDİ
                            </span>
                          </div>
                        )}
                        {/* Gradient shadow for text blending */}
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      </div>

                      {/* Content Container */}
                      <div className="flex flex-1 flex-col p-6 relative">
                        <div className="flex flex-col gap-2">
                          <h3 className="text-xl font-black text-[#1A1510] leading-tight tracking-tight group-hover:text-amber-600 transition-colors">
                            {p.name}
                          </h3>
                          {p.description && (
                            <p className="text-sm leading-relaxed text-[#7A6B5D] font-medium">
                              {p.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="mt-auto pt-6 flex items-end justify-between">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-[#A89F91] uppercase tracking-wider mb-1">Fiyat</span>
                            <span className={`font-black tracking-tight ${p.priceCents ? 'text-2xl text-amber-600' : 'text-lg text-[#7A6B5D]'}`}>
                              {p.priceCents ? `${(p.priceCents / 100).toLocaleString("tr-TR")} ₺` : 'Fiyat Sorulur'}
                            </span>
                          </div>
                          
                          {p.priceCents ? (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white shadow-sm">
                              <span className="font-bold text-lg">+</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-24 border-t border-amber-900/10 pt-16 text-center">
            <div className="inline-flex items-center justify-center gap-3 rounded-full border border-amber-200/50 bg-amber-50/50 px-8 py-3.5 text-sm text-[#7A6B5D] font-semibold shadow-sm backdrop-blur-sm">
              <Info className="h-5 w-5 text-amber-600" />
              Fiyatlarımıza KDV dahildir. Görseller temsilidir.
            </div>
            <div className="mt-16 mb-8 flex justify-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <Image src="/media/logo.png" alt="Kahvaltı Konağı Logo" width={80} height={80} className="object-contain" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
