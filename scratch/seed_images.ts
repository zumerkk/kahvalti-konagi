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
  "Sigara Böreği": "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&q=80",
  "Paket Peynir": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&q=80",
  "Paket Reçel": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&q=80",
  "İçli Çörek": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80",
  "Gözleme": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&q=80",
  "Pişi": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=800&q=80",
  "Sucuklu Yumurta Medium": "https://images.unsplash.com/photo-1504387828636-abeb50778c0c?w=800&q=80",
  "Sucuklu Yumurta Large": "https://images.unsplash.com/photo-1504387828636-abeb50778c0c?w=800&q=80",
  "Menemen Medium": "https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=800&q=80",
  "DomSa Söğüş (Tek Kişi)": "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=800&q=80",
  "Ekstra Haşlanmış Yumurta": "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800&q=80",
  "Kapalı Kutu İçecek": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80",
  "Limonata": "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80",
  "Portakal Suyu": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80",
  "Nescafe": "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=800&q=80",
  "Türk Kahvesi": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
  "Çay": "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&q=80",
  "Su": "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=800&q=80",
  "Latte Çeşitleri": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=800&q=80",
  "Karışık İkramlık Tabak": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
  "Ekler (Tane)": "https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=800&q=80",
  "Kahvoo Special Medium": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80",
  "Kahvoo Special Large": "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&q=80",
  "İzmr Bomba (Tane)": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80"
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
