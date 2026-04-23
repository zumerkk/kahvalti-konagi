# Kahvaltı Konağı — Website + Rezervasyon Sistemi (MVP1)

Modern Next.js (App Router) tabanlı tanıtım sitesi + **menü** + **online rezervasyon** + **admin paneli**.

## MVP1 Özellikler
- **Tanıtım sitesi**: modern, hızlı, mobil uyumlu
- **Menü sayfası**: `/menu` (kategoriler + ürünler)
- **Rezervasyon** (`/rezervasyon`):
  - Servis tipi seçimi:
    - `BREAKFAST` → **08:00–14:00**
    - `CAFE` → **14:00–23:00**
  - **30 dk slot** (örn. 08:00, 08:30, ...)
  - **Alan (area) seçimi**: `Camekan (CAMEKAN)` / `Salon (SALON)`
  - **Masa seçimi**: seçilen alanın aktif masaları
  - Maksimum kişi sayısı: **4** (`partySize`)
  - Rezervasyonu yapan kişiden: **Ad Soyad + Telefon + TCKN** (TCKN sistemde **şifreli** saklanır)
  - **Kahvaltı kişi başı fiyatı** ayarlanabilir (`breakfastPricePerPerson`) ve kahvaltı rezervasyonunda **toplam tutar** otomatik hesaplanır
- **Admin paneli**:
  - Giriş: kullanıcı adı + şifre (`/admin/login`)
  - Dashboard: `/admin`
  - Rezervasyonlar: `/admin/rezervasyonlar` (filtreleme + iptal)
  - Menü yönetimi: `/admin/menu/*` (kategoriler/ürünler)
  - Kapalı gün yönetimi: `/admin/kapali-gunler`
  - Masa yönetimi: `/admin/masalar`

## Rotalar
### Public
- `/` tanıtım
- `/menu` menü
- `/rezervasyon` rezervasyon formu

### Admin (UI)
- `/admin/login`
- `/admin`
- `/admin/rezervasyonlar`
- `/admin/menu/kategoriler`
- `/admin/menu/urunler`
- `/admin/kapali-gunler`
- `/admin/masalar`

## API (MVP1)
### Public
- `GET /api/settings` → `{ breakfastPricePerPerson }`
- `GET /api/areas` → aktif alanlar (Camekan/Salon)
- `GET /api/availability?serviceType=...&date=YYYY-MM-DD&time=HH:mm&areaId=...` → uygun masalar

### Admin
- `GET/POST /api/admin/settings` → kahvaltı kişi başı fiyatı yönetimi
- `GET /api/admin/reservations` → rezervasyon listesi (query: `date`, `serviceType`, `areaId`, `status`, `tableId`)
- `POST /api/admin/reservations/:id/cancel` → rezervasyon iptali (`/api/admin/reservations/[id]/cancel`)

## Veri modeli notları (MVP1)
- `ServiceType`: `BREAKFAST` / `CAFE`
- `Area`: `CAMEKAN` / `SALON` (masalar alana bağlıdır)
- `Product` alanları:
  - `priceCents` (**opsiyonel**): kuruş cinsinden (örn. `1990 = 19,90₺`), sabit fiyatlı ürünlerde `null` olabilir
  - `stockQty`: stok adedi
  - `imageUrl` (**opsiyonel**): ürün görseli URL’i

## Kurulum (lokal)

### 1) Bağımlılıklar
```bash
npm install
```

### 2) Postgres (Docker opsiyonel)
Bu repoda `docker-compose.yml` mevcut. Docker/Compose erişiminiz varsa:
```bash
npm run db:up
```

> Not: Docker her ortamda mevcut olmayabilir. Docker kullanamıyorsanız; lokal Postgres kurabilir veya Vercel Postgres/Neon/Supabase gibi bir Postgres sağlayıcısı kullanıp `DATABASE_URL`’i ona göre ayarlayabilirsiniz.

Örnek lokal bağlantı:
`postgres://postgres:postgres@localhost:5432/kahvalti_konagi?schema=public`

### 3) Ortam değişkenleri
`.env` dosyasını düzenleyin:

- `DATABASE_URL` : Postgres bağlantısı
- `AUTH_SECRET` : uzun rastgele string
- `ADMIN_USERNAME` : admin kullanıcı adı
- `ADMIN_PASSWORD_HASH` : bcrypt hash
- `PII_ENCRYPTION_KEY` : 32 byte **base64** anahtar (AES-256-GCM için)

Hash ve anahtar üretmek için örnek:
```bash
node -e "console.log(require('bcryptjs').hashSync('SIFRENIZ', 10))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 4) Prisma generate + migrate + seed
```bash
npx prisma generate
npm run db:migrate
npm run db:seed
```

### 5) Çalıştırma
```bash
npm run dev
```

## Deployment (Vercel + Postgres)
1) Repo’yu Vercel’e import edin
2) Vercel Postgres (veya harici Postgres) bağlayın ve `DATABASE_URL` env’i ekleyin
3) Env değişkenlerini Vercel’de ekleyin: `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `PII_ENCRYPTION_KEY`
4) Deploy sonrası migrate:
   - `DATABASE_URL=... npx prisma migrate deploy`

## Notlar / Güvenlik
- TCKN **KVKK açısından hassas veri**: sistemde **şifreli** saklanır (`PII_ENCRYPTION_KEY`).
- Admin cookie httpOnly’dir ve `AUTH_SECRET` ile imzalanır.
