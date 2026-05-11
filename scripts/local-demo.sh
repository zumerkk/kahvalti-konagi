#!/usr/bin/env bash
set -euo pipefail

# Kahvaltı Konağı MVP1 - Lokal Demo Kurulum & Çalıştırma
# Kullanım:
#   bash scripts/local-demo.sh
# Opsiyonel:
#   ADMIN_PASSWORD="Admin123!" bash scripts/local-demo.sh
#   ADMIN_USERNAME="admin" bash scripts/local-demo.sh
#   DATABASE_URL="postgresql://..." bash scripts/local-demo.sh

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f "package.json" ]]; then
  echo "Hata: Bu script proje kökünde çalıştırılmalı (package.json bulunamadı)."
  echo "İpucu: cd kahvalti-konagi && bash scripts/local-demo.sh"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "Hata: node bulunamadı. Node.js kurup tekrar deneyin."
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "Hata: npm bulunamadı. Node.js ile birlikte npm gelmelidir."
  exit 1
fi

echo "[1/6] Bağımlılıklar kontrol ediliyor..."
npm install

ADMIN_USERNAME="${ADMIN_USERNAME:-admin}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Admin123!}"
DATABASE_URL="${DATABASE_URL:-postgresql://postgres:postgres@localhost:5432/kahvalti_konagi?schema=public}"

echo "[2/6] .env oluşturuluyor (demo amaçlı)..."
ADMIN_PASSWORD_HASH="$(PW="$ADMIN_PASSWORD" node -e "console.log(require('bcryptjs').hashSync(process.env.PW, 10))")"
AUTH_SECRET="$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")"
PII_ENCRYPTION_KEY="$(node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")"

cat > .env <<EOF
DATABASE_URL="${DATABASE_URL}"

ADMIN_USERNAME="${ADMIN_USERNAME}"
ADMIN_PASSWORD_HASH="${ADMIN_PASSWORD_HASH}"

AUTH_SECRET="${AUTH_SECRET}"
PII_ENCRYPTION_KEY="${PII_ENCRYPTION_KEY}"
EOF

echo ""
echo "=== DEMO ADMIN BİLGİLERİ ==="
echo "Admin URL: http://localhost:3000/admin/login"
echo "Kullanıcı: ${ADMIN_USERNAME}"
echo "Şifre:     ${ADMIN_PASSWORD}"
echo "============================"
echo ""

echo "[3/6] Postgres başlatma (Docker varsa)..."
if command -v docker >/dev/null 2>&1; then
  # Docker Desktop açık olmalı
  docker compose up -d || true
else
  echo "Uyarı: docker bulunamadı. DATABASE_URL çalışır bir Postgres'e işaret etmeli."
fi

echo "[4/6] Prisma generate..."
npx prisma generate

echo "[5/6] Prisma migrate + seed..."
echo "Not: İlk çalıştırmada DB hazır değilse hata alabilirsiniz. Docker Desktop'ı açıp tekrar deneyin."
npx prisma migrate dev || true
npx prisma db seed || true

echo "[6/6] Uygulama başlatılıyor..."
echo "Site:   http://localhost:3000"
echo "Menü:   http://localhost:3000/menu"
echo "Rez.:   http://localhost:3000/rezervasyon"
echo "Admin:  http://localhost:3000/admin"
echo ""
npm run dev

