import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const revalidate = 3600; // API Cache (1 hour)

export async function GET() {
  try {
    const s = await prisma.settings.findUnique({
      where: { id: "singleton" },
      select: {
        breakfastPricePerPerson: true,
        onlineReservationsActive: true,
        maxPartySize: true,
        minPartySize: true,
      },
    });
    if (!s) {
      // Varsayılan değerler dönelim
      return NextResponse.json({
        ok: true,
        settings: {
          breakfastPricePerPerson: 450,
          onlineReservationsActive: true,
          maxPartySize: 4,
          minPartySize: 1,
        },
      });
    }
    return NextResponse.json({ ok: true, settings: s });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: "Ayarlar yüklenemedi." },
      { status: 500 },
    );
  }
}
