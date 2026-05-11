"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addProduct(data: {
  name: string;
  categoryId: string;
  description?: string;
  priceCents?: number;
  stockQty: number;
  isActive: boolean;
}) {
  try {
    await prisma.product.create({
      data: {
        name: data.name,
        categoryId: data.categoryId,
        description: data.description || null,
        priceCents: data.priceCents || null,
        stockQty: data.stockQty,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/menu/urunler");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Ürün eklenirken bir hata oluştu." };
  }
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    categoryId?: string;
    description?: string;
    priceCents?: number;
    stockQty?: number;
    isActive?: boolean;
  }
) {
  try {
    await prisma.product.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/menu/urunler");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Ürün güncellenirken bir hata oluştu." };
  }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    revalidatePath("/admin/menu/urunler");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Ürün silinirken bir hata oluştu." };
  }
}
