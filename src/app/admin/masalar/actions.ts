"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function addTable(data: { name: string; areaId: string; isActive?: boolean }) {
  try {
    await prisma.table.create({
      data: {
        name: data.name,
        areaId: data.areaId,
        isActive: data.isActive ?? true,
      },
    });
    revalidatePath("/admin/masalar");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu masa adı bu alanda zaten mevcut." };
    }
    return { success: false, error: "Masa eklenirken bir hata oluştu." };
  }
}

export async function updateTable(id: string, data: { name?: string; areaId?: string; isActive?: boolean }) {
  try {
    await prisma.table.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/masalar");
    return { success: true };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { success: false, error: "Bu masa adı bu alanda zaten mevcut." };
    }
    return { success: false, error: "Masa güncellenirken bir hata oluştu." };
  }
}

export async function deleteTable(id: string) {
  try {
    // Optionally check if reservations exist
    const reservationsCount = await prisma.reservation.count({ where: { tableId: id } });
    if (reservationsCount > 0) {
      return { success: false, error: "Bu masaya ait rezervasyonlar var. Önce rezervasyonları iptal edin veya silin." };
    }

    await prisma.table.delete({
      where: { id },
    });
    revalidatePath("/admin/masalar");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Masa silinirken bir hata oluştu." };
  }
}
