"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Receipt,
  CheckCircle2,
  Barcode,
  Utensils
} from "lucide-react";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  priceCents: number | null;
  stockQty: number;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
};

type Table = {
  id: string;
  name: string;
};

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

const KDV_RATE = 0.08;

export default function KasaClient({
  initialProducts,
  categories,
  tables
}: {
  initialProducts: Product[];
  categories: Category[];
  tables: Table[];
}) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [orderComplete, setOrderComplete] = useState(false);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchCat = activeCategory === "all" || p.categoryId === activeCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [initialProducts, activeCategory, search]);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // Basic search enter key handler
    if (e.key === "Enter" && search.trim() !== "") {
      const query = search.trim();
      const match = initialProducts.find((p) => p.name.toLowerCase() === query.toLowerCase());
      if (match && match.stockQty > 0) {
        addToCart(match);
        setSearch("");
      }
    }
  }

  function addToCart(product: Product) {
    if (product.stockQty <= 0) return;
    const price = product.priceCents ? product.priceCents / 100 : 0;

    setCart((prev) => {
      const existing = prev.find((c) => c.productId === product.id);
      if (existing) {
        return prev.map((c) =>
          c.productId === product.id ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [...prev, { productId: product.id, name: product.name, price, qty: 1 }];
    });
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) =>
          c.productId === productId ? { ...c, qty: Math.max(0, c.qty + delta) } : c
        )
        .filter((c) => c.qty > 0)
    );
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((c) => c.productId !== productId));
  }

  function clearCart() {
    setCart([]);
    setSelectedTable("");
  }

  function completeOrder() {
    if (cart.length === 0) return;
    setOrderComplete(true);
    toast.success("Sipariş tamamlandı (Demo Mode)");
    setTimeout(() => {
      setOrderComplete(false);
      setCart([]);
      setSelectedTable("");
    }, 2500);
  }

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const kdv = subtotal * KDV_RATE;
  const total = subtotal + kdv;
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="flex h-[calc(100dvh-64px)] flex-col gap-4 md:flex-row md:gap-6">
      {/* ─── LEFT: Products ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Hızlı Satış
              </span>
            </h1>
            <p className="mt-0.5 text-xs text-white/40">Ürün seçip sepete ekleyin</p>
          </div>
          <div className="relative group">
            <Barcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-amber-400" />
            <input
              type="text"
              placeholder="Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-48 rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-500/30 focus:bg-white/[0.06] md:w-64"
              autoFocus
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveCategory("all")}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
              activeCategory === "all"
                ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                : "border border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                    : "border border-white/[0.06] bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70"
                }`}
              >
                <Utensils className="h-3.5 w-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-transparent p-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stockQty <= 0}
                className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 ${
                  product.stockQty > 0
                    ? "border-white/[0.06] bg-white/[0.03] hover:border-amber-500/30 hover:bg-amber-500/[0.06] hover:shadow-lg hover:shadow-amber-500/5 active:scale-[0.97]"
                    : "cursor-not-allowed border-white/[0.04] bg-white/[0.01] opacity-40"
                }`}
              >
                {/* Quick add indicator */}
                {product.stockQty > 0 && (
                  <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/0 text-amber-500/0 transition-all duration-200 group-hover:bg-amber-500/20 group-hover:text-amber-400">
                    <Plus className="h-3.5 w-3.5" />
                  </div>
                )}

                <div className="text-sm font-medium text-white">{product.name}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-bold text-amber-400">
                    {product.priceCents ? `${(product.priceCents / 100).toLocaleString("tr-TR")}₺` : '-'}
                  </span>
                  {product.stockQty <= 0 && (
                    <span className="rounded-md bg-red-500/15 px-1.5 py-0.5 text-[10px] font-medium text-red-400">
                      Tükendi
                    </span>
                  )}
                </div>
                <div className="mt-1.5 text-[10px] text-white/30">
                  {categories.find((c) => c.id === product.categoryId)?.name}
                </div>
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="flex h-40 items-center justify-center text-sm text-white/30">
              Ürün bulunamadı
            </div>
          )}
        </div>
      </div>

      {/* ─── RIGHT: Cart ─── */}
      <div className="flex w-full flex-col rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent md:w-[360px]">
        {/* Cart header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
              <Receipt className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-semibold">Sepet</div>
              <div className="text-[10px] text-white/40">{totalItems} ürün</div>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="rounded-lg px-2 py-1 text-xs text-red-400/70 transition hover:bg-red-500/10 hover:text-red-400"
            >
              Temizle
            </button>
          )}
        </div>

        {/* Table selection */}
        <div className="border-b border-white/[0.06] px-5 py-3">
          <div className="mb-1.5 text-[10px] font-semibold tracking-wider text-white/40 uppercase">Masa</div>
          <div className="flex flex-wrap gap-1.5">
            {tables.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTable(selectedTable === t.name ? "" : t.name)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150 ${
                  selectedTable === t.name
                    ? "bg-amber-500 text-black shadow-sm shadow-amber-500/20"
                    : "border border-white/[0.08] bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
          {!selectedTable && <div className="mt-1.5 text-[10px] text-white/25">Masa seçin</div>}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-white/20">
              <ShoppingCart className="h-10 w-10" />
              <div className="text-sm">Sepet boş</div>
              <div className="text-[10px]">Ürün seçerek başlayın</div>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-all hover:border-white/[0.08]"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{item.name}</div>
                    <div className="text-xs text-white/40">{item.price.toLocaleString("tr-TR")}₺ × {item.qty}</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQty(item.productId, -1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/60 transition hover:bg-white/[0.08]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-white">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 text-amber-400 transition hover:bg-amber-500/20"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="w-16 text-right text-sm font-semibold text-white">
                    {(item.price * item.qty).toLocaleString("tr-TR")}₺
                  </div>

                  <button
                     onClick={() => removeFromCart(item.productId)}
                     className="flex h-7 w-7 items-center justify-center rounded-lg text-white/20 transition hover:bg-red-500/10 hover:text-red-400"
                   >
                     <Trash2 className="h-3.5 w-3.5" />
                   </button>
                 </div>
               ))}
             </div>
           )}
         </div>

         {/* Totals & Pay */}
         {cart.length > 0 && (
           <div className="border-t border-white/[0.06] px-5 py-4">
             <div className="space-y-2 text-sm">
               <div className="flex justify-between text-white/50">
                 <span>Ara Toplam</span>
                 <span>{subtotal.toLocaleString("tr-TR")}₺</span>
               </div>
               <div className="flex justify-between text-white/50">
                 <span>KDV (%8)</span>
                 <span>{kdv.toLocaleString("tr-TR")}₺</span>
               </div>
               <div className="flex justify-between border-t border-white/[0.06] pt-2 text-lg font-bold text-white">
                 <span>Toplam</span>
                 <span className="text-amber-400">{total.toLocaleString("tr-TR")}₺</span>
               </div>
             </div>

             <button
               onClick={completeOrder}
               disabled={orderComplete}
               className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all duration-300 ${
                 orderComplete
                   ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                   : "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98]"
               }`}
             >
               {orderComplete ? (
                 <>
                   <CheckCircle2 className="h-5 w-5" />
                   Sipariş Tamamlandı!
                 </>
               ) : (
                 <>
                   <Receipt className="h-4 w-4" />
                   Sipariş Tamamla — {total.toLocaleString("tr-TR")}₺
                 </>
               )}
             </button>
           </div>
         )}
       </div>

       {/* Order complete overlay */}
       {orderComplete && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
           <div className="flex flex-col items-center gap-4 rounded-3xl border border-emerald-500/20 bg-zinc-950 p-10 shadow-2xl shadow-emerald-500/10">
             <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
               <CheckCircle2 className="h-10 w-10 text-emerald-400" />
             </div>
             <div className="text-xl font-bold text-white">Sipariş Tamamlandı!</div>
             <div className="text-sm text-white/50">
               {selectedTable ? `${selectedTable} · ` : ""}{total.toLocaleString("tr-TR")}₺
             </div>
           </div>
         </div>
       )}
     </div>
   );
}
