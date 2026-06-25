import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/su.jpg";
  
  // Find products matching exactly "Su" (or "Su ")
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: "Su" },
        { name: "Su " }
      ]
    }
  });

  console.log(`Bulunan Su ürünleri:`, products.map(p => p.name));

  const updated = await prisma.product.updateMany({
    where: {
      OR: [
        { name: "Su" },
        { name: "Su " }
      ]
    },
    data: { imageUrl }
  });

  console.log(`✅ Su ürünleri güncellendi: ${updated.count}`);
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
