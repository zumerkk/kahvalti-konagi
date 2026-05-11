import Link from "next/link";
import { QrCode, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "./PrintButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminTablesQRPage() {
  const tables = await prisma.table.findMany({
    orderBy: { name: "asc" }
  });

  // In a real app, this should be an environment variable or the actual host URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="space-y-6">
      {/* Header (Hidden when printing) */}
      <div className="flex items-end justify-between print:hidden">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <QrCode className="h-6 w-6 text-sky-400" />
            Masa QR Kodları
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Masalara özel QR kodları yazdırıp masalara yerleştirebilirsiniz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/admin/masalar" 
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Print specific styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .qr-card {
            border: 2px solid #e5e7eb !important;
            background: white !important;
            page-break-inside: avoid;
            box-shadow: none !important;
            color: black !important;
          }
          .qr-name {
            color: black !important;
          }
          .qr-desc {
            color: #6b7280 !important;
          }
        }
      `}} />

      {/* QR Code Grid */}
      <div id="print-area" className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => {
          const menuUrl = `${baseUrl}/menu?table=${encodeURIComponent(t.name)}`;
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(menuUrl)}&margin=10`;

          return (
            <div 
              key={t.id}
              className="qr-card group flex flex-col items-center overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent p-6 text-center shadow-lg transition-all hover:border-sky-500/30"
            >
              <div className="mb-4 rounded-xl bg-white p-3 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={qrCodeUrl} 
                  alt={`${t.name} QR Kodu`} 
                  className="h-32 w-32 object-contain sm:h-40 sm:w-40"
                  crossOrigin="anonymous"
                />
              </div>
              <h2 className="qr-name text-xl font-bold tracking-tight text-white">{t.name}</h2>
              <p className="qr-desc mt-1 text-xs text-white/40">
                Menüyü görmek için okutun
              </p>
              
              {!t.isActive && (
                <span className="mt-3 inline-flex items-center rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-white/40 print:hidden">
                  Pasif Masa
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
