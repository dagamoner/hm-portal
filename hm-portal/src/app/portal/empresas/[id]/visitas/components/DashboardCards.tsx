import React from 'react';
import { ClipboardCheck, AlertCircle, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DashboardCards({ visits, findings }: { visits: any[], findings: any[] }) {
  const activeFindings = findings.filter(f => f.status !== 'CERRADO');
  const criticalFindings = activeFindings.filter(f => f.hazardLevel === 'Alto' || f.hazardLevel === 'Crítico');
  const thisMonthVisits = visits.filter(v => {
    const d = new Date(v.date);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 text-slate-500 mb-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold">Total Visitas</span>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-3xl font-black text-slate-800">{visits.length}</span>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
            +{thisMonthVisits.length} este mes
          </span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 text-slate-500 mb-2">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold">Desvíos Activos</span>
        </div>
        <div className="mt-auto">
          <span className="text-3xl font-black text-slate-800">{activeFindings.length}</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 text-slate-500 mb-2">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold">Riesgo Alto</span>
        </div>
        <div className="mt-auto flex items-end justify-between">
          <span className="text-3xl font-black text-slate-800">{criticalFindings.length}</span>
          <span className="text-xs font-medium text-slate-400">Requieren acción inmediata</span>
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
        <div className="flex items-center gap-3 text-slate-500 mb-2">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold">Desvíos Resueltos</span>
        </div>
        <div className="mt-auto flex items-end gap-2">
          <span className="text-3xl font-black text-slate-800">
            {findings.filter(f => f.status === 'CERRADO').length}
          </span>
          <span className="text-sm text-slate-400 font-medium mb-1">
            / {findings.length}
          </span>
        </div>
      </div>
    </div>
  );
}
