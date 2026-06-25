import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Update Kahvoo Special Medium and Large
  const updatedSpecialMedium = await prisma.product.updateMany({
    where: { name: "Kahvoo Special Medium" },
    data: { imageUrl: "/media/kahvoo_special.jpg" }
  });
  const updatedSpecialLarge = await prisma.product.updateMany({
    where: { name: "Kahvoo Special Large" },
    data: { imageUrl: "/media/kahvoo_special.jpg" }
  });
  console.log(`✅ Kahvoo Special Medium güncellendi: ${updatedSpecialMedium.count}`);
  console.log(`✅ Kahvoo Special Large güncellendi: ${updatedSpecialLarge.count}`);

  // 2. Update Ekler (Tane)
  const updatedEkler = await prisma.product.updateMany({
    where: { name: "Ekler (Tane)" },
    data: { imageUrl: "/media/ekler.jpg" }
  });
  console.log(`✅ Ekler (Tane) güncellendi: ${updatedEkler.count}`);
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
