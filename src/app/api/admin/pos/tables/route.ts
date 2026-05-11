import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toDbDate } from "@/lib/reservation-rules";
import { format } from "date-fns";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Şimdiki tarihi al ve o güne ait rezervasyonları/siparişleri getir
  const now = new Date();
  const dateStr = format(now, "yyyy-MM-dd");
  const dbDate = toDbDate(dateStr);

  try {
    const areas = await prisma.area.findMany({
      where: { isActive: true },
      include: {
        tables: {
          where: { isActive: true },
          include: {
            reservations: {
              where: {
                date: dbDate,
                status: { in: ["PENDING", "CONFIRMED", "ARRIVED", "SEATED"] }
              },
              orderBy: { time: 'asc' }
            },
            orders: {
              where: {
                status: "OPEN"
              },
              include: {
                items: {
                  include: { product: true }
                },
                payments: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ ok: true, data: areas });
  } catch (error: any) {
    console.error("Tables fetch error:", error);
    return NextResponse.json({ ok: false, error: "Masalar yüklenirken hata oluştu." }, { status: 500 });
  }
}
