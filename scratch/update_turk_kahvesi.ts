import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/turk_kahvesi.jpg";
  
  // Find products matching "Türk Kahvesi" (case insensitive)
  const products = await prisma.product.findMany({
    where: {
      name: { contains: "Türk Kahvesi", mode: "insensitive" }
    }
  });

  console.log(`Bulunan Türk Kahvesi ürünleri:`, products.map(p => p.name));

  const updated = await prisma.product.updateMany({
    where: {
      name: { contains: "Türk Kahvesi", mode: "insensitive" }
    },
    data: { imageUrl }
  });

  console.log(`✅ Türk Kahvesi ürünleri güncellendi: ${updated.count}`);
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
