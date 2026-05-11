import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit-logger";

export const runtime = "nodejs";

const OrderItemSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
  quantity: z.number().int().min(1).default(1),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = OrderItemSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId, productId, quantity, note } = parsed.data;

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isActive) {
      return NextResponse.json({ ok: false, error: "Ürün bulunamadı veya pasif." }, { status: 404 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== "OPEN") {
      return NextResponse.json({ ok: false, error: "Sipariş bulunamadı veya zaten kapalı." }, { status: 400 });
    }

    const priceCents = product.priceCents || 0;
    const itemTotal = priceCents * quantity;

    // İşlemi transaction ile yapıp sipariş toplamını güncelle
    const result = await prisma.$transaction(async (tx) => {
      const orderItem = await tx.orderItem.create({
        data: {
          orderId,
          productId,
          quantity,
          priceCents,
          note,
        }
      });

      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          totalAmount: { increment: itemTotal }
        }
      });

      return { orderItem, updatedOrder };
    });

    await logAudit("ORDER_ITEM", result.orderItem.id, "CREATE", { orderId, productId, quantity, itemTotal }, "ADMIN");

    return NextResponse.json({ ok: true, data: result });
  } catch (error: any) {
    console.error("Order Item error:", error);
    return NextResponse.json({ ok: false, error: "Sipariş eklenirken hata oluştu." }, { status: 500 });
  }
}
