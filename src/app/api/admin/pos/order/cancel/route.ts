import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit-logger";

export const runtime = "nodejs";

const CancelSchema = z.object({ orderId: z.string().min(1) });

export async function POST(req: Request) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Geçersiz veri" }, { status: 400 });
  }

  const { orderId } = parsed.data;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id: orderId }, include: { payments: true, reservation: true } });
      if (!order || order.status !== "OPEN") throw new Error("Sipariş bulunamadı veya zaten kapalı.");
      if (order.payments.length > 0) throw new Error("Ödemesi olan adisyon iptal edilemez.");

      await tx.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });

      // Walk-in misafir rezervasyonuysa onu da iptal et (masa boşalsın)
      if (order.reservation && order.reservation.source === "WALK_IN") {
        await tx.reservation.update({ where: { id: order.reservation.id }, data: { status: "CANCELLED" } });
      }
    });

    await logAudit("ORDER", orderId, "DELETE", { action: "CANCEL" }, "ADMIN");
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Order cancel error:", error);
    return NextResponse.json({ ok: false, error: error.message || "İptal başarısız." }, { status: 400 });
  }
}
