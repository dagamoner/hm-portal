import { getAuditLogs } from "@/app/actions/auditoria";
import AuditClient from "./AuditClient";

export default async function AuditLogPage({ searchParams }: { searchParams: Promise<{ period?: string }> }) {
  const { period } = await searchParams;
  const timeRange = period || 'today';
  
  const initialLogs = await getAuditLogs(timeRange);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Log de Auditoría</h1>
          <p className="text-slate-500 text-sm mt-1">Trazabilidad, seguridad y responsabilidad sobre todas las acciones.</p>
        </div>
      </div>
      
      <AuditClient initialLogs={initialLogs} currentTimeRange={timeRange} />
    </div>
  );
}
