"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function NewReservationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/areas").then(r => r.json()).then(d => {
      if(d.ok) setAreas(d.areas);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/admin/reservations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          partySize: Number(data.partySize)
        })
      });
      
      const resData = await res.json();
      if (resData.ok) {
        toast.success("Rezervasyon başarıyla oluşturuldu.");
        router.push("/admin/rezervasyonlar");
      } else {
        toast.error(resData.error || "Bir hata oluştu.");
      }
    } catch (err) {
      toast.error("Sistemsel bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border mt-8">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Manuel Rezervasyon Girişi</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kaynak</label>
            <select name="source" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="PHONE">Telefon</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="WALK_IN">Kapıdan (Walk-in)</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Durum</label>
            <select name="status" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="CONFIRMED">Onaylandı</option>
              <option value="PENDING">Beklemede</option>
              <option value="DEPOSIT_PENDING">Kapora Bekleniyor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Servis Tipi</label>
            <select name="serviceType" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="BREAKFAST">Kahvaltı</option>
              <option value="CAFE">Cafe</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Kişi Sayısı</label>
            <input type="number" name="partySize" min="1" defaultValue="2" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tarih</label>
            <input type="date" name="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Saat</label>
            <input type="time" name="time" step="1800" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Alan</label>
            <select name="areaId" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Seçiniz</option>
              {areas.map((a: any) => (
                <option key={a.id} value={a.id}>{a.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Masa ID (Manuel)</label>
            <input type="text" name="tableId" placeholder="Masa ID" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Müşteri Adı</label>
            <input type="text" name="fullName" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
            <input type="tel" name="phone" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notu</label>
          <textarea name="note" rows={3} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
          {loading ? "Oluşturuluyor..." : "Rezervasyonu Kaydet"}
        </button>
      </form>
    </div>
  );
}
