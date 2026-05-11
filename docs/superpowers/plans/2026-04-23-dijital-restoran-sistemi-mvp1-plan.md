# Dijital Restoran Sistemi (MVP1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Kahvaltı Konağı için Clean White yeni site + kategori bazlı dijital menü + (Kahvaltı/Cafe&Bistro) günlük rezervasyon + mobil uyumlu admin panel (ürün/fiyat/stok/masa/rezervasyon/ayarlar).

**Architecture:** Next.js App Router uygulaması; UI (app pages + components), API (route handlers), veri erişimi (Prisma + Postgres). İş kuralları `src/lib/*` içinde saf fonksiyonlar; API handler’lar bu fonksiyonları kullanarak DB okur/yazar.

**Tech Stack:** Next.js 16, React 19, TailwindCSS, Prisma ORM 7 + `@prisma/adapter-pg`, PostgreSQL, Zod, jose (JWT), bcryptjs, date-fns, Vitest (unit tests).

---

## 0) Ön Bilgi: Mevcut Proje Durumu
- Mevcut rezervasyon kuralı hafta sonu + 08:00–14:00 + 30dk slot.
- Admin: login + rezervasyon listesi + kapalı günler + masalar.
- TCKN AES-256-GCM ile şifreli saklanıyor.

MVP1 revizyonunda:
- Hafta sonu kuralı kalkacak, **haftanın her günü** rezervasyon olacak.
- Hizmet türü eklenecek: **BREAKFAST** veya **CAFE**.
- Alan eklenecek: **CAMEKAN / SALON**.
- Dijital menü eklenecek: kategori + ürün + stok.
- Kahvaltı fiyatı admin’den ayarlanacak (default 350).

---

## Dosya / Modül Haritası (Planlanan)

**Prisma**
- Modify: `prisma/schema.prisma` (Area, Category, Product, Settings; Reservation genişleme; Table area ilişkisi)
- Modify: `prisma/seed.ts` (Area seed + opsiyonel örnek tablolar)
- Run: `npx prisma migrate dev` / `npx prisma migrate deploy`

**Yeni iş kuralı modülleri**
- Create: `src/lib/services.ts` (enum’lar: serviceType, area)
- Create: `src/lib/time-slots.ts` (servise göre slot üretimi)
- Modify: `src/lib/reservation-rules.ts` (weekendOnly kalkacak; yeni validasyonlar)

**API**
- Modify: `src/app/api/availability/route.ts` (serviceType + area filtre)
- Modify: `src/app/api/reservations/route.ts` (serviceType, area, max 4, breakfast total)
- Create: `src/app/api/menu/categories/*` (admin CRUD)
- Create: `src/app/api/menu/products/*` (admin CRUD + stok update)
- Create: `src/app/api/admin/settings/route.ts` (kahvaltı fiyatı)
- Create: `src/app/api/admin/reservations/route.ts` (filtreli liste)
- Create: `src/app/api/admin/reservations/[id]/cancel/route.ts`

**UI**
- Create: `src/app/menu/page.tsx` (dijital menü)
- Modify: `src/app/page.tsx` (Clean White revizyon; içerik güncelleme)
- Modify: `src/app/rezervasyon/page.tsx` + `src/components/ReservationForm.tsx` (service/area/time)
- Modify: `src/app/admin/layout.tsx` (menü nav genişletme)
- Create: `src/app/admin/menu/kategoriler/page.tsx`, `src/app/admin/menu/urunler/page.tsx`, `src/app/admin/ayarlar/page.tsx`
- Modify: `src/app/admin/page.tsx` (dashboard + mobil)
- Modify: `src/app/admin/masalar/page.tsx` (area seçimiyle masa yönetimi)

**Test**
- Create: `vitest.config.ts`
- Create: `src/lib/time-slots.test.ts`
- Create: `src/lib/reservation-rules.test.ts`

---

## Task 1: Test altyapısı (Vitest) kur

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `src/lib/time-slots.test.ts` (dummy)

- [ ] **Step 1: Vitest bağımlılıklarını ekle**

Run:
```bash
npm i -D vitest @vitest/coverage-v8
```

- [ ] **Step 2: package.json scripts ekle**

`package.json` içine:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:cov": "vitest run --coverage"
  }
}
```

- [ ] **Step 3: vitest config oluştur**

`vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: İlk test dosyasıyla koş**

`src/lib/time-slots.test.ts`:
```ts
import { describe, expect, it } from "vitest";

describe("smoke", () => {
  it("runs", () => {
    expect(1).toBe(1);
  });
});
```

Run: `npm run test:run`  
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add package.json package-lock.json vitest.config.ts src/lib/time-slots.test.ts
git commit -m "test: add vitest"
```

---

## Task 2: Prisma şemasını MVP1’e revize et (Area/Menu/Settings)

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.ts`

- [ ] **Step 1: Mevcut şema için “mvp1” dalında migration başlat**
Run: `npx prisma migrate dev -n mvp1_core_models`
Expected: Prisma yeni migration klasörü oluşturur (dev DB gerekli).

- [ ] **Step 2: Şemayı güncelle (tam örnek)**

`prisma/schema.prisma` içinde aşağıdaki yapıya geç (var olanları güncelleyerek):
```prisma
enum ReservationStatus {
  BOOKED
  CANCELLED
}

enum ServiceType {
  BREAKFAST
  CAFE
}

enum AreaName {
  CAMEKAN
  SALON
}

model Area {
  id        String   @id @default(cuid())
  name      AreaName @unique
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tables    Table[]
}

model Table {
  id        String   @id @default(cuid())
  name      String
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  areaId    String
  area      Area     @relation(fields: [areaId], references: [id], onDelete: Restrict)

  reservations Reservation[]

  @@unique([areaId, name])
}

model Reservation {
  id            String            @id @default(cuid())
  status        ReservationStatus @default(BOOKED)
  serviceType   ServiceType

  date          DateTime          @db.Date
  time          String            // "HH:mm"

  areaId        String
  area          Area              @relation(fields: [areaId], references: [id], onDelete: Restrict)

  tableId       String
  table         Table             @relation(fields: [tableId], references: [id], onDelete: Restrict)

  partySize     Int
  fullName      String
  phone         String
  tcknEncrypted String
  tcknLast4     String
  note          String?

  // Breakfast için hesaplanan tutar; Cafe için null
  totalAmount   Int?

  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@unique([serviceType, date, time, tableId])
  @@index([serviceType, date, time])
  @@index([status])
}

model Category {
  id        String   @id @default(cuid())
  name      String
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  products  Product[]

  @@unique([name])
}

model Product {
  id          String   @id @default(cuid())
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)

  name        String
  description String?
  price       Int      // etiket fiyat (₺)
  stockQty    Int      @default(0)
  imageUrl    String?
  sortOrder   Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([categoryId])
  @@index([isActive])
}

model Settings {
  id                     String @id @default("singleton")
  breakfastPricePerPerson Int   @default(350)
  updatedAt              DateTime @updatedAt
}
```

- [ ] **Step 3: Migration’ı tamamla**
Run: `npx prisma migrate dev`
Expected: uygulanır, client generate edilir.

- [ ] **Step 4: Seed’i Area + (opsiyonel) başlangıç masa setiyle güncelle**

`prisma/seed.ts` örnek:
```ts
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // Settings singleton
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton", breakfastPricePerPerson: 350 },
  });

  const camekan = await prisma.area.upsert({
    where: { name: "CAMEKAN" },
    update: {},
    create: { name: "CAMEKAN" },
  });
  const salon = await prisma.area.upsert({
    where: { name: "SALON" },
    update: {},
    create: { name: "SALON" },
  });

  // Masalar admin ekleyecek; demo için 3'er adet ekleyelim (varsa dokunma)
  const count = await prisma.table.count();
  if (count === 0) {
    await prisma.table.createMany({
      data: [
        { name: "C-1", areaId: camekan.id },
        { name: "C-2", areaId: camekan.id },
        { name: "C-3", areaId: camekan.id },
        { name: "S-1", areaId: salon.id },
        { name: "S-2", areaId: salon.id },
        { name: "S-3", areaId: salon.id },
      ],
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

- [ ] **Step 5: Commit**
```bash
git add prisma/schema.prisma prisma/seed.ts
git commit -m "feat(db): add areas, menu models, settings; expand reservations"
```

---

## Task 3: Servis bazlı saat/slot üretimi (08-14 kahvaltı, 14-23 cafe)

**Files:**
- Create: `src/lib/services.ts`
- Create: `src/lib/time-slots.ts`
- Modify: `src/lib/reservation-rules.ts`
- Test: `src/lib/time-slots.test.ts` (gerçek testler)

- [ ] **Step 1: services enum’larını ekle**

`src/lib/services.ts`:
```ts
export type ServiceType = "BREAKFAST" | "CAFE";
export type AreaName = "CAMEKAN" | "SALON";
```

- [ ] **Step 2: time-slots modülünü yaz (minimal)**

`src/lib/time-slots.ts`:
```ts
import { addMinutes, format, parse } from "date-fns";
import type { ServiceType } from "@/lib/services";

export const SLOT_MINUTES = 30 as const;

export function serviceWindow(service: ServiceType) {
  return service === "BREAKFAST"
    ? { openFrom: "08:00", openTo: "14:00" }
    : { openFrom: "14:00", openTo: "23:00" };
}

export function getTimeSlots(service: ServiceType) {
  const { openFrom, openTo } = serviceWindow(service);
  const start = parse(openFrom, "HH:mm", new Date(0));
  const end = parse(openTo, "HH:mm", new Date(0));
  const slots: string[] = [];
  let cur = start;
  while (addMinutes(cur, SLOT_MINUTES) <= end) {
    slots.push(format(cur, "HH:mm"));
    cur = addMinutes(cur, SLOT_MINUTES);
  }
  return slots;
}

export function isAllowedTime(service: ServiceType, time: string) {
  return getTimeSlots(service).includes(time);
}
```

- [ ] **Step 3: reservation-rules hafta sonu kuralını kaldır**

`src/lib/reservation-rules.ts`:
- `isAllowedDate()` sadece tarih formatını kontrol edecek (her gün kabul).
- `getTimeSlots()` ve `isAllowedTime()` artık `time-slots.ts` üzerinden servis bazlı olacak.

- [ ] **Step 4: Testleri yaz**

`src/lib/time-slots.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { getTimeSlots, isAllowedTime } from "@/lib/time-slots";

describe("time slots", () => {
  it("breakfast slots include 08:00 and exclude 14:30", () => {
    const slots = getTimeSlots("BREAKFAST");
    expect(slots[0]).toBe("08:00");
    expect(isAllowedTime("BREAKFAST", "14:30")).toBe(false);
  });

  it("cafe slots include 14:00 and exclude 23:30", () => {
    const slots = getTimeSlots("CAFE");
    expect(slots[0]).toBe("14:00");
    expect(isAllowedTime("CAFE", "23:30")).toBe(false);
  });
});
```

Run: `npm run test:run`  
Expected: PASS

- [ ] **Step 5: Commit**
```bash
git add src/lib/services.ts src/lib/time-slots.ts src/lib/reservation-rules.ts src/lib/time-slots.test.ts
git commit -m "feat: service-based time windows and slots"
```

---

## Task 4: Availability API’yi service + area ile güncelle

**Files:**
- Modify: `src/app/api/availability/route.ts`

- [ ] **Step 1: Query param genişlet**
`GET /api/availability?serviceType=BREAKFAST|CAFE&date=YYYY-MM-DD&time=HH:mm&areaId=<id>`

- [ ] **Step 2: Validasyon**
- `serviceType` zorunlu
- `date/time` zorunlu
- `areaId` zorunlu
- `isAllowedTime(serviceType,time)` kontrolü

- [ ] **Step 3: DB sorgusu**
- `Table.findMany({ where: { isActive: true, areaId } })`
- `Reservation.findMany({ where: { serviceType, date, time, status:"BOOKED", table: { areaId } } })`
- Dolu tableId’leri düş

- [ ] **Step 4: Manuel smoke test**
Run:
```bash
curl "http://localhost:3000/api/availability?serviceType=BREAKFAST&date=2026-04-23&time=08:00&areaId=<camekanId>"
```
Expected: `{ ok:true, closed:false, tables:[...] }`

- [ ] **Step 5: Commit**
```bash
git add src/app/api/availability/route.ts
git commit -m "feat(api): availability by service and area"
```

---

## Task 5: Reservations API’yi service + area + breakfast total ile güncelle

**Files:**
- Modify: `src/app/api/reservations/route.ts`
- Modify/Create: `src/app/api/admin/settings/route.ts` (okuma/güncelle)

- [ ] **Step 1: Request body genişlet**
Body:
```json
{
  "serviceType":"BREAKFAST",
  "date":"YYYY-MM-DD",
  "time":"HH:mm",
  "areaId":"...",
  "tableId":"...",
  "fullName":"...",
  "phone":"...",
  "tckn":"12345678901",
  "partySize": 1,
  "note":""
}
```

- [ ] **Step 2: partySize max 4 kuralı**
Zod’da `.max(4)` + UI’da limit.

- [ ] **Step 3: Breakfast totalAmount hesapla**
- `settings.breakfastPricePerPerson` oku
- `totalAmount = partySize * breakfastPricePerPerson` sadece BREAKFAST için set et; CAFE için `null`.

- [ ] **Step 4: Commit**
```bash
git add src/app/api/reservations/route.ts src/app/api/admin/settings/route.ts
git commit -m "feat(api): reservations support service+area and breakfast pricing"
```

---

## Task 6: Dijital Menü (Category/Product) API + Admin ekranları

**Files:**
- Create: `src/app/api/admin/categories/route.ts`
- Create: `src/app/api/admin/products/route.ts`
- Create: `src/app/admin/menu/kategoriler/page.tsx`
- Create: `src/app/admin/menu/urunler/page.tsx`

- [ ] **Step 1: Admin API (CRUD)**
Minimum:
- `GET /api/admin/categories` → liste
- `POST /api/admin/categories` → create/update
- `GET /api/admin/products` → filtre: categoryId
- `POST /api/admin/products` → create/update (stockQty, price, isActive)

Not: Auth için mevcut `isAdminRequest()` kullanılacak.

- [ ] **Step 2: Admin UI**
- Kategoriler: liste + ekle + sıralama (sortOrder)
- Ürünler: filtre + ekle + stok güncelle

- [ ] **Step 3: Commit**
```bash
git add src/app/api/admin/categories src/app/api/admin/products src/app/admin/menu
git commit -m "feat(admin): menu categories/products management"
```

---

## Task 7: Public “/menu” sayfası (kategori bazlı)

**Files:**
- Create: `src/app/menu/page.tsx`
- Create: `src/app/api/menu/route.ts` (public read-only endpoint; veya server component ile prisma’dan doğrudan)

- [ ] **Step 1: Public veri erişimi kararı**
Öneri: Server Component doğrudan `prisma.category.findMany({ include:{products...}})` kullanır.

- [ ] **Step 2: UI**
- Kategori sekmeleri
- Ürün kartı: ad, açıklama, fiyat, foto (opsiyonel), stok (0 ise “Tükendi”)

- [ ] **Step 3: Commit**
```bash
git add src/app/menu
git commit -m "feat(site): add digital menu page"
```

---

## Task 8: Rezervasyon UI revizyonu (service + area + daily)

**Files:**
- Modify: `src/app/rezervasyon/page.tsx`
- Modify: `src/components/ReservationForm.tsx`

- [ ] **Step 1: UI adımları**
- Hizmet seçimi (BREAKFAST / CAFE)
- Tarih seçimi (her gün)
- Saat seçimi (servise göre slotlar)
- Alan seçimi (Camekan/Salon)
- Masa listesi (availability service+area)
- Kişi sayısı (1–4)
- Ad/Telefon/TCKN

- [ ] **Step 2: Kahvaltı toplam tutarı**
- BREAKFAST seçilince “Toplam: kişiSayısı * kahvaltı fiyatı” göster (fiyat API’den /settings veya public endpoint).

- [ ] **Step 3: Commit**
```bash
git add src/app/rezervasyon/page.tsx src/components/ReservationForm.tsx
git commit -m "feat(site): new reservation flow (service+area)"
```

---

## Task 9: Admin Rezervasyon ekranını mobil uyumlu ve filtreli yap

**Files:**
- Modify: `src/app/admin/page.tsx`
- Create: `src/app/admin/rezervasyonlar/page.tsx`
- Create: `src/app/api/admin/reservations/route.ts`

- [ ] **Step 1: API**
Query: `date`, `serviceType`, `areaId`, `status`

- [ ] **Step 2: UI**
- Mobilde card list view, desktop’ta table
- Filtre drawer (mobil)

- [ ] **Step 3: Cancel endpoint**
`POST /api/admin/reservations/:id/cancel` → status=CANCELLED

- [ ] **Step 4: Commit**
```bash
git add src/app/admin src/app/api/admin/reservations
git commit -m "feat(admin): mobile-friendly reservations with filters"
```

---

## Task 10: Clean White site revizyonu (landing)

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` (gerekirse)

- [ ] **Step 1: İçerik**
- 350₺ açık büfe
- 14:00 sonrası cafe & bistro (kahve + tatlı)
- CTA: Menü + Rezervasyon

- [ ] **Step 2: Commit**
```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "feat(site): clean white landing redesign"
```

---

## Task 11: Dokümantasyon güncelle

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Yeni env’ler ve migrate/seed adımları**
- Settings ve seed bilgisi
- Yeni rotalar

- [ ] **Step 2: Commit**
```bash
git add README.md
git commit -m "docs: update README for MVP1"
```

---

## Self‑Review (Plan Coverage)
- Spec 3.1/3.2/6/7/8/10 bölümleri: Task 2–10 kapsamına dağıtıldı.
- POS kapsam dışı: planın hiçbir yerinde POS/ödeme entegrasyonu yok.
- KVKK/TCKN: Task 5 ve mevcut crypto modülü ile devam ediyor.

## Execution Options
Plan complete and saved to `docs/superpowers/plans/2026-04-23-dijital-restoran-sistemi-mvp1-plan.md`.

İki seçenek:
1) **Subagent-Driven (recommended)** — her task için ayrı subagent, aralarda review  
2) **Inline Execution** — bu oturumda task task ilerleriz (checkpoints ile)

Hangisini istersiniz?

