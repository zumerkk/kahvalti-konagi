"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, CheckCircle, XCircle, Trash2, Pencil, Check, X } from "lucide-react";
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

const inputCls =
  "w-full rounded-lg border border-white/[0.1] bg-white/[0.06] px-2.5 py-1.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-amber-500/40";

export default function ProductClient({
  initialProducts,
  categories
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCategoryId) return toast.error("Ürün adı ve kategori zorunludur.");

    setIsAdding(true);
    const normalizedPrice = newPrice.trim().replace(",", ".");
    const priceValue = normalizedPrice ? Number(normalizedPrice) : null;
    if (priceValue != null && !Number.isFinite(priceValue)) {
      setIsAdding(false);
      return toast.error("Fiyat geçersiz.");
    }
    const priceCents = priceValue != null ? Math.round(priceValue * 100) : undefined;

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
      setNewCategoryId("");
      setNewPrice("");
      setNewStock("");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditCategoryId(p.categoryId);
    setEditPrice(p.priceCents != null ? (p.priceCents / 100).toString() : "");
    setEditStock(p.stockQty.toString());
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    if (!editName.trim()) return toast.error("Ürün adı zorunludur.");
    if (!editCategoryId) return toast.error("Kategori zorunludur.");

    const normalizedPrice = editPrice.trim().replace(",", ".");
    const priceValue = normalizedPrice ? Number(normalizedPrice) : null;
    if (priceValue != null && (!Number.isFinite(priceValue) || priceValue < 0)) {
      return toast.error("Fiyat geçersiz.");
    }
    // Boş fiyat = null (açık büfe gibi sabit/fiyatsız ürünler için)
    const priceCents = priceValue != null ? Math.round(priceValue * 100) : null;

    setIsSaving(true);
    const res = await updateProduct(editingId, {
      name: editName.trim(),
      categoryId: editCategoryId,
      priceCents,
      stockQty: parseInt(editStock) || 0,
    });
    setIsSaving(false);

    if (res.success) {
      toast.success("Ürün güncellendi.");
      setEditingId(null);
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleToggleActive = async (p: Product) => {
    const res = await updateProduct(p.id, { isActive: !p.isActive });
    if (res.success) {
      toast.success("Ürün durumu güncellendi.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    const res = await deleteProduct(id);
    if (res.success) {
      toast.success("Ürün silindi.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
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
            disabled={categories.length === 0}
          >
            <option value="">{categories.length === 0 ? "Önce kategori ekleyin" : "Kategori seçin"}</option>
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
              {initialProducts.map((p) => {
                const isEditing = editingId === p.id;
                return (
                <tr key={p.id} className={`transition-colors hover:bg-white/[0.02] ${!p.isActive && !isEditing ? 'opacity-50' : ''} ${isEditing ? 'bg-amber-500/[0.04]' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
                        <Package className="h-4 w-4 text-amber-400" />
                      </div>
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          autoFocus
                          className={`${inputCls} min-w-[140px]`}
                          placeholder="Ürün adı"
                        />
                      ) : (
                        <span className="font-medium text-white">{p.name}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    {isEditing ? (
                      <select
                        value={editCategoryId}
                        onChange={e => setEditCategoryId(e.target.value)}
                        className={`${inputCls} min-w-[130px]`}
                      >
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-xs text-white/50">{p.category.name}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <input
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          type="number" step="0.01" min="0"
                          placeholder="Boş = fiyatsız"
                          className={`${inputCls} w-28`}
                        />
                        <span className="text-amber-400/70">₺</span>
                      </div>
                    ) : (
                      <span className="font-semibold text-amber-400">{p.priceCents != null ? `${(p.priceCents / 100).toFixed(2)}₺` : '-'}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    {isEditing ? (
                      <input
                        value={editStock}
                        onChange={e => setEditStock(e.target.value)}
                        type="number" min="0"
                        className={`${inputCls} w-20`}
                      />
                    ) : p.stockQty > 0 ? (
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
                    <button onClick={() => handleToggleActive(p)} disabled={isEditing} className="hover:opacity-80 disabled:opacity-40">
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
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            title="Kaydet"
                            className="rounded-lg bg-emerald-500/15 p-1.5 text-emerald-400 transition hover:bg-emerald-500/25 disabled:opacity-50"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            disabled={isSaving}
                            title="İptal"
                            className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            title="Düzenle"
                            className="rounded-lg p-1.5 text-amber-400/70 transition hover:bg-amber-500/10 hover:text-amber-400"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            title="Sil"
                            className="rounded-lg p-1.5 text-red-400/70 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
