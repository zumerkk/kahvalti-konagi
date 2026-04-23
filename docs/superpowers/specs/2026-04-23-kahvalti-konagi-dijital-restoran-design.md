# Kahvaltı Konağı — Dijital Restoran Sistemi (MVP1) Tasarım Dokümanı

Tarih: 2026-04-23  
Durum: **Onaylandı (kullanıcı onayı alındı)**  
Tasarım yönü: **C — Clean White (ferah/kurumsal, yüksek okunabilirlik)**

## 1) Özet
Bu doküman, “Kahvaltı Konağı” için **baştan revize** edilecek, **modern tanıtım sitesi + dijital menü + haftanın her günü rezervasyon + admin paneli** içeren MVP1 kapsamını tanımlar.

MVP1’in hedefi:
- Müşterinin web üzerinden **Kahvaltı** veya **Cafe&Bistro** için rezervasyon oluşturabilmesi
- İşletmenin admin panelden **rezervasyonları mobilde de rahat görüntüleyebilmesi**
- İşletmenin dijital menüyü (kategori/ürün/fiyat/stok) yönetebilmesi

MVP1 sonrası (MVP2) plan:
- Admin paneline bağlı **Hızlı Satış (POS)** ekranı ve stokların otomatik düşmesi

---

## 2) Kapsam

### 2.1 MVP1 — Dahil
**A) Website (Public)**
- Tanıtım / landing (Clean White)
- Galeri (foto/video)
- İletişim, yol tarifi
- “350₺ kişi başı açık büfe kahvaltı” + “14:00 sonrası cafe & bistro” vurguları

**B) Dijital Menü (Public)**
- Kategori bazlı listeleme
- Ürün kartları: ad, açıklama, fiyat (etiket fiyat), opsiyonel foto
- Ürün varyantı yok (S/M/L yok)

**C) Rezervasyon (Public)**
- Hizmet türü seçimi: **Kahvaltı** veya **Cafe&Bistro**
- Saat aralıkları:
  - Kahvaltı: **08:00–14:00**
  - Cafe&Bistro: **14:00–23:00**
- Slot: **30 dk**
- Masa seçimi: **Camekan / Salon + masa seçimi**
- Kişi sayısı: **max 4**
- Bilgiler: **Ad Soyad + Telefon + TCKN** (her iki hizmet türünde de zorunlu)
- Ödeme: **Mekanda ödeme** (online ödeme yok)

**D) Admin Panel (Responsive)**
- Giriş (admin)
- Rezervasyon görüntüleme ve filtreleme (en az: tarih + hizmet türü + alan)
- Alan (Camekan/Salon) ve masa yönetimi (ekle/sil/aktif-pasif)
- Dijital menü yönetimi:
  - Kategori CRUD
  - Ürün CRUD (fiyat, stok adedi, aktif/pasif, opsiyonel foto)
  - Stok düşümü: **manuel**
- Ayarlar:
  - Kahvaltı kişi başı fiyatı (varsayılan **350₺**), admin güncelleyebilir

### 2.2 MVP1 — Hariç (MVP2)
- POS / Hızlı satış akışı (kasada ürün seç, ödeme al, fiş vb.)
- Stokların otomatik düşmesi (POS ile entegre)
- Kampanya/indirim motoru
- Online ödeme / kapora
- Çoklu rol (kasiyer, garson vb.) — MVP1’de tek “admin” yeterli

---

## 3) Kullanıcı Rolleri & User Stories

### 3.1 Müşteri (Public)
1. Kahvaltı Konağı’nı keşfetmek, menüyü görmek, konum/iletişim bulmak ister.
2. “Kahvaltı” veya “Cafe&Bistro” seçip, uygun tarih/saatte müsait masa ile rezervasyon yapmak ister.
3. Rezervasyon sonrası bir “rezervasyon kodu” görmek ister.

### 3.2 Admin
1. Mobilde de rahat şekilde bugünkü/yarının rezervasyonlarını görmek ister.
2. Camekan/Salon alanlarında masa eklemek/kapatmak ister.
3. Kategori ve ürün ekleyip fiyat/stok güncellemek ister.
4. “Kişi başı kahvaltı fiyatı”nı gerektiğinde değiştirmek ister.

---

## 4) Bilgi Mimarisi (Sayfa Haritası)

### 4.1 Public
- `/` Ana sayfa (landing)
- `/menu` Dijital Menü
- `/rezervasyon` Rezervasyon
- (opsiyonel) `/hakkimizda`, `/iletisim` (tek sayfada anchor da olabilir)

### 4.2 Admin (responsive)
- `/admin/login`
- `/admin` (dashboard: özet + bugünkü rezervasyonlar)
- `/admin/rezervasyonlar`
- `/admin/menü/kategoriler`
- `/admin/menü/urunler`
- `/admin/masalar`
- `/admin/ayarlar`

---

## 5) Rezervasyon İş Kuralları

### 5.1 Hizmet türü ve saat pencereleri
- `serviceType = BREAKFAST` => saat 08:00–14:00
- `serviceType = CAFE` => saat 14:00–23:00
- Slot: 30 dk (örn: 08:00, 08:30, …)

### 5.2 Masa seçimi ve uygunluk
- Kullanıcı sırasıyla:
  1) Hizmet türü
  2) Tarih
  3) Saat
  4) Alan (Camekan/Salon)
  5) Masa (yalnızca müsait masalar listelenir)
  6) Kişi sayısı (1–4)
  7) Ad Soyad + Telefon + TCKN

Uygunluk hesabı:
- Aynı `date + time + tableId` için yalnızca **1 aktif rezervasyon** olabilir.
- Aktif masa olmayanlar listelenmez.

### 5.3 TCKN (KVKK)
- TCKN **ham olarak saklanmaz**.
- DB’de:
  - `tcknEncrypted` (AES-256-GCM ile şifrelenmiş)
  - `tcknLast4` (admin ekranında görünür)

### 5.4 Ödeme
- Online ödeme yok; metinlerde “Mekanda ödeme” belirtilir.

---

## 6) Dijital Menü İş Kuralları

### 6.1 Kategori & Ürün
- Kategori: ad, sıralama, aktif/pasif
- Ürün: ad, açıklama, kategori, fiyat, stokAdedi, foto (opsiyonel), aktif/pasif
- Varyant yok: tek ürün = tek fiyat

### 6.2 Stok
- Stok **adetli** (integer)
- MVP1’de stok düşümü **manuel** (admin ürün stok adetini günceller)
- MVP2’de POS ile satışlardan otomatik düşecek

### 6.3 Fiyatlandırma
- Vergi/KDV ayrıştırması yok; admin “etiket fiyatı” girer, sitede o görünür.

---

## 7) Veri Modeli (Prisma / PostgreSQL)

> Not: Mevcut projede Table/Reservation/ClosedDate var. MVP1 revizesiyle alan (Camekan/Salon), servis tipi ve menü tabloları eklenir; ayrıca rezervasyon kuralı “hafta sonu” olmaktan çıkar, haftanın her gününe açılır.

### 7.1 Yeni / Güncellenecek Modeller (öneri)

**Area**
- `id`
- `name` (Camekan | Salon)
- `isActive`
- `sortOrder`

**Table** (güncelleme)
- `id`
- `areaId` (FK)
- `name`
- `isActive`

**Reservation** (güncelleme)
- `serviceType` enum: `BREAKFAST`, `CAFE`
- `date` (@db.Date)
- `time` (HH:mm)
- `tableId`
- `partySize` (1–4)
- `fullName`, `phone`
- `tcknEncrypted`, `tcknLast4`
- `status` enum: `BOOKED`, `CANCELLED`
- `createdAt`, `updatedAt`
- `@@unique([date,time,tableId])`

**Settings** (yeni)
- `breakfastPricePerPerson` (varsayılan 350)
- (ileride) çalışma saatleri/slot ayarları, işletme bilgileri

**Category** (yeni)
- `id`, `name`, `sortOrder`, `isActive`

**Product** (yeni)
- `id`, `categoryId`
- `name`, `description?`
- `price` (int veya decimal yaklaşımı; MVP’de int yeterli)
- `stockQty` (int)
- `imageUrl?`
- `isActive`, `sortOrder`

### 7.2 Kapalı Günler
MVP1’de “kapalı gün” özelliği istenmedi (önceki projede vardı).  
Opsiyonel: Kapalı günler (resmi tatil vs.) admin paneline eklenebilir.

---

## 8) API Tasarımı (Route Handlers)

### 8.1 Public
**GET** `/api/availability`
- Query: `serviceType`, `date`, `time`, `areaId?`
- Response: `tables[]` (müsait masalar)

**POST** `/api/reservations`
- Body: `serviceType`, `date`, `time`, `areaId`, `tableId`, `partySize`, `fullName`, `phone`, `tckn`
- İş kuralları doğrulama:
  - saat penceresi + 30dk slot
  - partySize <= 4
  - masa aktif ve doğru alanda
  - unique constraint çakışması kontrol

### 8.2 Admin
**POST** `/api/admin/login`
- Body: `username`, `password`
- Output: httpOnly JWT cookie

**POST** `/api/admin/logout`
- Cookie temizleme

**Admin rezervasyon listeleme**
- MVP’de sayfa server-side query ile yapılabilir (`/admin/rezervasyonlar`)
- Opsiyonel API: `GET /api/admin/reservations?date&serviceType&areaId`

**Admin alan/masa yönetimi**
- `POST /api/admin/areas` (create/update)
- `POST /api/admin/tables` (create)
- `POST /api/admin/tables/[id]/toggle` (aktif/pasif)

**Admin menü yönetimi**
- `POST /api/admin/categories`
- `POST /api/admin/products`
- `POST /api/admin/products/[id]/toggle`
- `POST /api/admin/products/[id]/stock` (stok güncelle)

**Admin ayarlar**
- `POST /api/admin/settings` (breakfastPricePerPerson vs.)

---

## 9) Kimlik Doğrulama & Yetkilendirme

### 9.1 Admin oturum modeli
- Tek admin hesabı (env üzerinden)
- JWT (HS256) + httpOnly cookie
- `/admin/*` rotaları middleware ile korunur (login hariç)

### 9.2 Güvenlik önerileri (MVP1’de yapılması önerilir)
- Login rate limit (IP bazlı)
- Basit audit log (admin giriş denemeleri)
- Admin şifre politikasını dokümante etme (min uzunluk)

---

## 10) KVKK / PII Yaklaşımı (TCKN)
- TCKN form alanı zorunlu.
- DB’de şifreli (`tcknEncrypted`) saklanır; sadece `tcknLast4` plaintext.
- Şifreleme: AES-256-GCM, anahtar: `PII_ENCRYPTION_KEY` (32 byte base64).
- Öneri:
  - Saklama süresi politikasını netleştir (örn. 90 gün sonra otomatik silme/anonimleştirme)
  - Yetkili erişim kayıtları (audit log)

---

## 11) UI Tasarım Prensipleri (Clean White)
- Ferah beyaz zemin, güçlü tipografi hiyerarşisi
- Fotoğraf/video kalite odaklı (hero’da video veya büyük mekan fotoğrafı)
- CTA’lar net: “Rezervasyon Yap”, “Menüyü Gör”, “Yol Tarifi”
- Menüde kategori sekmeleri + arama (opsiyonel)
- Admin panelde mobil kullanım: “Bugün”, “Yarın”, “Filtrele” hızlı aksiyonlar

---

## 12) Başarı Kriterleri (Acceptance Criteria)
1. Public sitede dijital menü kategori bazlı listelenir, ürünler fiyatıyla görünür.
2. Rezervasyon:
   - Hizmet türü seçimine göre saat listesi doğru gelir
   - Camekan/Salon alanına göre uygun masalar listelenir
   - Aynı masa + aynı slot için ikinci rezervasyon engellenir
   - Kişi sayısı 1–4 aralığında sınırlandırılır
   - TCKN şifreli saklanır; admin sadece son 4 haneyi görür
3. Admin:
   - Mobilde çalışır (responsive)
   - Rezervasyonlar listelenir, filtrelenir
   - Alan/masa ekleme ve aktif/pasif yönetimi yapılır
   - Kahvaltı kişi başı ücret admin’den değişir
   - Kategori/ürün/stok/fiyat yönetimi yapılır

---

## 13) Yayına Alma Planı (kahvaltikonagi.com)
MVP1:
1. Vercel’e deploy + Postgres bağlama (Vercel Postgres veya harici)
2. Env değişkenleri:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD_HASH`
   - `PII_ENCRYPTION_KEY`
3. Prisma migrate + seed (varsayılan alanlar/masalar)
4. Domain: `kahvaltikonagi.com` Vercel’e bağlanır (DNS yönlendirme)

---

## 14) Açık Noktalar (TBD değil; karar gerektiren maddeler)
Bu MVP1 tasarımında kararlar netleştirildi. Uygulama sırasında ihtiyaç doğarsa aşağıdaki konular genişletilebilir:
- Kapalı günler / özel gün çalışma saati
- SMS/WhatsApp bildirimleri
- POS (MVP2)
