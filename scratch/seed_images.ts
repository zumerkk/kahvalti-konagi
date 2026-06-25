import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const productImages = {
  "Patates Kızartması Large ": "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&q=80",
  "Patates Kızartması Medium": "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&q=80",
  "Sigara Böreği": "https://images.unsplash.com/photo-1606337321936-a1118128912e?w=800&q=80",
  "Paket Peynir": "https://images.unsplash.com/photo-1485962398705-eb6a70c0c533?w=800&q=80",
  "Paket Reçel": "https://images.unsplash.com/photo-1585235889650-618a800ceb77?w=800&q=80",
  "İçli Çörek": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
  "Gözleme": "https://images.unsplash.com/photo-1627443183570-5cb524f0aeb4?w=800&q=80",
  "Pişi": "https://images.unsplash.com/photo-1541525997-6a10065bb897?w=800&q=80",
  "Sucuklu Yumurta Medium": "https://images.unsplash.com/photo-1525351484163-e41828f5c09a?w=800&q=80",
  "Sucuklu Yumurta Large": "https://images.unsplash.com/photo-1525351484163-e41828f5c09a?w=800&q=80",
  "Menemen Medium": "https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=800&q=80",
  "DomSa Söğüş (Tek Kişi)": "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80",
  "Ekstra Haşlanmış Yumurta": "https://images.unsplash.com/photo-1482049360996-9f60827ea0b5?w=800&q=80",
  "Kapalı Kutu İçecek": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
  "Limonata": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
  "Portakal Suyu": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
  "Nescafe": "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80",
  "Türk Kahvesi": "https://images.unsplash.com/photo-1544062483-e18e8d890d96?w=800&q=80",
  "Çay": "https://images.unsplash.com/photo-1560946258-294c77c68b75?w=800&q=80",
  "Su": "https://images.unsplash.com/photo-1548839140-392e9e719ebc?w=800&q=80",
  "Latte Çeşitleri": "https://images.unsplash.com/photo-1511920170024-5b5010b9338b?w=800&q=80",
  "Karışık İkramlık Tabak": "https://images.unsplash.com/photo-1519984388953-d2502800a0f1?w=800&q=80",
  "Ekler (Tane)": "https://images.unsplash.com/photo-1612203985729-7072a451f644?w=800&q=80",
  "Kahvoo Special Medium": "https://images.unsplash.com/photo-1551024601-bec66bea7040?w=800&q=80",
  "Kahvoo Special Large": "https://images.unsplash.com/photo-1551024601-bec66bea7040?w=800&q=80",
  "İzmr Bomba (Tane)": "https://images.unsplash.com/photo-1607958996333-41aef7caefd5?w=800&q=80"
};

async function main() {
  console.log("📸 Ürünlere görsel ekleniyor...");

  for (const [name, imageUrl] of Object.entries(productImages)) {
    const updated = await prisma.product.updateMany({
      where: { name },
      data: { imageUrl }
    });
    if (updated.count > 0) {
      console.log(`✅ ${name} güncellendi.`);
    } else {
      console.log(`❌ ${name} bulunamadı.`);
    }
  }

  console.log("✨ Tüm görseller başarıyla eklendi!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
