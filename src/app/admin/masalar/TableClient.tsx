"use client";

import { useState } from "react";
import { Plus, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { addTable, updateTable, deleteTable } from "./actions";

type Area = { id: string; title: string };
type Table = {
  id: string;
  name: string;
  isActive: boolean;
  areaId: string;
  area: { title: string };
};

export default function TableClient({ 
  initialTables, 
  areas 
}: { 
  initialTables: Table[];
  areas: Area[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAreaId, setNewAreaId] = useState("");

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newAreaId) return toast.error("Masa adı ve alan zorunludur.");
    
    setIsAdding(true);
    const res = await addTable({ 
      name: newName, 
      areaId: newAreaId,
      isActive: true
    });
    setIsAdding(false);
    
    if (res.success) {
      toast.success("Masa eklendi.");
      setNewName("");
    } else {
      toast.error(res.error);
    }
  };

  const handleToggleActive = async (t: Table) => {
    const res = await updateTable(t.id, { isActive: !t.isActive });
    if (res.success) toast.success("Masa durumu güncellendi.");
    else toast.error(res.error);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu masayı silmek istediğinize emin misiniz?")) return;
    const res = await deleteTable(id);
    if (res.success) toast.success("Masa silindi.");
    else toast.error(res.error);
  };

  const activeCount = initialTables.filter((t) => t.isActive).length;

  return (
    <div className="space-y-6">
      <div className="text-sm text-white/40">
        {activeCount} aktif · {initialTables.length - activeCount} pasif — toplam {initialTables.length} masa
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* New table form */}
        <form onSubmit={handleAdd} className="rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6 h-fit">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Plus className="h-4 w-4 text-sky-400" />
            Yeni Masa
          </div>
          <div className="mt-4 space-y-3">
            <input 
              value={newName} onChange={e => setNewName(e.target.value)}
              type="text" placeholder="Masa adı (ör: M-9)" 
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-sky-500/30" 
            />
            <select 
              value={newAreaId} onChange={e => setNewAreaId(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white outline-none transition focus:border-sky-500/30"
            >
              <option value="">Alan seçin</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
            <button disabled={isAdding} type="submit" className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:shadow-sky-500/30 disabled:opacity-50">
              {isAdding ? "Ekleniyor..." : "Masa Ekle"}
            </button>
          </div>
        </form>

        {/* Tables grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {initialTables.map((t) => (
              <div
                key={t.id}
                className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg ${
                  t.isActive
                    ? "border-white/[0.06] bg-gradient-to-br from-white/[0.05] to-transparent hover:border-sky-500/20 hover:shadow-sky-500/5"
                    : "border-white/[0.04] bg-white/[0.02] opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-white">{t.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/40">
                      <span>{t.area.title}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => handleToggleActive(t)} className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      t.isActive
                        ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                        : "bg-white/[0.06] text-white/40 hover:bg-white/[0.1]"
                    }`}>
                      {t.isActive ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                      {t.isActive ? "Aktif" : "Pasif"}
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="text-red-400/70 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Visual indicator */}
                {t.isActive && (
                  <div className="pointer-events-none absolute -bottom-3 -right-3 h-16 w-16 rounded-full bg-sky-500/[0.06] blur-xl" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
