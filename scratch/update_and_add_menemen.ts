import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Update Pişi
  const updatedPisi = await prisma.product.updateMany({
    where: { name: "Pişi" },
    data: { imageUrl: "/media/pisi.jpg" }
  });
  console.log(`✅ Pişi güncellendi: ${updatedPisi.count}`);

  // 2. Update Paket Reçel
  const updatedRecel = await prisma.product.updateMany({
    where: { name: "Paket Reçel" },
    data: { imageUrl: "/media/paket_recel.jpg" }
  });
  console.log(`✅ Paket Reçel güncellendi: ${updatedRecel.count}`);

  // 3. Find Menemen Medium category
  const menemenMedium = await prisma.product.findFirst({
    where: { name: "Menemen Medium" }
  });

  if (!menemenMedium) {
    console.error("❌ Menemen Medium bulunamadı!");
    return;
  }

  // Update Menemen Medium price and image
  await prisma.product.update({
    where: { id: menemenMedium.id },
    data: {
      priceCents: 9000,
      imageUrl: "/media/menemen.jpg"
    }
  });
  console.log("✅ Menemen Medium fiyatı 90₺ ve görseli güncellendi.");

  // Check if Menemen Large already exists
  const menemenLargeExists = await prisma.product.findFirst({
    where: { name: "Menemen Large" }
  });

  if (!menemenLargeExists) {
    // 4. Create Menemen Large in the same category
    const menemenLarge = await prisma.product.create({
      data: {
        name: "Menemen Large",
        priceCents: 18000,
        imageUrl: "/media/menemen.jpg",
        categoryId: menemenMedium.categoryId,
        description: menemenMedium.description // Optional description copy
      }
    });
    console.log(`✅ Menemen Large eklendi: ID=${menemenLarge.id}, Fiyat=180₺`);
  } else {
    // Update it if it exists
    await prisma.product.update({
      where: { id: menemenLargeExists.id },
      data: {
        priceCents: 18000,
        imageUrl: "/media/menemen.jpg",
        categoryId: menemenMedium.categoryId
      }
    });
    console.log("✅ Menemen Large zaten mevcuttu, güncellendi.");
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
