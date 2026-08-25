import React, { useState } from 'react';
import { updateFindingStatus, deleteFinding } from '@/app/actions/visits';
import { getStandardActions } from '@/app/actions/standard-actions';
import { AlertCircle, Calendar, CheckCircle2, MoreVertical, X, BookOpen } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

const formatDate = (dateString: string | Date) => {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateString));
};

export default function FindingsList({ findings, companyId, onUpdate }: { findings: any[], companyId: string, onUpdate: (f: any) => void }) {
  const { isClient } = useAuth();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [actionPlan, setActionPlan] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [library, setLibrary] = useState<any[]>([]);

  React.useEffect(() => {
    if (!isClient && companyId) {
      getStandardActions(companyId).then(setLibrary);
    }
  }, [companyId, isClient]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ABIERTO': return 'bg-rose-100 text-rose-700';
      case 'EN_PROGRESO': return 'bg-amber-100 text-amber-700';
      case 'CERRADO': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getHazardColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'alto':
      case 'crítico': return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'medio': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'bajo': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const handleUpdate = async (id: string, status: string, newActionPlan?: string) => {
    try {
      setIsUpdating(true);
      const updated = await updateFindingStatus(id, status, newActionPlan);
      onUpdate(updated);
      setEditingId(null);
    } catch (e) {
      alert("Error al actualizar el desvío");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Está seguro de que desea eliminar este desvío de forma permanente?')) return;
    try {
      setIsUpdating(true);
      await deleteFinding(id);
      onUpdate({ id, deleted: true });
    } catch (e) {
      alert("Error al eliminar el desvío");
    } finally {
      setIsUpdating(false);
    }
  };

  if (findings.length === 0) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No hay desvíos registrados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {findings.map(finding => (
        <div key={finding.id} className="border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-colors bg-white">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusColor(finding.status)}`}>
                  {finding.status}
                </span>
                {finding.hazardLevel && (
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border ${getHazardColor(finding.hazardLevel)}`}>
                    Riesgo: {finding.hazardLevel}
                  </span>
                )}
                {finding.visit?.establishment?.name && (
                  <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                    {finding.visit.establishment.name}
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-slate-800 mb-2">{finding.description}</p>
              
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Creado: {formatDate(finding.createdAt)}
                </div>
                {finding.deadline && (
                  <div className={`flex items-center gap-1 ${new Date(finding.deadline) < new Date() && finding.status !== 'CERRADO' ? 'text-rose-600 font-bold' : ''}`}>
                    <AlertCircle className="w-3 h-3" />
                    Vence: {formatDate(finding.deadline)}
                  </div>
                )}
                {finding.resolutionDate && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle2 className="w-3 h-3" />
                    Resuelto: {formatDate(finding.resolutionDate)}
                  </div>
                )}
              </div>

              {(finding.actionPlan || editingId === finding.id) && (
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <h5 className="text-xs font-bold text-slate-700 mb-1">Plan de Acción / Medidas:</h5>
                  {editingId === finding.id ? (
                    <div className="space-y-2 mt-2">
                      {library.length > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="w-4 h-4 text-slate-400" />
                          <select 
                            className="flex-1 text-xs bg-white border border-slate-200 rounded-md p-1.5 outline-none focus:border-indigo-400"
                            onChange={(e) => {
                              if(e.target.value) {
                                setActionPlan(prev => prev ? prev + '\n' + e.target.value : e.target.value);
                                e.target.value = '';
                              }
                            }}
                          >
                            <option value="">Seleccionar desde la Biblioteca...</option>
                            {library.map(l => (
                              <option key={l.id} value={l.description}>{l.title}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <textarea
                        className="w-full text-sm p-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                        rows={3}
                        value={actionPlan}
                        onChange={(e) => setActionPlan(e.target.value)}
                        placeholder="Describa las acciones correctivas..."
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                        >
                          Cancelar
                        </button>
                        <button 
                          onClick={() => handleUpdate(finding.id, finding.status, actionPlan)}
                          disabled={isUpdating}
                          className="px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg disabled:opacity-50"
                        >
                          Guardar Plan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{finding.actionPlan}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex md:flex-col items-center md:items-end justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 min-w-[140px]">
              {!isClient && finding.status !== 'CERRADO' && (
                <>
                  <button 
                    onClick={() => {
                      setActionPlan(finding.actionPlan || '');
                      setEditingId(finding.id);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg w-full text-center transition-colors"
                  >
                    Editar Acción
                  </button>
                  {finding.status === 'ABIERTO' && (
                    <button 
                      onClick={() => handleUpdate(finding.id, 'EN_PROGRESO')}
                      disabled={isUpdating}
                      className="text-xs font-bold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg w-full text-center transition-colors"
                    >
                      En Progreso
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (confirm('¿Marcar este desvío como resuelto?')) {
                        handleUpdate(finding.id, 'CERRADO');
                      }
                    }}
                    disabled={isUpdating}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg w-full text-center transition-colors"
                  >
                    Cerrar Desvío
                  </button>
                </>
              )}
              {!isClient && finding.status === 'CERRADO' && (
                <button 
                  onClick={() => {
                    if (confirm('¿Desea reabrir este desvío?')) {
                      handleUpdate(finding.id, 'EN_PROGRESO');
                    }
                  }}
                  disabled={isUpdating}
                  className="text-xs font-bold text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg w-full text-center transition-colors"
                >
                  Abrir Desvío
                </button>
              )}
              {!isClient && (
                <button 
                  onClick={() => handleDelete(finding.id)}
                  disabled={isUpdating}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg w-full text-center transition-colors"
                >
                  Borrar Desvío
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
