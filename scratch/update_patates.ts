import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/patates_kizartmasi.jpg";
  
  const updatedLarge = await prisma.product.updateMany({
    where: { name: "Patates Kızartması Large " },
    data: { imageUrl }
  });

  const updatedMedium = await prisma.product.updateMany({
    where: { name: "Patates Kızartması Medium" },
    data: { imageUrl }
  });

  console.log(`✅ Patates Kızartması Large güncellendi: ${updatedLarge.count}`);
  console.log(`✅ Patates Kızartması Medium güncellendi: ${updatedMedium.count}`);
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
