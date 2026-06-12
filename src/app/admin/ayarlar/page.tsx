import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.settings.findUnique({ where: { id: "singleton" } }) || {
    businessName: "Kahvaltı Konağı", phone: "", whatsapp: "", address: "", 
    reservationsEnabled: true, onlineReservationsActive: true,
    reservationStartTime: "08:00", reservationEndTime: "15:00", cafeStartTime: "15:00", cafeEndTime: "23:00",
    slotMinutes: 30, minPartySize: 1, maxPartySize: 4, breakfastPricePerPerson: 450,
    depositEnabled: false, depositAmount: 0, smsEnabled: false, emailEnabled: false
  };

  async function updateSettings(formData: FormData) {
    "use server";
    
    const depositAmountLira = Number(formData.get("depositAmount") || 0);
    const depositAmountKurus = Math.round(depositAmountLira * 100);
    
    await prisma.settings.upsert({
      where: { id: "singleton" },
      update: {
        businessName: formData.get("businessName") as string,
        phone: formData.get("phone") as string,
        whatsapp: formData.get("whatsapp") as string,
        address: formData.get("address") as string,
        reservationsEnabled: formData.get("reservationsEnabled") === "on",
        onlineReservationsActive: formData.get("onlineReservationsActive") === "on",
        reservationStartTime: formData.get("reservationStartTime") as string,
        reservationEndTime: formData.get("reservationEndTime") as string,
        cafeStartTime: formData.get("cafeStartTime") as string,
        cafeEndTime: formData.get("cafeEndTime") as string,
        slotMinutes: Number(formData.get("slotMinutes")),
        minPartySize: Number(formData.get("minPartySize")),
        maxPartySize: Number(formData.get("maxPartySize")),
        breakfastPricePerPerson: Number(formData.get("breakfastPricePerPerson")),
        depositEnabled: formData.get("depositEnabled") === "on",
        depositAmount: depositAmountKurus,
        smsEnabled: formData.get("smsEnabled") === "on",
        emailEnabled: formData.get("emailEnabled") === "on",
      },
      create: {
        id: "singleton",
        businessName: formData.get("businessName") as string,
        phone: formData.get("phone") as string,
        whatsapp: formData.get("whatsapp") as string,
        address: formData.get("address") as string,
        reservationsEnabled: formData.get("reservationsEnabled") === "on",
        onlineReservationsActive: formData.get("onlineReservationsActive") === "on",
        reservationStartTime: formData.get("reservationStartTime") as string,
        reservationEndTime: formData.get("reservationEndTime") as string,
        cafeStartTime: formData.get("cafeStartTime") as string,
        cafeEndTime: formData.get("cafeEndTime") as string,
        slotMinutes: Number(formData.get("slotMinutes")),
        minPartySize: Number(formData.get("minPartySize")),
        maxPartySize: Number(formData.get("maxPartySize")),
        breakfastPricePerPerson: Number(formData.get("breakfastPricePerPerson")),
        depositEnabled: formData.get("depositEnabled") === "on",
        depositAmount: depositAmountKurus,
        smsEnabled: formData.get("smsEnabled") === "on",
        emailEnabled: formData.get("emailEnabled") === "on",
      }
    });

    revalidatePath("/admin/ayarlar");
  }

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Genel Ayarlar</h1>
      
      <form action={updateSettings} className="bg-white p-6 rounded-xl shadow border space-y-6">
        <h2 className="text-lg font-semibold border-b pb-2">İşletme Bilgileri</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm mb-1">İşletme Adı</label><input type="text" name="businessName" defaultValue={settings.businessName} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Telefon</label><input type="text" name="phone" defaultValue={settings.phone || ""} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">WhatsApp</label><input type="text" name="whatsapp" defaultValue={settings.whatsapp || ""} className="w-full p-2 border rounded" /></div>
          <div className="md:col-span-2"><label className="block text-sm mb-1">Adres</label><textarea name="address" defaultValue={settings.address || ""} className="w-full p-2 border rounded" /></div>
        </div>

        <h2 className="text-lg font-semibold border-b pb-2 mt-6">Rezervasyon ve Kapasite</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="reservationsEnabled" defaultChecked={settings.reservationsEnabled} /> Sistem Açık</label>
            <label className="flex items-center gap-2 text-sm mt-2"><input type="checkbox" name="onlineReservationsActive" defaultChecked={settings.onlineReservationsActive} /> Online Rezervasyon Açık</label>
          </div>
          <div><label className="block text-sm mb-1">Kahvaltı Başlangıç</label><input type="time" name="reservationStartTime" defaultValue={settings.reservationStartTime} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Kahvaltı Bitiş</label><input type="time" name="reservationEndTime" defaultValue={settings.reservationEndTime} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Cafe Başlangıç</label><input type="time" name="cafeStartTime" defaultValue={settings.cafeStartTime} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Cafe Bitiş</label><input type="time" name="cafeEndTime" defaultValue={settings.cafeEndTime} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Slot Aralığı (Dk)</label><input type="number" name="slotMinutes" defaultValue={settings.slotMinutes} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Kişi Başı Kahvaltı (₺)</label><input type="number" name="breakfastPricePerPerson" defaultValue={settings.breakfastPricePerPerson} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Min. Kişi</label><input type="number" name="minPartySize" defaultValue={settings.minPartySize} className="w-full p-2 border rounded" /></div>
          <div><label className="block text-sm mb-1">Maks. Kişi</label><input type="number" name="maxPartySize" defaultValue={settings.maxPartySize} className="w-full p-2 border rounded" /></div>
        </div>

        <h2 className="text-lg font-semibold border-b pb-2 mt-6">Ödeme & Bildirim</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div><label className="flex items-center gap-2 text-sm mb-2"><input type="checkbox" name="depositEnabled" defaultChecked={settings.depositEnabled} /> Kapora İste</label></div>
          <div><label className="block text-sm mb-1">Kapora Tutarı (₺)</label><input type="number" step="0.01" name="depositAmount" defaultValue={settings.depositAmount / 100} className="w-full p-2 border rounded" /></div>
          <div className="md:col-span-1"></div>
          <div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="smsEnabled" defaultChecked={settings.smsEnabled} /> SMS Gönder</label></div>
          <div><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="emailEnabled" defaultChecked={settings.emailEnabled} /> E-Posta Gönder</label></div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium mt-4">
          Ayarları Kaydet
        </button>
      </form>
    </div>
  );
}
