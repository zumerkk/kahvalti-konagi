import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/nescafe.jpg";
  
  // Find products matching "Nescafe" or "Neskafe" (case insensitive)
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: "Nescafe", mode: "insensitive" } },
        { name: { contains: "Neskafe", mode: "insensitive" } }
      ]
    }
  });

  console.log(`Bulunan Nescafe ürünleri:`, products.map(p => p.name));

  const updated = await prisma.product.updateMany({
    where: {
      OR: [
        { name: { contains: "Nescafe", mode: "insensitive" } },
        { name: { contains: "Neskafe", mode: "insensitive" } }
      ]
    },
    data: { imageUrl }
  });

  console.log(`✅ Nescafe ürünleri güncellendi: ${updated.count}`);
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
