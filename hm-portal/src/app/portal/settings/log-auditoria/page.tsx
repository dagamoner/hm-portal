import { getAuditLogs } from "@/app/actions/auditoria";
import { getUsersWithAuditStats } from "@/app/actions/users";
import AuditClient from "./AuditClient";
import UsersActivityClient from "./UsersActivityClient";
import Link from "next/link";
import { FileText, Users } from "lucide-react";

export default async function AuditLogPage({ searchParams }: { searchParams: Promise<{ period?: string, tab?: string }> }) {
  const { period, tab } = await searchParams;
  const timeRange = period || 'today';
  const activeTab = tab || 'bitacora';
  
  const initialLogs = activeTab === 'bitacora' ? await getAuditLogs(timeRange) : [];
  const enrichedUsers = activeTab === 'usuarios' ? await getUsersWithAuditStats() : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold mb-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            Acceso Restringido: Administradores y Gerentes
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Auditorías del sistema</h1>
          <p className="text-slate-500 text-sm mt-1">Trazabilidad, seguridad y estado de usuarios.</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50">
          <Link href="/portal/settings/log-auditoria?tab=bitacora" className={`flex items-center space-x-2 py-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'bitacora' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <FileText className="w-4 h-4" />
            <span>Bitácora Forense</span>
          </Link>
          <Link href="/portal/settings/log-auditoria?tab=usuarios" className={`flex items-center space-x-2 py-4 px-4 font-medium text-sm transition-colors border-b-2 ${activeTab === 'usuarios' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
            <Users className="w-4 h-4" />
            <span>Estado y Actividad de Usuarios</span>
          </Link>
        </div>
      </div>
      
      {activeTab === 'bitacora' && <AuditClient initialLogs={initialLogs} currentTimeRange={timeRange} />}
      {activeTab === 'usuarios' && <UsersActivityClient users={enrichedUsers} />}
    </div>
  );
}
