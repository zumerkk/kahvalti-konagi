#!/usr/bin/env bash
set -e

echo "🚀 Kahvaltı Konağı Production Deployment Script"

# 1. Ortam Değişkenleri Kontrolü
echo "🔍 Ortam değişkenleri kontrol ediliyor..."
if [ ! -f .env ] && [ ! -f .env.production ]; then
    echo "⚠️ Uyarı: .env dosyası bulunamadı. Vercel vb. bir ortamda iseniz bu adımı atlayabilirsiniz."
fi

# 2. Tip Kontrolleri ve Linting
echo "🧹 Linting ve TypeScript kontrolleri yapılıyor..."
npm run lint

# 3. Testlerin Çalıştırılması
echo "🧪 Birim ve Entegrasyon testleri çalıştırılıyor..."
npm run test:run

# 4. Veritabanı Migrasyonları
echo "📦 Veritabanı migrasyonları uygulanıyor..."
# Production'da prisma migrate deploy kullanılır.
npx prisma migrate deploy

# 5. Build İşlemi
echo "🏗️ Uygulama build ediliyor..."
npm run build

echo "✅ Tüm adımlar başarıyla tamamlandı. Uygulama production'a çıkmaya hazır!"
