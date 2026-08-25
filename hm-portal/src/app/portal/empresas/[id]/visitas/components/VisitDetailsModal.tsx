import React from 'react';
import { X, Calendar, Building2, User, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const formatDate = (dateString: string | Date) => {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateString));
};

export default function VisitDetailsModal({ visit, onClose }: { visit: any, onClose: () => void }) {
  if (!visit) return null;

  const checklist = visit.checklistData?.categories || [];
  const findings = visit.findings || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
          <div>
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Detalle de Acta de Visita {visit.visitNumber ? `#${visit.visitNumber}` : ''}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Información de solo lectura
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
          
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 h-fit">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Establecimiento</p>
                <p className="font-bold text-slate-700 text-sm mt-0.5">{visit.establishment?.name || 'N/A'}</p>
                <p className="text-xs text-slate-500 line-clamp-1" title={visit.establishment?.address}>{visit.establishment?.address}</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 h-fit">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Visita</p>
                <p className="font-bold text-slate-700 text-sm mt-0.5">{formatDate(visit.date)}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-3">
              <div className="p-2 bg-sky-50 rounded-lg text-sky-600 h-fit">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inspector / Profesional</p>
                <p className="font-bold text-slate-700 text-sm mt-0.5">{visit.inspectorName || 'No especificado'}</p>
              </div>
            </div>
          </div>

          {/* Observations and Training */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                Observaciones Generales
              </h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {visit.observations || <span className="text-slate-400 italic">Sin observaciones</span>}
              </p>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                Capacitaciones Recomendadas
              </h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {visit.recommendedTrainings || <span className="text-slate-400 italic">Ninguna</span>}
              </p>
            </div>
          </div>

          {/* Checklist */}
          {checklist && checklist.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Check-list: {visit.checklistData?.templateName || 'Acta'}</h3>
              </div>
              <div className="p-0">
                {checklist.map((category: any, idx: number) => (
                  <div key={idx} className="border-b border-slate-100 last:border-0">
                    <div className="bg-slate-50/80 px-4 py-2 font-bold text-slate-700 text-xs uppercase">
                      {category.category || category.name}
                    </div>
                    <div className="divide-y divide-slate-50">
                      {category.items?.map((item: any, i: number) => {
                        const status = item.answer?.status;
                        const peligro = item.answer?.peligro;
                        
                        let statusBadge = <span className="text-slate-400 font-bold text-[10px]">N/A</span>;
                        if (status === 'SI' || status === 'OK' || status === 'C') {
                          statusBadge = <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold text-[10px]">CUMPLE</span>;
                        } else if (status === 'NO' || status === 'PENDIENTE' || status === 'NC') {
                          statusBadge = <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded font-bold text-[10px]">INCUMPLE</span>;
                        }

                        return (
                          <div key={i} className="p-3 px-4 flex flex-col md:flex-row md:items-start gap-4">
                            <div className="flex-1 text-sm text-slate-700">
                              {item.text || item.question}
                            </div>
                            <div className="flex md:flex-col items-center md:items-end gap-2 md:w-48 shrink-0">
                              {statusBadge}
                              {peligro && (
                                <p className="text-[11px] text-slate-500 italic mt-1 text-right">
                                  "{peligro}"
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Findings */}
          {findings && findings.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-rose-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Desvíos / Hallazgos Detectados ({findings.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {findings.map((f: any, i: number) => (
                  <div key={i} className="p-4 flex gap-3">
                    <div className="mt-0.5">
                      {f.status === 'CERRADO' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700 font-medium">{f.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          Riesgo: {f.hazardLevel || 'Medio'}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          f.status === 'CERRADO' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          f.status === 'EN_PROGRESO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {f.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
