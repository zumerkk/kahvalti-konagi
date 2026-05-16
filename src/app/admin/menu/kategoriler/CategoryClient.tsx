"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ToggleLeft, ToggleRight, Package, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addCategory, updateCategory, deleteCategory } from "./actions";

type Category = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  _count?: { products: number };
};

export default function CategoryClient({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  
  // Add form state
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newSort, setNewSort] = useState("0");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return toast.error("Kategori adı zorunludur.");
    
    setIsAdding(true);
    const res = await addCategory({ name: newName, description: newDesc, sortOrder: parseInt(newSort) || 0 });
    setIsAdding(false);
    
    if (res.success) {
      toast.success("Kategori eklendi.");
      setNewName("");
      setNewDesc("");
      setNewSort("0");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleToggleActive = async (c: Category) => {
    const res = await updateCategory(c.id, {
      name: c.name,
      description: c.description || undefined,
      sortOrder: c.sortOrder,
      isActive: !c.isActive
    });
    if (res.success) {
      toast.success("Kategori durumu güncellendi.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    
    const res = await deleteCategory(id);
    if (res.success) {
      toast.success("Kategori silindi.");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* New category form */}
      <form onSubmit={handleAdd} className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Plus className="h-4 w-4 text-violet-400" />
          Yeni Kategori
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
          <input 
            value={newName} onChange={e => setNewName(e.target.value)}
            type="text" placeholder="Kategori adı" 
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-500/30" 
          />
          <input 
            value={newDesc} onChange={e => setNewDesc(e.target.value)}
            type="text" placeholder="Açıklama" 
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-500/30" 
          />
          <input 
            value={newSort} onChange={e => setNewSort(e.target.value)}
            type="number" placeholder="Sıralama" 
            className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-violet-500/30" 
          />
          <button disabled={isAdding} type="submit" className="rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/20 disabled:opacity-50">
            {isAdding ? "Ekleniyor..." : "Ekle"}
          </button>
        </div>
      </form>

      {/* Categories grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialCategories.map((c) => (
          <div
            key={c.id}
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 transition-all duration-300 border-white/[0.06] bg-white/[0.02] ${
              !c.isActive ? "opacity-50" : ""
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30">#{c.sortOrder}</span>
                  <span className="text-base font-bold text-white">{c.name}</span>
                </div>
                {c.description && (
                  <div className="mt-1.5 text-xs text-white/40 leading-relaxed">{c.description}</div>
                )}
              </div>
              <div className="flex flex-col gap-2 items-end">
                <button onClick={() => handleToggleActive(c)} className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition ${
                  c.isActive
                    ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                    : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1]"
                }`}>
                  {c.isActive ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                  {c.isActive ? "Aktif" : "Pasif"}
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-xs text-white/40">
              <Package className="h-3 w-3" />
              {c._count?.products || 0} ürün
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
