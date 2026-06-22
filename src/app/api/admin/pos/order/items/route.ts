import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit-logger";

export const runtime = "nodejs";

// Tek bir ürün satırını yönetir: ekle (+1), azalt (-1) veya tam adet/silme.
// Aynı üründen tek satır tutulur (merge edilir) ve sipariş toplamı her
// işlemde sıfırdan yeniden hesaplanır (artımlı drift olmaması için).
const LineSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
  delta: z.coerce.number().int().optional(),
  setQty: z.coerce.number().int().min(0).optional(),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = LineSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId, productId, delta, setQty, note } = parsed.data;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
      if (!order || order.status !== "OPEN") {
        throw new Error("Sipariş bulunamadı veya zaten kapalı.");
      }

      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product || !product.isActive) {
        throw new Error("Ürün bulunamadı veya pasif.");
      }

      const existing = order.items.find((it) => it.productId === productId);
      const targetQty = setQty != null ? setQty : (existing?.quantity ?? 0) + (delta ?? 1);

      if (targetQty <= 0) {
        if (existing) await tx.orderItem.delete({ where: { id: existing.id } });
      } else if (existing) {
        await tx.orderItem.update({ where: { id: existing.id }, data: { quantity: targetQty } });
      } else {
        await tx.orderItem.create({
          data: { orderId, productId, quantity: targetQty, priceCents: product.priceCents ?? 0, note: note || null },
        });
      }

      // Toplamı sıfırdan hesapla
      const items = await tx.orderItem.findMany({ where: { orderId } });
      const total = items.reduce((acc, it) => acc + it.priceCents * it.quantity, 0);

      return tx.order.update({
        where: { id: orderId },
        data: { totalAmount: total },
        include: { items: { include: { product: true } }, payments: true },
      });
    });

    await logAudit("ORDER", orderId, "UPDATE", { productId, delta, setQty, newTotal: updated.totalAmount }, "ADMIN");
    return NextResponse.json({ ok: true, data: updated });
  } catch (error: any) {
    console.error("Order line error:", error);
    return NextResponse.json({ ok: false, error: error.message || "Sipariş güncellenirken hata oluştu." }, { status: 400 });
  }
}
