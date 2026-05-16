import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/auth";
import { logAudit } from "@/lib/audit-logger";

export const runtime = "nodejs";

const StatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "BOOKED",
    "CONFIRMED",
    "ARRIVED",
    "SEATED",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
    "POSTPONED",
    "DEPOSIT_PENDING",
    "DEPOSIT_RECEIVED",
  ]),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ ok: false, error: "Yetkisiz." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = StatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Durum geçersiz." }, { status: 400 });
  }

  const { id } = await params;

  try {
    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, status: true },
    });
    await logAudit(
      "RESERVATION",
      reservation.id,
      "STATUS_CHANGE",
      { status: reservation.status },
      "ADMIN",
    );
    revalidatePath("/admin/rezervasyonlar");
    return NextResponse.json({ ok: true, reservation });
  } catch {
    return NextResponse.json({ ok: false, error: "Rezervasyon bulunamadı." }, { status: 404 });
  }
}
