import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/latte_cesitleri.jpg";
  
  // Find products matching "Latte"
  const products = await prisma.product.findMany({
    where: {
      name: { contains: "Latte", mode: "insensitive" }
    }
  });

  console.log(`Bulunan Latte ürünleri:`, products.map(p => p.name));

  const updated = await prisma.product.updateMany({
    where: {
      name: { contains: "Latte", mode: "insensitive" }
    },
    data: { imageUrl }
  });

  console.log(`✅ Latte ürünleri güncellendi: ${updated.count}`);
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
