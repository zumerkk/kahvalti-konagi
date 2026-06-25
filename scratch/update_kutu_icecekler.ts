import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const imageUrl = "/media/kutu_icecekler.jpg";
  
  const updated = await prisma.product.updateMany({
    where: { name: "Kapalı Kutu İçecek" },
    data: { imageUrl }
  });

  console.log(`✅ Kapalı Kutu İçecek güncellendi: ${updated.count}`);
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
