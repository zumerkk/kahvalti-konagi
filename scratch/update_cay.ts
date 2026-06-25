import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/cay.jpg";
  
  // Find products matching "Çay"
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: "Çay", mode: "insensitive" } },
        { name: { contains: "Cay", mode: "insensitive" } }
      ]
    }
  });

  console.log(`Bulunan Çay ürünleri:`, products.map(p => p.name));

  const updated = await prisma.product.updateMany({
    where: {
      OR: [
        { name: { contains: "Çay", mode: "insensitive" } },
        { name: { contains: "Cay", mode: "insensitive" } }
      ]
    },
    data: { imageUrl }
  });

  console.log(`✅ Çay ürünleri güncellendi: ${updated.count}`);
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
