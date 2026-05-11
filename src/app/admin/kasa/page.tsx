import { prisma } from "@/lib/prisma";
import KasaClient from "./KasaClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function KasaPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true }
  });

  const tables = await prisma.table.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  });

  return <KasaClient initialProducts={products} categories={categories} tables={tables} />;
}
