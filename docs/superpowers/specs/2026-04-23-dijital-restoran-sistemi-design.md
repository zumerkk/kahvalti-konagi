# Kahvaltı Konağı — Dijital Restoran Sistemi (MVP1) Tasarım Dokümanı

Tarih: 2026-04-23  
Durum: **Onaylandı (tasarım)**  
Hedef kitle: İş sahibi/müşteri + teknik ekip  

## 1) Özet
Bu doküman, Kahvaltı Konağı için “görünen yüzü” çok modern bir web sitesi olan; arka tarafta ise **rezervasyon + admin + dijital menü/ürün yönetimi** sunan, ileride POS/hızlı satış modülüne genişleyebilecek **dijital restoran sistemi** tasarımını tanımlar.

MVP1 hedefi:
- **Yeni web sitesi** (Clean White / ferah kurumsal)
- **Dijital menü** (kategori bazlı, ürün/fiyat/stok)
- **Haftanın her günü rezervasyon** (Kahvaltı veya Cafe&Bistro)
- **Mobil uyumlu admin panel** (rezervasyonlar + menü/ürün + masa/alan)

MVP2 (sonraki etap, bu dokümanın dışında): **Hızlı satış / POS** ve stokların otomatik düşmesi.

## 2) İş hedefleri ve çözdüğü problemler
### 2.1 İş hedefleri
- İşletmenin premium ve güven veren bir dijital vitrini olması
- Rezervasyonların tek yerden, kurallı şekilde alınması
- Cafe&Bistro ve kahvaltı hizmetlerinin aynı sistemde yönetilmesi
- Ürün/fiyat/stok değişikliklerinin admin tarafından anında yönetilebilmesi
- Mobilde hızlı şekilde “bugün kim var?” sorusuna cevap verebilen admin deneyimi

### 2.2 Çözdüğü problemler
- Telefon/DM üzerinden dağınık rezervasyon, çakışmalar, kapalı gün hataları
- Menü/fiyatların güncel tutulamaması
- İçerik (galeri/video) ve iletişim bilgilerinin profesyonel sunulamaması

## 3) Kapsam (MVP1)
### 3.1 Kullanıcı (müşteri) tarafı
**Web sitesi (Clean White):**
- Hero: “350₺ kişi başı sınırsız açık büfe kahvaltı” + “14:00 sonrası cafe & bistro”
- Galeri: foto + video
- İletişim: adres, telefon (tıkla-ara), yol tarifi (Google Maps)

**Dijital menü (kategori bazlı):**
- Kategori sekmeleri/filtre
- Ürün kartı: ad, açıklama (opsiyonel), fiyat, foto (opsiyonel), stok durumu (var/yok veya “tükendi” etiketi)
- Ürün varyantı yok (tek fiyat)
- Vergi/KDV alanları yok (etiket fiyat gösterilir)

**Rezervasyon:**
- Hizmet seçimi: **Kahvaltı** veya **Cafe&Bistro**
- Saat pencereleri:
  - Kahvaltı: **08:00–14:00**
  - Cafe&Bistro: **14:00–23:00**
- Slot: **30 dakika**
- Alan + masa seçimi: **Camekan** veya **Salon** + masa
- Kişi sayısı: 1–4 (tüm masalarda max 4)
- İstenen bilgiler: Ad Soyad, Telefon, **TCKN** (iki hizmette de zorunlu)
- Ödeme: mekânda (online ödeme yok)

### 3.2 Admin paneli (mobil uyumlu)
- Login (kullanıcı adı/şifre)
- Rezervasyonlar:
  - Bugün / tarih filtresi
  - Hizmet türü filtresi (Kahvaltı/Cafe)
  - Alan filtresi (Camekan/Salon)
  - Masa filtresi
  - Rezervasyon detayları (TCKN sadece son 4 hane)
- Alan & masa yönetimi:
  - Alan: Camekan/Salon (MVP1’de sabit iki alan; istenirse genişleyebilir)
  - Masa: admin istediği kadar ekler; aktif/pasif yapar; alanı seçer
  - Max kişi sayısı global 4 (masa bazlı kapasite yok)
- Menü yönetimi:
  - Kategori CRUD
  - Ürün CRUD: ad, açıklama, kategori, fiyat, stokAdet, aktif/pasif, foto (opsiyonel)
  - Stok güncelleme manuel
- Ayarlar:
  - Kahvaltı kişi başı fiyat: varsayılan **350₺**, admin tarafından değiştirilebilir

### 3.3 Kapsam dışı (MVP1)
- POS/hızlı satış ekranı
- Stok otomatik düşme
- Kampanya/fiyat takvimi (farklı günlerde farklı fiyat)
- Online ödeme / kapora
- SMS/WhatsApp bildirim entegrasyonu (opsiyonel MVP2/3)

## 4) Kullanıcı akışları (User Flows)
### 4.1 Rezervasyon akışı (müşteri)
1. Rezervasyon sayfasına girer
2. Hizmeti seçer: Kahvaltı / Cafe&Bistro
3. Tarih seçer (haftanın her günü)
4. Saat seçer (hizmete göre slotlar listelenir)
5. Alan seçer (Camekan/Salon)
6. Sistem “müsait masa” listesini getirir → müşteri masa seçer
7. Kişi sayısı (1–4) seçer
8. Ad Soyad, Telefon, TCKN girer
9. Kaydet → başarılı olursa rezervasyon kodu ve özet görüntülenir

### 4.2 Admin akışı
1. Admin login
2. Dashboard’da bugün/filtrelerle rezervasyonları görür
3. İhtiyaca göre:
   - Masa ekler/pasif yapar
   - Ürün ekler/fiyat ve stok günceller
   - Kahvaltı kişi başı fiyatı günceller

## 5) Bilgi mimarisi (IA) / Sayfalar
### 5.1 Site
- `/` Ana sayfa
- `/menu` Dijital menü (kategori bazlı)
- `/rezervasyon` Rezervasyon

### 5.2 Admin
- `/admin/login`
- `/admin` (Dashboard + rezervasyon listesi)
- `/admin/rezervasyonlar` (gelişmiş filtreler)
- `/admin/menü/kategoriler`
- `/admin/menü/urunler`
- `/admin/masalar` (alan + masa)
- `/admin/ayarlar` (fiyat vb.)

## 6) Veri modeli (Önerilen)
> Not: Mevcut projede `Table`, `Reservation`, `ClosedDate` var. MVP1 revizyonda `Area`, `Category`, `Product`, `Settings` eklenir; `Reservation` genişletilir.

### 6.1 Area (Alan)
- `id`
- `name`: enum veya string (`CAMEKAN`, `SALON`)
- `isActive`

### 6.2 Table (Masa)
- `id`
- `name` (örn: “C-1”, “S-3” veya “Masa 1”)
- `areaId` → Area
- `isActive`
- `createdAt`, `updatedAt`

### 6.3 Reservation
- `id`
- `serviceType`: enum (`BREAKFAST`, `CAFE`)
- `status`: enum (`BOOKED`, `CANCELLED`)
- `date`: `@db.Date`
- `time`: `HH:mm` string
- `areaId` (opsiyonel; normalize için) + `tableId`
- `partySize`: 1..4
- `fullName`
- `phone`
- `tcknEncrypted` (AES-256-GCM)
- `tcknLast4`
- `note?` (opsiyonel)
- `createdAt`, `updatedAt`
Kısıt:
- Unique: `(serviceType, date, time, tableId)` → aynı masada aynı slot çakışmaz

### 6.4 Category
- `id`
- `name` (örn: Kahvaltı Açık Büfe, Kahveler, Soğuk İçecekler, Tatlılar, Bistro)
- `sortOrder`
- `isActive`

### 6.5 Product
- `id`
- `categoryId`
- `name`
- `description?`
- `price` (etiket fiyat)
- `stockQty` (adet)
- `isActive`
- `imageUrl?` (opsiyonel)
- `sortOrder`

### 6.6 Settings
- `id` (singleton)
- `breakfastPricePerPerson` (default 350)
- ileride: çalışma saatleri, slot süresi, min harcama vb.

## 7) API tasarımı (Önerilen)
Mevcut endpoint yaklaşımı korunur (Next.js route handlers).

### 7.1 Public API
- `GET /api/availability`
  - input: `serviceType, date, time, areaId`
  - output: müsait masalar
- `POST /api/reservations`
  - input: `serviceType, date, time, areaId, tableId, partySize, fullName, phone, tckn, note?`

### 7.2 Admin API (auth required)
- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/reservations?date&serviceType&areaId&status`
- `POST /api/admin/reservations/:id/cancel`
- `GET/POST /api/admin/areas` (MVP1’de sabit olabilir; opsiyonel)
- `GET/POST /api/admin/tables` + `POST /api/admin/tables/:id/toggle`
- `GET/POST /api/admin/categories`
- `GET/POST /api/admin/products`
- `POST /api/admin/products/:id/stock` (stok güncelle)
- `GET/POST /api/admin/settings`

## 8) Yetkilendirme ve güvenlik
- Admin oturumu: httpOnly cookie + JWT (mevcut yapı devam)
- Admin route’ları middleware ile korunur
- Rezervasyon ve login uçlarına rate limit önerilir (MVP1 içinde yapılabilir)
- KVKK:
  - TCKN şifreli saklanır (AES-256-GCM)
  - Admin panelinde yalnızca son 4 hane gösterilir
  - Saklama süresi/politikası işletme süreçlerine göre ayrıca tanımlanmalı

## 9) UI Tasarım ilkeleri (Clean White)
- Açık zemin, güçlü tipografi hiyerarşisi
- Foto/video “hero” ve galeri alanlarında yüksek kalite
- Menüde kategori sekmeleri + hızlı arama (opsiyonel)
- Mobilde tek kolon, kolay scroll; admin panelde filtreler “drawer” şeklinde

## 10) Kabul kriterleri (Acceptance Criteria)
### Site
- Ana sayfada 350₺ açık büfe + 14:00 sonrası cafe/bistro net anlatılır
- Menü kategori bazlı listelenir; ürün fiyatları görünür; ürün pasif ise görünmez

### Rezervasyon
- Hizmet tipine göre saat aralığı değişir
- Camekan/Salon seçmeden masa listelenmez
- Aynı slot+masa çakışması engellenir
- Kişi sayısı 1–4 arasında zorlanır
- TCKN 11 hane zorunlu; DB’de şifreli saklanır; adminde ****1234 formatında görünür

### Admin
- Mobilde kullanılabilir (responsive)
- Rezervasyonlar filtrelenebilir (tarih, hizmet, alan)
- Ürün/kategori CRUD yapılabilir; stok adet güncellenebilir; kahvaltı fiyatı değiştirilebilir

## 11) Aşamalı teslim planı (öneri)
1. Veri modeli revizyonu + migrate
2. Clean White yeni UI + içerik sayfaları
3. Dijital menü + admin ürün/kategori
4. Rezervasyon revizyonu (serviceType + area + günlük)
5. Admin rezervasyon yönetimi
6. Prod deploy (kahvaltikonagi.com)

## 12) Açık noktalar (şimdilik bilinçli bırakıldı)
- POS/hızlı satış ekranı ve ödeme türleri MVP2
- Kampanya/fiyat takvimi MVP2/3
- Bildirim/SMS/WhatsApp entegrasyonu MVP2/3

