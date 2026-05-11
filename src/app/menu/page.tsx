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

export const revalidate = 3600; // 1 saatte bir ISR ile yenile

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
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-500/30">
      <Navbar />

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <div className="relative overflow-hidden border-b border-white/5 bg-gradient-to-b from-zinc-900 to-zinc-950 px-5 pb-10 pt-16">
          <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_0%,rgba(245,158,11,0.1),transparent_50%)]" />
          <div className="relative mx-auto max-w-5xl text-center">
            {table ? (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-400">
                <Utensils className="h-4 w-4" />
                Hoş Geldiniz, {table}
              </div>
            ) : null}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Dijital <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Menü</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Lezzetlerimizi keşfedin ve siparişinizi garsonunuza iletin. Afiyet olsun!
            </p>
          </div>
        </div>

        {/* Category Navigation (Sticky) */}
        <div className="sticky top-[64px] z-30 border-b border-white/5 bg-zinc-950/80 px-5 backdrop-blur-xl">
          <div className="mx-auto flex max-w-5xl gap-3 overflow-x-auto py-4 scrollbar-none">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`#cat-${c.id}`}
                className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition-all hover:border-amber-500/50 hover:bg-amber-500/10 hover:text-amber-400 active:scale-95"
              >
                <Utensils className="h-4 w-4" />
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 shadow-inner shadow-white/5">
                    <Utensils className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">{c.name}</h2>
                    {c.description && <p className="text-sm text-zinc-500">{c.description}</p>}
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {c.products.map((p) => (
                    <div
                      key={p.id}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-amber-500/5"
                    >
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-amber-400 transition-colors">
                            {p.name}
                          </h3>
                          {p.stockQty <= 0 && (
                            <span className="shrink-0 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-red-500 uppercase">
                              Tükendi
                            </span>
                          )}
                        </div>
                        {p.description && (
                          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                            {p.description}
                          </p>
                        )}
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <span className="text-xl font-bold text-amber-500">
                            {p.priceCents ? `${(p.priceCents / 100).toLocaleString("tr-TR")} ₺` : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-20 border-t border-white/5 pt-10 text-center">
            <div className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-zinc-900 px-5 py-2 text-sm text-zinc-400">
              <Info className="h-4 w-4" />
              Fiyatlarımıza KDV dahildir.
            </div>
            <div className="mt-10 mb-5 flex justify-center opacity-30">
              <Image src="/media/logo.png" alt="Logo" width={60} height={60} className="grayscale" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
