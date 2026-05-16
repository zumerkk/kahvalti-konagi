"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function addCategory(data: { name: string; description?: string; sortOrder: number }) {
  try {
    await prisma.category.create({
      data: {
        name: data.name,
        description: data.description || null,
        sortOrder: data.sortOrder,
      },
    });
    revalidatePath("/admin/menu/kategoriler");
    revalidatePath("/admin/menu/urunler");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "Bu kategori adı zaten mevcut." };
    }
    return { success: false, error: "Kategori eklenirken bir hata oluştu." };
  }
}

export async function updateCategory(id: string, data: { name: string; description?: string; sortOrder: number; isActive: boolean }) {
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });
    revalidatePath("/admin/menu/kategoriler");
    revalidatePath("/admin/menu/urunler");
    revalidatePath("/menu");
    return { success: true };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { success: false, error: "Bu kategori adı zaten mevcut." };
    }
    return { success: false, error: "Kategori güncellenirken bir hata oluştu." };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if there are products attached
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) {
      return { success: false, error: "Bu kategoriye ait ürünler var. Lütfen önce ürünleri silin veya taşıyın." };
    }

    await prisma.category.delete({
      where: { id },
    });
    revalidatePath("/admin/menu/kategoriler");
    revalidatePath("/admin/menu/urunler");
    revalidatePath("/menu");
    return { success: true };
  } catch {
    return { success: false, error: "Kategori silinirken bir hata oluştu." };
  }
}
