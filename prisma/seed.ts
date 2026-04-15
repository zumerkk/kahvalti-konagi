import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const existing = await prisma.table.count();
  if (existing > 0) return;

  await prisma.table.createMany({
    data: Array.from({ length: 12 }, (_, i) => ({
      name: `Masa ${i + 1}`,
      isActive: true,
    })),
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
