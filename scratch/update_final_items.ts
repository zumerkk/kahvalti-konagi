import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Update Menemen Large stock
  const updatedMenemen = await prisma.product.updateMany({
    where: { name: "Menemen Large" },
    data: { stockQty: 999 }
  });
  console.log(`✅ Menemen Large stoğu güncellendi: ${updatedMenemen.count}`);

  // 2. Update DomSa Söğüş image
  const updatedDomsa = await prisma.product.updateMany({
    where: { name: { contains: "DomSa Söğüş" } },
    data: { imageUrl: "/media/domsa_sogus.jpg" }
  });
  console.log(`✅ DomSa Söğüş görseli güncellendi: ${updatedDomsa.count}`);

  // 3. Find and update İzmir Bomba
  const existingBomba = await prisma.product.findFirst({
    where: { name: { contains: "Bomba" } }
  });

  if (existingBomba) {
    const updatedBomba = await prisma.product.update({
      where: { id: existingBomba.id },
      data: {
        imageUrl: "/media/izmir_bomba.jpg",
        name: "İzmir Bomba (Tane)" // Ensure clean name spelling
      }
    });
    console.log(`✅ İzmir Bomba güncellendi: ${updatedBomba.name}`);
  } else {
    // If not exists, find a dessert category or create it under Cafe/Dessert category
    const category = await prisma.category.findFirst({
      where: { name: { contains: "Tatlı" } }
    }) || await prisma.category.findFirst();

    if (category) {
      const newBomba = await prisma.product.create({
        data: {
          name: "İzmir Bomba (Tane)",
          priceCents: 0, // Admin will set price
          imageUrl: "/media/izmir_bomba.jpg",
          categoryId: category.id,
          stockQty: 999
        }
      });
      console.log(`✅ İzmir Bomba sıfırdan eklendi: ${newBomba.name}`);
    } else {
      console.log("❌ Kategori bulunamadığından İzmir Bomba eklenemedi.");
    }
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
