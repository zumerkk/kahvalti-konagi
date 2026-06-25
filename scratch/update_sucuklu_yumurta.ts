import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/sucuklu_yumurta.jpg";
  
  const updatedMedium = await prisma.product.updateMany({
    where: { name: "Sucuklu Yumurta Medium" },
    data: { imageUrl }
  });

  const updatedLarge = await prisma.product.updateMany({
    where: { name: "Sucuklu Yumurta Large" },
    data: { imageUrl }
  });

  console.log(`✅ Sucuklu Yumurta Medium güncellendi: ${updatedMedium.count}`);
  console.log(`✅ Sucuklu Yumurta Large güncellendi: ${updatedLarge.count}`);
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
