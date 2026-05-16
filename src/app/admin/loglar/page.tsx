import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sistem Logları (Audit)</h1>
      
      <div className="bg-white rounded-xl shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Tarih</th>
              <th className="p-4 font-semibold text-slate-600">İşlem Yapan</th>
              <th className="p-4 font-semibold text-slate-600">Varlık</th>
              <th className="p-4 font-semibold text-slate-600">Aksiyon</th>
              <th className="p-4 font-semibold text-slate-600">Detaylar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-slate-500">Henüz log bulunmuyor.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-4 text-slate-500">{format(log.createdAt, "dd.MM.yyyy HH:mm:ss")}</td>
                  <td className="p-4 font-medium">{log.adminUser}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{log.entity}</span>
                    <div className="text-xs text-slate-400 mt-1">{log.entityId}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">{log.action}</td>
                  <td className="p-4 text-xs text-slate-600 max-w-xs truncate" title={log.details || ""}>
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
