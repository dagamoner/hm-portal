"use client";

import React, { useState } from 'react';
import { 
  GraduationCap, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Plus, 
  ExternalLink,
  ChevronRight,
  CalendarDays,
  FileText,
  Trash2,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { createTraining, deleteTraining } from '@/app/actions/trainings';
import { useAuth } from '@/components/providers/AuthProvider';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function CapacitacionesClient({ companyId, companyName, initialPlans, stats }: any) {
  const { isClient, isAdmin, isManager } = useAuth();
  const [plans, setPlans] = useState(initialPlans);
  const currentYear = new Date().getFullYear();
  const currentMonthIndex = new Date().getMonth() + 1; // 1-12
  
  const currentPlan = plans.find((p: any) => p.year === currentYear);
  const trainings = currentPlan?.trainings || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTraining, setNewTraining] = useState({
    title: '',
    description: '',
    monthIndex: currentMonthIndex,
    type: 'Operativo',
    priority: 'Obligatoria',
    externalLink: ''
  });

  const handleCreateTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!currentPlan) return;

    try {
      await createTraining(companyId, {
        planId: currentPlan.id,
        ...newTraining,
        monthIndex: parseInt(newTraining.monthIndex.toString())
      });
      setIsModalOpen(false);
      setNewTraining({
        title: '',
        description: '',
        monthIndex: currentMonthIndex,
        type: 'Operativo',
        priority: 'Obligatoria',
        externalLink: ''
      });
      window.location.reload(); // Quick refresh to get updated server data
    } catch (error) {
      alert("Error creando la capacitación");
    }
  };

  const handleDeleteTraining = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta capacitación?')) {
      try {
        await deleteTraining(id, companyId);
        window.location.reload();
      } catch (error) {
        alert("Error eliminando la capacitación");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Charlas de 5 Minutos Link */}
      <div className="flex justify-end mb-4">
        <Link 
          href={`/portal/empresas/${companyId}/capacitaciones/charlas`}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <Users className="w-5 h-5" />
          Registro Rápido en Campo (Charlas 5 Min)
        </Link>
      </div>

      {/* Dashboard KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <GraduationCap className="w-16 h-16" />
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1">Cumplimiento Global</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-slate-800">{stats?.compliancePercentage || 0}%</h3>
          </div>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${stats?.compliancePercentage >= 80 ? 'bg-green-500' : stats?.compliancePercentage >= 50 ? 'bg-yellow-500' : 'bg-rose-500'}`} 
              style={{ width: `${stats?.compliancePercentage || 0}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-bold text-slate-500 mb-1">Cursos Planificados</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-black text-slate-800">{stats?.totalTrainings || 0}</h3>
            <span className="text-sm font-medium text-slate-400 mb-1">en {currentYear}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm font-bold text-green-600">
            <CheckCircle2 className="w-4 h-4" /> {stats?.completedTrainings || 0} completados
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-rose-600 p-6 rounded-3xl shadow-sm text-white hover:shadow-md hover:shadow-rose-500/20 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-rose-100 mb-1">Alertas (Pendientes/Vencidas)</p>
              <h3 className="text-4xl font-black">{stats?.expiredAlerts || 0}</h3>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-rose-100">Requieren acción inmediata</p>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-6 rounded-3xl shadow-sm text-white hover:shadow-md hover:shadow-orange-500/20 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-orange-100 mb-1">Próximos a Vencer</p>
              <h3 className="text-4xl font-black">{stats?.expiringAlerts || 0}</h3>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="mt-4 text-xs font-medium text-orange-100">Vencen en los próximos 30 días</p>
        </div>
      </div>

      {/* Programación Anual */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Programa Anual {currentYear}</h2>
              <p className="text-slate-500 font-medium text-sm">Cronograma progresivo de formación</p>
            </div>
          </div>
          {!isClient && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Agregar Capacitación
            </button>
          )}
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MONTHS.map((monthName, index) => {
              const monthIdx = index + 1;
              const monthTrainings = trainings.filter((t: any) => t.monthIndex === monthIdx);

              return (
                <div key={monthName} className={`rounded-3xl border bg-white border-slate-200 overflow-hidden flex flex-col`}>
                  <div className={`px-5 py-3 border-b bg-indigo-50/50 border-indigo-100 flex items-center justify-between`}>
                    <span className={`font-bold text-indigo-900`}>{monthName}</span>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    {monthTrainings.length === 0 ? (
                      <div className="flex-1 flex items-center justify-center py-6">
                        <span className="text-sm font-medium text-slate-400">Sin programar</span>
                      </div>
                    ) : (
                      monthTrainings.map((t: any) => {
                        const isTrainingLocked = t.status === 'Bloqueada';
                        
                        return (
                          <div key={t.id} className={`p-4 rounded-2xl border ${isTrainingLocked ? 'border-slate-200 bg-slate-50 opacity-75' : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'} transition-all flex flex-col gap-3`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${t.priority === 'Obligatoria' ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {t.priority}
                                  </span>
                                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-black uppercase tracking-wider">
                                    {t.type}
                                  </span>
                                </div>
                                <h4 className="font-bold text-slate-800 leading-tight">{t.title}</h4>
                              </div>
                              {isTrainingLocked && (
                                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                              )}
                            </div>
                            
                            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                              <span className={`text-xs font-bold ${t.status === 'Completada' ? 'text-green-600' : t.status === 'En Progreso' ? 'text-amber-500' : t.status === 'Bloqueada' ? 'text-slate-400' : 'text-slate-500'}`}>
                                {t.status}
                              </span>
                              <div className="flex gap-2">
                                {(isAdmin || isManager) && (
                                  <button 
                                    onClick={() => handleDeleteTraining(t.id)}
                                    className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                    title="Eliminar capacitación"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <Link href={`/portal/empresas/${companyId}/capacitaciones/${t.id}`} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-indigo-100 hover:text-indigo-600 transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Agregar Capacitación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800">Nueva Capacitación</h3>
                <p className="text-slate-500 font-medium">Programe una formación en el plan anual</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-200">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateTraining} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Título de la Capacitación</label>
                  <input required type="text" value={newTraining.title} onChange={e => setNewTraining({...newTraining, title: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none" placeholder="Ej: Uso seguro de EPP" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Mes Programado</label>
                  <select required value={newTraining.monthIndex} onChange={e => setNewTraining({...newTraining, monthIndex: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-medium">
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Tipo / Nivel</label>
                  <select required value={newTraining.type} onChange={e => setNewTraining({...newTraining, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-medium">
                    <option>Operativo</option>
                    <option>Gerencial</option>
                    <option>Salud</option>
                    <option>Ingeniería</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Prioridad</label>
                  <select required value={newTraining.priority} onChange={e => setNewTraining({...newTraining, priority: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none font-medium">
                    <option>Obligatoria</option>
                    <option>Recomendada</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Link de Google Forms (Certify'em)</label>
                  <input type="url" value={newTraining.externalLink} onChange={e => setNewTraining({...newTraining, externalLink: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 outline-none text-indigo-600" placeholder="https://forms.gle/..." />
                  <p className="text-xs font-medium text-slate-500">Este link se mostrará a los participantes para realizar la evaluación.</p>
                </div>
              </div>
              
              <div className="pt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100">Cancelar</button>
                <button type="submit" className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
                  Guardar Programación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
