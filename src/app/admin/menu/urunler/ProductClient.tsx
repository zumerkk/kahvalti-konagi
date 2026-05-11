"use client";

import { useState } from "react";
import { Plus, Package, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addProduct, updateProduct, deleteProduct } from "./actions";

type Category = { id: string; name: string };
type Product = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  stockQty: number;
  isActive: boolean;
  category: { name: string };
};

export default function ProductClient({ 
  initialProducts, 
  categories 
}: { 
  initialProducts: Product[];
  categories: Category[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCategoryId) return toast.error("Ürün adı ve kategori zorunludur.");
    
    setIsAdding(true);
    const priceCents = newPrice ? Math.round(parseFloat(newPrice) * 100) : undefined;
    
    const res = await addProduct({ 
      name: newName, 
      categoryId: newCategoryId, 
      priceCents,
      stockQty: parseInt(newStock) || 0,
      isActive: true
    });
    
    setIsAdding(false);
    
    if (res.success) {
      toast.success("Ürün eklendi.");
      setNewName("");
      setNewPrice("");
      setNewStock("");
    } else {
      toast.error(res.error);
    }
  };

  const handleToggleActive = async (p: Product) => {
    const res = await updateProduct(p.id, { isActive: !p.isActive });
    if (res.success) toast.success("Ürün durumu güncellendi.");
    else toast.error(res.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const res = await deleteProduct(id);
    if (res.success) toast.success("Ürün silindi.");
    else toast.error(res.error);
  };

  return (
    <div className="space-y-6">
      {/* New product form */}
      <form onSubmit={handleAdd} className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4 text-amber-400" />
          Yeni Ürün
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
          <input 
            value={newName} onChange={e => setNewName(e.target.value)}
            type="text" placeholder="Ürün adı" 
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-500/30" 
          />
          <select 
            value={newCategoryId} onChange={e => setNewCategoryId(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-amber-500/30"
          >
            <option value="">Kategori seçin</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input 
            value={newPrice} onChange={e => setNewPrice(e.target.value)}
            type="number" step="0.01" placeholder="Fiyat (₺)" 
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-500/30" 
          />
          <input 
            value={newStock} onChange={e => setNewStock(e.target.value)}
            type="number" placeholder="Stok" 
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-500/30" 
          />
          <button disabled={isAdding} type="submit" className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-sm font-bold text-black shadow-md shadow-amber-500/20 disabled:opacity-50">
            {isAdding ? "Ekleniyor..." : "Ekle"}
          </button>
        </div>
      </form>

      {/* Products table */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-gradient-to-r from-amber-500/[0.06] to-transparent">
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Ürün</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Kategori</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Fiyat</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Stok</th>
                <th className="px-5 py-3.5 text-left text-[10px] font-semibold tracking-wider text-white/40 uppercase">Durum</th>
                <th className="px-5 py-3.5 text-right text-[10px] font-semibold tracking-wider text-white/40 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {initialProducts.map((p) => (
                <tr key={p.id} className={`transition-colors hover:bg-white/[0.02] ${!p.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                        <Package className="h-4 w-4 text-amber-400" />
                      </div>
                      <span className="font-medium text-white">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-xs text-white/50">{p.category.name}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-semibold text-amber-400">{p.priceCents ? `${(p.priceCents / 100).toFixed(2)}₺` : '-'}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {p.stockQty > 0 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                        <CheckCircle className="h-3 w-3" /> {p.stockQty} Adet
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs font-medium text-red-400">
                        <XCircle className="h-3 w-3" /> Tükendi
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleToggleActive(p)} className="hover:opacity-80">
                      {p.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-white/40">
                          Pasif
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => handleDelete(p.id)} className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
