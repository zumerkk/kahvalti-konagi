"use client";

import { motion } from "framer-motion";
import { Users, Clock, CreditCard } from "lucide-react";

export default function PosTableGrid({ tables, onTableClick }: { tables: any[]; onTableClick: (table: any) => void }) {
  const getTableStatusColor = (table: any) => {
    const hasOpenOrder = table.orders?.some((o: any) => o.status === "OPEN");
    const activeRes = table.reservations?.[0]; // Günün ilk aktif rezervasyonu

    if (hasOpenOrder) return "bg-blue-100 border-blue-400 text-blue-900"; // Dolu / Sipariş Alınmış
    if (activeRes?.status === "SEATED") return "bg-indigo-100 border-indigo-400 text-indigo-900"; // Oturdu ama sipariş yok
    if (activeRes?.status === "PENDING" || activeRes?.status === "CONFIRMED") return "bg-amber-100 border-amber-400 text-amber-900"; // Rezerve (Bekleniyor)
    if (activeRes?.status === "ARRIVED") return "bg-purple-100 border-purple-400 text-purple-900"; // Geldi (Bekliyor)
    
    return "bg-emerald-50 border-emerald-300 text-emerald-900"; // Boş
  };

  const getTableStatusText = (table: any) => {
    const hasOpenOrder = table.orders?.some((o: any) => o.status === "OPEN");
    const activeRes = table.reservations?.[0];

    if (hasOpenOrder) return "Dolu";
    if (activeRes?.status === "SEATED") return "Masaya Alındı";
    if (activeRes?.status === "PENDING" || activeRes?.status === "CONFIRMED") return `Rezerve (${activeRes.time})`;
    if (activeRes?.status === "ARRIVED") return "Müşteri Geldi";
    
    return "Boş";
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {tables.map((table) => {
        const statusColor = getTableStatusColor(table);
        const openOrder = table.orders?.find((o: any) => o.status === "OPEN");
        
        return (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            key={table.id}
            onClick={() => onTableClick(table)}
            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 shadow-sm transition-all h-32 ${statusColor}`}
          >
            <span className="font-bold text-xl mb-1">{table.name}</span>
            <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded-full">{getTableStatusText(table)}</span>
            
            {openOrder && (
              <div className="absolute bottom-2 flex gap-2 text-xs font-semibold">
                <span className="flex items-center gap-1 bg-white/60 px-1.5 py-0.5 rounded">
                  <CreditCard className="w-3 h-3" />
                  {(openOrder.totalAmount / 100).toFixed(2)}₺
                </span>
              </div>
            )}
            
            {table.reservations?.[0] && !openOrder && (
              <div className="absolute bottom-2 flex gap-2 text-xs">
                <span className="flex items-center gap-1 bg-white/60 px-1.5 py-0.5 rounded">
                  <Users className="w-3 h-3" />
                  {table.reservations[0].partySize}
                </span>
                <span className="flex items-center gap-1 bg-white/60 px-1.5 py-0.5 rounded">
                  <Clock className="w-3 h-3" />
                  {table.reservations[0].time}
                </span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
