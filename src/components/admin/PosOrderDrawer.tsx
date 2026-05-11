"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, CreditCard, UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function PosOrderDrawer({ isOpen, onClose, table, onRefresh }: { isOpen: boolean; onClose: () => void; table: any; onRefresh: () => void }) {
  const [loading, setLoading] = useState(false);

  if (!table) return null;

  const openOrder = table.orders?.find((o: any) => o.status === "OPEN");
  const activeRes = table.reservations?.[0];

  const handleWalkIn = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pos/walk-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId: table.id, areaId: table.area.id, partySize: 2 })
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Masa açıldı.");
        onRefresh();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (method: string) => {
    if (!openOrder) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pos/order/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: openOrder.id, amountCents: openOrder.totalAmount, method })
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Ödeme alındı ve masa kapatıldı.");
        onRefresh();
        onClose();
      } else {
        toast.error(data.error);
      }
    } catch (err) {
      toast.error("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold">{table.name}</h2>
                <p className="text-sm text-slate-500">{table.area.title}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {!openOrder && !activeRes && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <p className="text-slate-500">Bu masa şu an boş.</p>
                  <button 
                    onClick={handleWalkIn}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                  >
                    Walk-in Müşteri Al (Hızlı Sipariş)
                  </button>
                </div>
              )}

              {openOrder && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Adisyon</h3>
                  {openOrder.items.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">Henüz ürün eklenmemiş.</p>
                  ) : (
                    <ul className="space-y-2">
                      {openOrder.items.map((item: any) => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span className="font-medium">{(item.quantity * item.priceCents / 100).toFixed(2)}₺</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="mt-8 pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-lg">Toplam</span>
                      <span className="font-bold text-2xl text-blue-600">{(openOrder.totalAmount / 100).toFixed(2)}₺</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={() => handlePay("CASH")} disabled={loading} className="flex items-center justify-center gap-2 bg-emerald-600 text-white p-3 rounded-lg hover:bg-emerald-700">
                        Nakit Öde
                      </button>
                      <button onClick={() => handlePay("CREDIT_CARD")} disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
                        Kredi Kartı
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
