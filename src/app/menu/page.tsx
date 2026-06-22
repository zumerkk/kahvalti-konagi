import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { Utensils, Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menü & Fiyatlar",
  description: "Kahvaltı Konağı güncel menüsü. Kırıkkale açık büfe kahvaltı fiyatları, cafe bölümü taze kahveleri, tatlı çeşitleri (tiramisu, ekler) ve detaylı menü listesi.",
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
    <div className="flex min-h-screen flex-col bg-background text-[#3d3023] selection:bg-orange-200/50">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-[#e6dfd5]/40 bg-gradient-to-b from-orange-50/60 to-white px-5 pb-12 pt-16">
          <div className="absolute -left-20 top-0 h-48 w-48 rounded-full bg-orange-400/5 blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 h-48 w-48 rounded-full bg-yellow-400/5 blur-3xl pointer-events-none" />
          
          <div className="relative mx-auto max-w-5xl text-center">
            {table ? (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50 px-4 py-1.5 text-sm font-bold text-orange-700 shadow-sm animate-pulse">
                <Utensils className="h-4 w-4" />
                Masa {table} Hoş Geldiniz!
              </div>
            ) : null}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Nefis <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Lezzet Menümüz</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-[#7c6f62] font-medium leading-relaxed">
              Konağımızın özenle hazırlanan zengin açık büfe kahvaltı çeşitlerini, 3. nesil özel kahvelerini ve taze İtalyan tatlılarını inceleyin. Siparişlerinizi ekibimize iletebilirsiniz!
            </p>
          </div>
        </div>

        {/* Category Navigation (Sticky) */}
        <div className="sticky top-[64px] z-30 border-b border-[#e6dfd5]/40 bg-white/95 px-5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl gap-3 overflow-x-auto py-4 scrollbar-none">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-[#e6dfd5] bg-white px-4.5 py-2 text-sm font-bold text-[#5c4d3c] transition-all hover:border-orange-500 hover:bg-orange-50 hover:text-orange-700 active:scale-95 shadow-sm"
              >
                <span className="text-orange-500">🍽️</span>
                {c.name}
              </a>
            ))}
          </div>
        </div>

        {/* Menu Content */}
        <div className="mx-auto max-w-5xl px-5 pt-10">
          <div className="space-y-16">
            {categories.map((c) => (
              <section key={c.id} id={`cat-${c.id}`} className="scroll-mt-36">
                {/* Category Header */}
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 border border-orange-100 shadow-sm text-orange-600 text-lg">
                    🍳
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-[#3d3023]">{c.name}</h2>
                    {c.description && <p className="text-sm text-[#7c6f62] mt-0.5 font-medium">{c.description}</p>}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {c.products.map((p) => (
                    <div
                      key={p.id}
                      className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#e6dfd5] bg-white p-6 transition-all duration-300 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-950/5 relative"
                    >
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-base font-extrabold text-[#3d3023] group-hover:text-orange-600 transition-colors leading-snug">
                            {p.name}
                          </h3>
                          {p.stockQty <= 0 && (
                            <span className="shrink-0 rounded-lg bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-red-600 uppercase">
                              Tükendi
                            </span>
                          )}
                        </div>
                        {p.description && (
                          <p className="mt-2 text-xs leading-relaxed text-[#7c6f62] font-medium flex-1">
                            {p.description}
                          </p>
                        )}
                        <div className="mt-5 pt-4 border-t border-dashed border-[#faf6ee] flex items-center justify-between">
                          <span className={`font-black ${p.priceCents ? 'text-lg text-orange-600' : 'text-sm text-[#7c6f62]'}`}>
                            {p.priceCents ? `${(p.priceCents / 100).toLocaleString("tr-TR")} ₺` : 'Fiyat Sorulur'}
                          </span>
                          {p.priceCents ? (
                            <span className="text-[10px] text-green-700 bg-green-50 border border-green-200/40 px-2 py-0.5 rounded-md font-bold">Taze & Sıcak</span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-20 border-t border-[#e6dfd5]/60 pt-12 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-6 py-2.5 text-sm text-[#7c6f62] font-semibold">
              <Info className="h-4 w-4 text-orange-600" />
              Fiyatlarımıza KDV dahildir. Kahvaltımız sınırsız açık büfedir.
            </div>
            <div className="mt-12 mb-5 flex justify-center opacity-40">
              <Image src="/media/logo.png" alt="Kahvaltı Konağı Logo" width={70} height={70} className="object-contain" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
