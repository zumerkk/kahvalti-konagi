import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatTryFromCents(priceCents: number | null) {
  if (priceCents === null || priceCents === undefined) return "—";
  const value = priceCents / 100;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// next/image için "remotePatterns" gerektirmeyen basit passthrough loader.
// (Admin panelde imageUrl alanı sonradan devreye girse bile build/runtime sorunlarına takılmasın.)
const passthroughImageLoader = ({ src }: { src: string }) => src;

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      products: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
    },
  });

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />

      <main className="flex-1 bg-white text-slate-900">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Menü</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Kategorilere tıklayarak ürünleri hızlıca inceleyebilirsiniz.
            </p>
          </header>

          {/* Kategori sekmeleri */}
          <div className="sticky top-[72px] z-30 mt-6 border-y border-slate-200 bg-white/90 backdrop-blur">
            <div className="flex gap-2 overflow-x-auto py-3">
              {categories.length === 0 ? (
                <span className="text-sm text-slate-500">Henüz aktif kategori yok.</span>
              ) : (
                categories.map((c) => (
                  <a
                    key={c.id}
                    href={`#kategori-${c.id}`}
                    className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                  >
                    {c.name}
                  </a>
                ))
              )}
            </div>
          </div>

          <div className="mt-8 space-y-12">
            {categories.map((c) => (
              <section
                key={c.id}
                id={`kategori-${c.id}`}
                className="scroll-mt-36"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">{c.name}</h2>
                    {c.description ? (
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                        {c.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-xs text-slate-500">
                    {c.products.length} ürün
                  </div>
                </div>

                {c.products.length === 0 ? (
                  <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                    Bu kategoride aktif ürün yok.
                  </div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {c.products.map((p) => {
                      const inStock = (p.stockQty ?? 0) > 0;
                      const imageSrc = p.imageUrl?.trim() ? p.imageUrl.trim() : "/media/logo.png";

                      return (
                        <article
                          key={p.id}
                          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                        >
                          <div className="relative aspect-[4/3] bg-slate-100">
                            <Image
                              src={imageSrc}
                              alt={p.name}
                              fill
                              className={p.imageUrl ? "object-cover" : "object-contain p-8 opacity-70"}
                              loader={passthroughImageLoader}
                              unoptimized
                            />
                          </div>
                          <div className="p-4">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="text-base font-semibold leading-6">{p.name}</h3>
                              {inStock ? (
                                <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                  Stok: {p.stockQty}
                                </span>
                              ) : (
                                <span className="shrink-0 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                                  Tükendi
                                </span>
                              )}
                            </div>

                            {p.description ? (
                              <p className="mt-2 text-sm leading-7 text-slate-600">{p.description}</p>
                            ) : null}

                            <div className="mt-4 flex items-center justify-between">
                              <div className="text-base font-semibold text-slate-900">
                                {formatTryFromCents(p.priceCents)}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

