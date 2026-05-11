"use client";

import { useEffect, useState } from "react";
import PosTableGrid from "@/components/admin/PosTableGrid";
import PosOrderDrawer from "@/components/admin/PosOrderDrawer";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

export default function PosPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pos/tables");
      const data = await res.json();
      if (data.ok) {
        setAreas(data.data);
      } else {
        toast.error("Masalar alınamadı: " + data.error);
      }
    } catch (error) {
      toast.error("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTables, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleTableClick = (table: any, area: any) => {
    setSelectedTable({ ...table, area });
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4 p-4 lg:p-6 bg-slate-50 overflow-hidden">
      <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Hızlı Satış / Operasyon</h1>
          <p className="text-sm text-slate-500">Masa durumlarını ve siparişleri anlık yönetin.</p>
        </div>
        <button 
          onClick={fetchTables}
          disabled={loading}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors font-medium"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Yenile
        </button>
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        {loading && areas.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {areas.map((area) => (
              <div key={area.id}>
                <h2 className="text-lg font-semibold mb-4 text-slate-700 border-b pb-2">{area.title}</h2>
                <PosTableGrid tables={area.tables} onTableClick={(t) => handleTableClick(t, area)} />
              </div>
            ))}
          </div>
        )}
      </div>

      <PosOrderDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedTable(null);
        }} 
        table={selectedTable}
        onRefresh={fetchTables}
      />
    </div>
  );
}
