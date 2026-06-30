import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const products = await prisma.product.findMany({
    where: {
      name: { contains: "Açık Büfe", mode: "insensitive" }
    }
  });

  console.log("Bulunan Açık Büfe ürünleri:", products.map(p => p.name));

  if (products.length > 0) {
    const updated = await prisma.product.updateMany({
      where: {
        name: { contains: "Açık Büfe", mode: "insensitive" }
      },
      data: {
        name: "Sınırsız Açık Büfe (Kişi Başı)",
        imageUrl: "/media/sinirsiz_acik_bufe.jpg"
      }
    });
    console.log(`✅ Açık Büfe ürünleri güncellendi: ${updated.count}`);
  } else {
    console.log("❌ Açık Büfe içeren ürün bulunamadı!");
  }
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
