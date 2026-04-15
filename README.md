# Kahvaltı Konağı — Website + Rezervasyon Sistemi

Modern Next.js (App Router) tabanlı tanıtım sitesi + **online rezervasyon** + **admin paneli**.

## Özellikler
- **Tanıtım sitesi**: modern, hızlı, mobil uyumlu
- **Rezervasyon**:
  - Sadece **hafta sonu** (Cumartesi/Pazar)
  - **08:00–14:00** arası, **30 dk slot**
  - **Masa seçimi** (aktif masalar)
  - Rezervasyonu yapan kişiden: **Ad Soyad + Telefon + TCKN** (TCKN sistemde **şifreli** saklanır)
- **Admin paneli**:
  - Giriş: kullanıcı adı + şifre
  - Rezervasyonları görüntüleme
  - **Kapalı gün** ekle/sil → rezervasyon ekranını anında etkiler
  - **Masa ekleme** ve **aktif/pasif** yapma → rezervasyon ekranını anında etkiler

## Kurulum (lokal)

### 1) Bağımlılıklar
```bash
npm install
```

### 2) Ortam değişkenleri
`.env` dosyasını düzenleyin:

- `DATABASE_URL` : Postgres bağlantısı (Vercel Postgres veya kendi Postgres’iniz)
- `AUTH_SECRET` : uzun rastgele string
- `ADMIN_USERNAME` : admin kullanıcı adı
- `ADMIN_PASSWORD_HASH` : bcrypt hash
- `PII_ENCRYPTION_KEY` : 32 byte **base64** anahtar (AES-256-GCM için)

Hash ve anahtar üretmek için örnek:
```bash
node -e "console.log(require('bcryptjs').hashSync('SIFRENIZ', 10))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

> Not: `AUTH_SECRET` için de uzun ve rastgele bir değer kullanın.

### 3) DB migrate + seed
DB hazır olduğunda:
```bash
npm run db:migrate
npm run db:seed
```

### 4) Çalıştırma
```bash
npm run dev
```
Ardından:
- Site: `/`
- Rezervasyon: `/rezervasyon`
- Admin: `/admin` (login: `/admin/login`)

## Deployment (Vercel + Postgres)
1) Repo’yu Vercel’e import edin
2) Vercel Postgres (veya harici Postgres) bağlayın ve `DATABASE_URL` env’i ekleyin
3) Env değişkenlerini Vercel’de ekleyin: `AUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `PII_ENCRYPTION_KEY`
4) Deploy sonrası Prisma migrate:
   - Vercel ortamında (CI) migrate için seçenekler vardır; en pratik yol:
     - Lokalden prod DB’ye migrate: `DATABASE_URL=... npx prisma migrate deploy`

## Notlar / Güvenlik
- TCKN **KVKK açısından hassas veri**: sistemde **şifreli** saklanır (`PII_ENCRYPTION_KEY`).
- Admin cookie httpOnly’dir ve `AUTH_SECRET` ile imzalanır.
