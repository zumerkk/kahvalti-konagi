import Link from "next/link";
import { Armchair, QrCode } from "lucide-react";
import { prisma } from "@/lib/prisma";
import TableClient from "./TableClient";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminTablesPage() {
  const tables = await prisma.table.findMany({
    orderBy: { name: "asc" },
    include: {
      area: {
        select: { title: true }
      }
    }
  });

  const areas = await prisma.area.findMany({
    orderBy: { title: "asc" },
    select: { id: true, title: true }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Armchair className="h-6 w-6 text-sky-400" />
            Masalar
          </h1>
        </div>
        <Link 
          href="/admin/masalar/qr" 
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500/20 to-sky-600/20 px-4 py-2.5 text-sm font-semibold text-sky-400 border border-sky-500/30 transition hover:bg-sky-500/30"
        >
          <QrCode className="h-4 w-4" />
          QR Kodları
        </Link>
      </div>

      <TableClient initialTables={tables} areas={areas} />
    </div>
  );
}
