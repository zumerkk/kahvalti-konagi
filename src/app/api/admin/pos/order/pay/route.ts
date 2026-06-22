import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit-logger";

export const runtime = "nodejs";

const PaymentSchema = z.object({
  orderId: z.string().min(1),
  amountCents: z.number().int().min(1),
  method: z.enum(["CASH", "CREDIT_CARD", "IBAN", "OTHER"]),
});

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = PaymentSchema.safeParse(body);
  
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz veri", details: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId, amountCents, method } = parsed.data;

  try {
    const order = await prisma.order.findUnique({ 
      where: { id: orderId },
      include: { payments: true } 
    });
    
    if (!order || order.status !== "OPEN") {
      return NextResponse.json({ ok: false, error: "Sipariş bulunamadı veya zaten kapalı." }, { status: 400 });
    }

    const currentPaid = order.payments.reduce((acc, p) => acc + p.amountCents, 0);
    const newPaidTotal = currentPaid + amountCents;

    // Transaction: Ödeme al, eğer tamamı ödendiyse siparişi ve masayı kapat
    const result = await prisma.$transaction(async (tx) => {
      const payment = await tx.payment.create({
        data: {
          orderId,
          amountCents,
          method,
          status: "COMPLETED"
        }
      });

      let updatedOrder = order;
      if (newPaidTotal >= order.totalAmount) {
        // Tamamı ödendi -> Siparişi kapat, Rezervasyonu tamamlandı yap
        updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: { status: "CLOSED" },
          include: { payments: true }
        });

        if (order.reservationId) {
          await tx.reservation.update({
            where: { id: order.reservationId },
            data: { status: "COMPLETED" }
          });
        }
      }

      return { payment, updatedOrder, isFullyPaid: newPaidTotal >= order.totalAmount };
    });

    await logAudit("PAYMENT", result.payment.id, "CREATE", { orderId, amountCents, method }, "ADMIN");
    if (result.isFullyPaid && order.reservationId) {
      await logAudit("RESERVATION", order.reservationId, "STATUS_CHANGE", { status: "COMPLETED" }, "ADMIN");
    }

    return NextResponse.json({ ok: true, data: result });
  } catch (error: any) {
    console.error("Payment error:", error);
    return NextResponse.json({ ok: false, error: "Ödeme alınırken hata oluştu." }, { status: 500 });
  }
}
