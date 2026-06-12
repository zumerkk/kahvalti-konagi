"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getTimeSlots, isAllowedDate } from "@/lib/reservation-rules";
import { Input, TextArea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { 
  Coffee, 
  Sun, 
  Armchair, 
  Flower, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CreditCard, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Users,
  Send
} from "lucide-react";
import { toast } from "sonner";

type ServiceType = "BREAKFAST" | "CAFE";
type AreaCode = "CAMEKAN" | "SALON";

type TableOption = { id: string; name: string };
type AvailabilityResponse =
  | { ok: true; closed: true; reason: string | null; tables: [] }
  | { ok: true; closed: false; tables: TableOption[] }
  | { ok: false; error: string };

type AreaDto = { id: string; code: AreaCode; title: string };
type AreasResponse = { ok: true; areas: AreaDto[] } | { ok: false; error: string };

type PublicSettingsResponse =
  | { ok: true; settings: { breakfastPricePerPerson: number, onlineReservationsActive: boolean, maxPartySize: number, minPartySize: number } }
  | { ok: false; error: string };

type ReservationCreateResponse =
  | {
      ok: true;
      reservation: { id: string; date: string; time: string; table: { name: string } };
    }
  | { ok: false; error: string };

export function ReservationForm() {
  // Wizard Step: 1 = Service & Area, 2 = Date & Time & Guests, 3 = Personal Info, 4 = Success
  const [step, setStep] = useState(1);

  const [serviceType, setServiceType] = useState<ServiceType>("BREAKFAST");
  const [areaCode, setAreaCode] = useState<AreaCode>("SALON");
  const [areas, setAreas] = useState<AreaDto[]>([]);
  const [areaId, setAreaId] = useState("");
  const [loadingAreas, setLoadingAreas] = useState(false);

  const [breakfastPricePerPerson, setBreakfastPricePerPerson] = useState<number | null>(450);
  const [onlineActive, setOnlineActive] = useState(true);
  const [maxPartySize, setMaxPartySize] = useState(4);
  const [minPartySize, setMinPartySize] = useState(1);

  const timeSlots = useMemo(() => getTimeSlots(serviceType), [serviceType]);
  
  // Default to tomorrow or today
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  });
  const [time, setTime] = useState("");

  const [tables, setTables] = useState<TableOption[]>([]);
  const [closedReason, setClosedReason] = useState<string | null>(null);
  const [loadingTables, setLoadingTables] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [tckn, setTckn] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [note, setNote] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    id: string;
    time: string;
    tableName: string;
    dateISO: string;
  } | null>(null);

  // Load static resources
  async function loadAreas() {
    setLoadingAreas(true);
    try {
      const res = await fetch("/api/areas");
      const json = (await res.json()) as AreasResponse;
      if (res.ok && "areas" in json) {
        setAreas(json.areas);
      }
    } catch {
      toast.error("Alanlar yüklenirken bir hata oluştu.");
    } finally {
      setLoadingAreas(false);
    }
  }

  async function loadPublicSettings() {
    try {
      const res = await fetch("/api/settings");
      const json = (await res.json()) as PublicSettingsResponse;
      if (res.ok && "settings" in json) {
        setBreakfastPricePerPerson(json.settings.breakfastPricePerPerson);
        setOnlineActive(json.settings.onlineReservationsActive);
        setMaxPartySize(json.settings.maxPartySize);
        setMinPartySize(json.settings.minPartySize);
      }
    } catch {
      // sessiz geçiş
    }
  }

  // Load user data from localStorage
  useEffect(() => {
    void loadAreas();
    void loadPublicSettings();

    try {
      const savedName = localStorage.getItem("kk_fullname");
      const savedPhone = localStorage.getItem("kk_phone");
      const savedTckn = localStorage.getItem("kk_tckn");
      if (savedName) setFullName(savedName);
      if (savedPhone) setPhone(savedPhone);
      if (savedTckn) setTckn(savedTckn);
    } catch {
      // LocalStorage errors
    }
  }, []);

  useEffect(() => {
    const id = areas.find((a) => a.code === areaCode)?.id ?? "";
    setAreaId(id);
    if (!id) {
      setTables([]);
    }
  }, [areas, areaCode]);

  // Sync default time when serviceType changes
  useEffect(() => {
    setTime(timeSlots[0] ?? "08:00");
  }, [timeSlots]);

  const loadAvailability = useCallback(async (d: string, t: string) => {
    if (!d || !t || !areaId) return;
    if (!isAllowedDate(d)) {
      setTables([]);
      setClosedReason("Tarih geçersiz.");
      return;
    }
    setLoadingTables(true);
    setClosedReason(null);
    try {
      const res = await fetch(
        `/api/availability?serviceType=${encodeURIComponent(serviceType)}&areaId=${encodeURIComponent(
          areaId,
        )}&date=${encodeURIComponent(d)}&time=${encodeURIComponent(t)}`,
      );
      const json = (await res.json()) as AvailabilityResponse;
      if (!res.ok) {
        setTables([]);
        setClosedReason("error" in json ? json.error : "Kapasite sorgulanamadı.");
        return;
      }
      if ("closed" in json && json.closed) {
        setTables([]);
        setClosedReason(json.reason ?? "Seçilen gün kapalıyız.");
        return;
      }
      setTables("tables" in json ? json.tables ?? [] : []);
    } catch {
      setTables([]);
      setClosedReason("Bağlantı hatası.");
    } finally {
      setLoadingTables(false);
    }
  }, [areaId, serviceType]);

  useEffect(() => {
    if (date && time) {
      void loadAvailability(date, time);
    }
  }, [date, time, loadAvailability]);

  async function submit() {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Save details in local storage if requested
    if (rememberMe) {
      try {
        localStorage.setItem("kk_fullname", fullName);
        localStorage.setItem("kk_phone", phone);
        localStorage.setItem("kk_tckn", tckn);
      } catch {
        // Safe to ignore
      }
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          date,
          time,
          areaId,
          tableId: "auto", // Automatically chosen by the server
          fullName,
          phone,
          tckn,
          partySize,
          note,
        }),
      });
      const json = (await res.json()) as ReservationCreateResponse;
      if (!res.ok || !("reservation" in json)) {
        setError("error" in json ? json.error : "Rezervasyon işlemi gerçekleştirilemedi.");
        return;
      }
      setSuccess({
        id: json.reservation.id,
        time: json.reservation.time,
        tableName: json.reservation.table.name,
        dateISO: json.reservation.date,
      });
      setStep(4);
      toast.success("Rezervasyon başarıyla oluşturuldu!");
    } catch {
      setError("Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setSubmitting(false);
    }
  }

  // Preformatted WhatsApp message builder
  const handleWhatsAppBooking = () => {
    const serviceName = serviceType === "BREAKFAST" ? "Açık Büfe Kahvaltı" : "Kafe / Bistro";
    const areaName = areaCode === "CAMEKAN" ? "Camekan Bölümü" : "İç Salon";
    const formattedDate = date ? new Date(date).toLocaleDateString("tr-TR") : "(Tarih Seçilmedi)";
    
    const text = `Merhaba, Kahvaltı Konağı için online rezervasyon yaptırmak istiyorum:\n\n` +
                 `🍽️ Hizmet: ${serviceName}\n` +
                 `📍 Bölüm: ${areaName}\n` +
                 `📅 Tarih: ${formattedDate}\n` +
                 `⏰ Saat: ${time}\n` +
                 `👥 Kişi: ${partySize} Kişi\n` +
                 `${fullName ? `👤 İsim: ${fullName}\n` : ""}` +
                 `${phone ? `📞 Telefon: ${phone}\n` : ""}` +
                 `\nMasamızı rezerve edebilir miyiz? Teşekkürler!`;
                 
    window.open(`https://wa.me/905468983014?text=${encodeURIComponent(text)}`, "_blank");
  };

  const breakfastTotal =
    serviceType === "BREAKFAST" && breakfastPricePerPerson != null
      ? breakfastPricePerPerson * partySize
      : null;

  // Form validations for each step
  const canNextStep2 = date && time && tables.length > 0 && !closedReason && partySize >= minPartySize && partySize <= maxPartySize;
  const canSubmit = fullName.trim().length >= 2 && phone.trim().length >= 8 && tckn.length === 11;

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-[#e6dfd5] bg-white p-6 md:p-8 shadow-xl shadow-orange-950/5">
      {/* Visual background accents */}
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-orange-500/5 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />

      {!onlineActive && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-center text-red-800 text-sm font-semibold">
          ⚠️ Şu anda online rezervasyon alımları geçici olarak kapalıdır. Telefon ile ulaşabilirsiniz.
        </div>
      )}

      {/* Stepper Progress Bar (Only show if not in success step) */}
      {step < 4 && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-[#7c6f62] mb-3 px-1">
            <span className={step >= 1 ? "text-orange-600 font-bold" : "font-medium"}>Hizmet & Alan</span>
            <span className={step >= 2 ? "text-orange-600 font-bold" : "font-medium"}>Tarih & Saat</span>
            <span className={step >= 3 ? "text-orange-600 font-bold" : "font-medium"}>Bilgileriniz</span>
          </div>
          <div className="h-1.5 w-full bg-orange-100/60 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* STEP 1: SERVICE & AREA SELECTION */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#3d3023] tracking-tight">Hizmet Seçimi</h2>
            <p className="text-sm text-[#7c6f62] mt-1">Lütfen tercih ettiğiniz hizmeti seçin:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <button
                type="button"
                onClick={() => setServiceType("BREAKFAST")}
                className={`relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left group cursor-pointer ${
                  serviceType === "BREAKFAST"
                    ? "border-orange-500 bg-orange-50/80 text-[#3d3023] shadow-md shadow-orange-500/5"
                    : "border-[#e6dfd5] bg-white text-[#5c4d3c] hover:border-orange-200 hover:bg-orange-50/10"
                }`}
              >
                <div className={`p-3 rounded-xl ${serviceType === "BREAKFAST" ? "bg-orange-500 text-white" : "bg-orange-100/60 text-orange-600"} mb-4 group-hover:scale-110 transition-transform`}>
                  <Sun className="h-6 w-6" />
                </div>
                <span className="font-bold text-lg text-[#3d3023]">Serpme & Açık Büfe Kahvaltı</span>
                <span className="text-xs text-[#7c6f62] mt-1 leading-relaxed">
                  08:00 - 15:00 saatleri arası. Sınırsız taze sıcaklar ve organik zengin kahvaltılıklar.
                </span>
                {breakfastPricePerPerson && (
                  <span className="mt-3 text-sm font-extrabold text-orange-600 bg-orange-100/50 px-2.5 py-1 rounded-lg">
                    Kişi Başı: {breakfastPricePerPerson}₺
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setServiceType("CAFE")}
                className={`relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left group cursor-pointer ${
                  serviceType === "CAFE"
                    ? "border-orange-500 bg-orange-50/80 text-[#3d3023] shadow-md shadow-orange-500/5"
                    : "border-[#e6dfd5] bg-white text-[#5c4d3c] hover:border-orange-200 hover:bg-orange-50/10"
                }`}
              >
                <div className={`p-3 rounded-xl ${serviceType === "CAFE" ? "bg-orange-500 text-white" : "bg-orange-100/60 text-orange-600"} mb-4 group-hover:scale-110 transition-transform`}>
                  <Coffee className="h-6 w-6" />
                </div>
                <span className="font-bold text-lg text-[#3d3023]">Cafe & Bistro Hizmeti</span>
                <span className="text-xs text-[#7c6f62] mt-1 leading-relaxed">
                  15:00 - 23:00 saatleri arası. Enfes tiramisu, taze tatlılar ve taze kahve çeşitleri.
                </span>
                <span className="mt-3 text-sm font-extrabold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                  Rezervasyon Ücretsiz
                </span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#3d3023] tracking-tight mt-6">Bölüm Tercihi</h2>
            <p className="text-sm text-[#7c6f62] mt-1">Keyifli vakit geçirmek istediğiniz alanı belirleyin:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <button
                type="button"
                onClick={() => setAreaCode("CAMEKAN")}
                className={`relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left group cursor-pointer ${
                  areaCode === "CAMEKAN"
                    ? "border-orange-500 bg-orange-50/80 text-[#3d3023] shadow-md shadow-orange-500/5"
                    : "border-[#e6dfd5] bg-white text-[#5c4d3c] hover:border-orange-200 hover:bg-orange-50/10"
                }`}
              >
                <div className={`p-3 rounded-xl ${areaCode === "CAMEKAN" ? "bg-orange-500 text-white" : "bg-orange-100/60 text-orange-600"} mb-4 group-hover:scale-110 transition-transform`}>
                  <Flower className="h-6 w-6" />
                </div>
                <span className="font-bold text-lg text-[#3d3023]">
                  {areas.find((a) => a.code === "CAMEKAN")?.title ?? "Ferah Camekan"}
                </span>
                <span className="text-xs text-[#7c6f62] mt-1 leading-relaxed">
                  Camlarla çevrili, aydınlık bahçe manzaralı premium kış bahçesi deneyimi.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setAreaCode("SALON")}
                className={`relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-200 text-left group cursor-pointer ${
                  areaCode === "SALON"
                    ? "border-orange-500 bg-orange-50/80 text-[#3d3023] shadow-md shadow-orange-500/5"
                    : "border-[#e6dfd5] bg-white text-[#5c4d3c] hover:border-orange-200 hover:bg-orange-50/10"
                }`}
              >
                <div className={`p-3 rounded-xl ${areaCode === "SALON" ? "bg-orange-500 text-white" : "bg-orange-100/60 text-orange-600"} mb-4 group-hover:scale-110 transition-transform`}>
                  <Armchair className="h-6 w-6" />
                </div>
                <span className="font-bold text-lg text-[#3d3023]">
                  {areas.find((a) => a.code === "SALON")?.title ?? "Nezih İç Salon"}
                </span>
                <span className="text-xs text-[#7c6f62] mt-1 leading-relaxed">
                  Loş ışıklandırma, şömine ambiyansı ve hafif müzikle dinlendirici kapalı alan.
                </span>
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!onlineActive}
              className="gap-2 px-8 py-3.5"
            >
              Devam Et
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: DATE & TIME & GUESTS SELECTION */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#4a3e31]">
                <Calendar className="h-4 w-4 text-orange-500" />
                Tarih Seçiniz
              </label>
              <Input
                type="date"
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setDate(e.target.value)}
                className="w-full"
              />
              <span className="text-xs text-[#7c6f62] block">Hafta sonları için erken rezervasyon önerilir.</span>
            </div>

            {/* Guest Count with Custom Counter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#4a3e31]">
                <Users className="h-4 w-4 text-orange-500" />
                Kişi Sayısı
              </label>
              <div className="flex items-center justify-between border border-[#e6dfd5] bg-orange-50/30 rounded-xl p-2.5">
                <button
                  type="button"
                  onClick={() => setPartySize(prev => Math.max(minPartySize, prev - 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-white border border-[#e6dfd5] text-[#3d3023] font-bold hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                >
                  -
                </button>
                <div className="text-center">
                  <span className="text-lg font-extrabold text-[#3d3023] block">{partySize} Kişi</span>
                  {serviceType === "BREAKFAST" && breakfastTotal != null && (
                    <span className="text-xs font-bold text-orange-600">Tutar: {breakfastTotal}₺</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setPartySize(prev => Math.min(maxPartySize, prev + 1))}
                  className="h-10 w-10 flex items-center justify-center rounded-lg bg-white border border-[#e6dfd5] text-[#3d3023] font-bold hover:bg-orange-50 hover:text-orange-600 transition cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-[#7c6f62] block">En az {minPartySize}, en fazla {maxPartySize} kişi seçebilirsiniz.</span>
            </div>
          </div>

          {/* Time Picker Rendered as Interactive Chips */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-[#4a3e31]">
              <Clock className="h-4 w-4 text-orange-500" />
              Giriş Saati
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 border border-[#e6dfd5] bg-orange-50/10 p-3 rounded-2xl max-h-48 overflow-y-auto">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`py-2 rounded-xl text-center text-sm font-semibold transition-all cursor-pointer ${
                    time === slot
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/10"
                      : "bg-white border border-[#e6dfd5] text-[#5c4d3c] hover:border-orange-300 hover:text-orange-600"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Table Capacity Alert */}
          {loadingTables ? (
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-200/60 text-center text-sm text-[#7c6f62] font-semibold">
              ⏳ Doluluk oranı sorgulanıyor...
            </div>
          ) : closedReason ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center text-sm text-red-700 font-semibold">
              ⚠️ {closedReason}
            </div>
          ) : tables.length === 0 && date && time ? (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-center text-sm text-red-700 font-semibold leading-relaxed">
              ⚠️ Üzgünüz! Seçtiğiniz saatte {areaCode === "CAMEKAN" ? "Camekan" : "İç Salon"} alanında boş masamız kalmamıştır. Lütfen saati veya alanı değiştirin.
            </div>
          ) : tables.length > 0 && date && time ? (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center text-sm text-green-800 font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Müsaitlik Onaylandı! Alanımızda boş masalar bulunuyor.
            </div>
          ) : null}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition text-[#7c6f62] hover:text-orange-600 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri Dön
            </button>
            <Button
              type="button"
              onClick={() => setStep(3)}
              disabled={!canNextStep2 || loadingTables}
              className="gap-2 px-8 py-3.5"
            >
              Bilgilerime Geç
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: PERSONAL INFORMATION */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[#3d3023] tracking-tight">Rezervasyon Sahibi</h2>
          <p className="text-sm text-[#7c6f62] mt-1">Lütfen irtibat bilgilerini eksiksiz doldurun:</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#4a3e31]">
                <User className="h-4 w-4 text-orange-500" />
                Ad Soyad
              </label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#4a3e31]">
                <Phone className="h-4 w-4 text-orange-500" />
                Cep Telefonu
              </label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Örn: 0555 555 55 55"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#4a3e31]">
                <CreditCard className="h-4 w-4 text-orange-500" />
                T.C. Kimlik No (11 Haneli)
              </label>
              <Input
                type="text"
                value={tckn}
                onChange={(e) => setTckn(e.target.value.replace(/\D/g, "").slice(0, 11))}
                placeholder="Sadece doğrulama için"
                className="w-full"
                inputMode="numeric"
              />
              <span className="text-[10px] text-[#8c7d6c] block">KVKK kapsamında şifreli saklanır, 3. kişilerle paylaşılmaz.</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-[#4a3e31]">
                <MessageSquare className="h-4 w-4 text-orange-500" />
                Rezervasyon Notu (Opsiyonel)
              </label>
              <TextArea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Örn: bebek sandalyesi, sessiz köşe..."
                className="w-full"
              />
            </div>
          </div>

          {/* Cache details preference */}
          <label className="flex items-center gap-2 cursor-pointer py-1 select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-[#e6dfd5] text-orange-500 focus:ring-0 cursor-pointer h-4 w-4 bg-white"
            />
            <span className="text-xs text-[#5c4d3c] font-medium">Bilgilerimi tarayıcıya kaydet (Bir sonraki ziyaretinizde hızlı doldurulur)</span>
          </label>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 leading-relaxed">
              ⚠️ {error}
            </div>
          )}

          {/* Dynamic Actions */}
          <div className="border-t border-[#faf6ee] pt-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 text-sm font-semibold text-[#7c6f62] hover:text-orange-600 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                Tarih Değiştir
              </button>
              
              <Button
                onClick={submit}
                disabled={submitting || !canSubmit}
                className="gap-2 px-8 py-3.5 shadow-lg shadow-orange-500/15"
              >
                {submitting ? "Gönderiliyor..." : "Rezervasyonu Onayla"}
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick backup WhatsApp Booking */}
            <div className="flex flex-col items-center border-t border-[#faf6ee] pt-4">
              <span className="text-[11px] text-[#8c7d6c] mb-2 font-medium">Alternatif hızlı seçenek:</span>
              <button
                type="button"
                onClick={handleWhatsAppBooking}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold text-sm hover:bg-green-100 hover:text-green-800 transition shadow-sm cursor-pointer"
              >
                <Send className="h-4 w-4 text-green-600" />
                Tek Tıkla WhatsApp Rezervasyonu Yap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS CONGRATULATIONS SCREEN */}
      {step === 4 && success && (
        <div className="text-center py-8 space-y-6">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 border border-green-200 text-green-600 animate-bounce">
            <CheckCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#3d3023]">Rezervasyon Talebi Alındı!</h2>
            <p className="text-sm text-[#5c4d3c] max-w-md mx-auto leading-relaxed">
              Rezervasyonunuz başarıyla oluşturuldu ve sisteme kaydedildi. Rezervasyon detayları aşağıda yer almaktadır:
            </p>
          </div>

          {/* Detailed summary ticket */}
          <div className="max-w-md mx-auto rounded-3xl border border-[#e6dfd5] bg-white p-6 text-left space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 h-16 w-16 bg-orange-500/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-[#faf6ee] pb-3">
              <span className="text-xs text-[#8c7d6c] uppercase tracking-wider font-semibold">Rezervasyon Kodu</span>
              <span className="text-sm font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">{success.id}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-[#8c7d6c] block">Hizmet</span>
                <span className="font-bold text-[#3d3023] mt-0.5 block">
                  {serviceType === "BREAKFAST" ? "Açık Büfe Kahvaltı" : "Cafe / Bistro"}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8c7d6c] block">Bölüm / Alan</span>
                <span className="font-bold text-[#3d3023] mt-0.5 block">
                  {areaCode === "CAMEKAN" ? "Camekan Bölümü" : "İç Salon"}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8c7d6c] block">Tarih</span>
                <span className="font-bold text-[#3d3023] mt-0.5 block">
                  {new Date(date).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <div>
                <span className="text-xs text-[#8c7d6c] block">Giriş Saati</span>
                <span className="font-bold text-[#3d3023] mt-0.5 block">{success.time}</span>
              </div>
              <div>
                <span className="text-xs text-[#8c7d6c] block">Kişi Sayısı</span>
                <span className="font-bold text-[#3d3023] mt-0.5 block">{partySize} Kişi</span>
              </div>
              <div>
                <span className="text-xs text-[#8c7d6c] block">Atanan Masa</span>
                <span className="font-bold text-orange-600 mt-0.5 block">{success.tableName}</span>
              </div>
            </div>

            {serviceType === "BREAKFAST" && breakfastTotal != null && (
              <div className="border-t border-[#faf6ee] pt-3 flex justify-between items-center text-sm">
                <span className="text-xs text-[#8c7d6c] font-semibold">Ödenecek Toplam Tutar</span>
                <span className="font-extrabold text-[#3d3023] text-lg">{breakfastTotal}₺</span>
              </div>
            )}
          </div>

          <div className="max-w-md mx-auto p-4 rounded-2xl bg-orange-50 border border-orange-200 text-left text-xs text-[#7c6f62] leading-relaxed">
            <b>📍 Önemli Hatırlatma:</b> Rezervasyon saatinizden itibaren <b>en fazla 15 dakika</b> masanız bekletilir. Gecikme veya iptal durumları için lütfen <b>0546 898 30 14</b> numaralı telefondan bizi bilgilendiriniz. Teşekkürler!
          </div>

          <div className="flex justify-center gap-3 max-w-xs mx-auto">
            <Button
              type="button"
              onClick={() => {
                setStep(1);
                setSuccess(null);
                setError(null);
              }}
              variant="secondary"
              className="w-full py-3"
            >
              Yeni Rezervasyon Yap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
