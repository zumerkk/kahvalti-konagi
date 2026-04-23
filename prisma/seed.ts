import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  // Temel veriler (her seed çalıştırmada garanti altına alınsın)
  const [camekan, salon] = await Promise.all([
    prisma.area.upsert({
      where: { code: "CAMEKAN" },
      update: { title: "Camekan", isActive: true },
      create: { code: "CAMEKAN", title: "Camekan", isActive: true },
    }),
    prisma.area.upsert({
      where: { code: "SALON" },
      update: { title: "Salon", isActive: true },
      create: { code: "SALON", title: "Salon", isActive: true },
    }),
  ]);

  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      reservationsEnabled: true,
      reservationStartTime: "08:00",
      reservationEndTime: "14:00",
      slotMinutes: 30,
      maxPartySize: 12,
    },
  });

  const existing = await prisma.table.count();
  if (existing > 0) return;

  await prisma.table.createMany({
    data: [
      ...Array.from({ length: 10 }, (_, i) => ({
        name: `Masa ${i + 1}`,
        isActive: true,
        areaId: salon.id,
      })),
      ...Array.from({ length: 2 }, (_, i) => ({
        name: `Camekan ${i + 1}`,
        isActive: true,
        areaId: camekan.id,
      })),
    ],
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
