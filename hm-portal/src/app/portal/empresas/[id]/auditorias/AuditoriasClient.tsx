"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, FileText, CheckCircle2, Clock, MapPin, Search, Plus, Calendar, Settings, ArrowRight, Trash2 } from "lucide-react";
import { createInspection, deleteInspection } from "./actions";
import { useAuth } from "@/components/providers/AuthProvider";

export function AuditoriasClient({ 
  companyId, 
  initialInspections,
  templates 
}: { 
  companyId: string, 
  initialInspections: any[],
  templates: any[] 
}) {
  const router = useRouter();
  const { isClient } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // New Audit State
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [auditTitle, setAuditTitle] = useState("");
  const [auditLocation, setAuditLocation] = useState("");
  const [auditDate, setAuditDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredInspections = initialInspections.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: initialInspections.length,
    completed: initialInspections.filter(i => i.status === "Completada").length,
    inProgress: initialInspections.filter(i => i.status === "En Progreso").length,
    avgScore: initialInspections.length > 0 
      ? (initialInspections.reduce((acc, curr) => acc + curr.score, 0) / initialInspections.length).toFixed(1)
      : 0
  };

  const handleCreateInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate || !auditTitle || !auditLocation || !auditDate) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      setIsLoading(true);
      const inspectionId = await createInspection(
        companyId, 
        selectedTemplate, 
        auditTitle, 
        auditLocation, 
        auditDate
      );
      setIsNewModalOpen(false);
      // Redirect to the new inspection page
      router.push(`/portal/empresas/${companyId}/auditorias/${inspectionId}`);
    } catch (error) {
      console.error(error);
      alert("Error al crear la auditoría. Asegúrese de que la plantilla es válida.");
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar esta auditoría? Esta acción no se puede deshacer.")) {
      await deleteInspection(id, companyId);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Puntaje Promedio</h3>
            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <ClipboardCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{stats.avgScore}%</p>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Nivel General Cumplimiento</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Total Auditorías</h3>
            <span className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{stats.total}</p>
          <p className="text-xs font-semibold text-slate-500">Histórico registrado</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">En Progreso</h3>
            <span className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{stats.inProgress}</p>
          <p className="text-xs font-semibold text-amber-600">Requieren acción</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Completadas</h3>
            <span className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{stats.completed}</p>
          <p className="text-xs font-semibold text-emerald-600">Cerradas y evaluadas</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[500px]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">Registro de Auditorías</h2>
            <p className="text-sm text-slate-500">Gestión de checklists e inspecciones documentadas</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar inspección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            {!isClient && (
              <button 
                onClick={() => setIsNewModalOpen(true)}
                className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva Auditoría</span>
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto">
          {filteredInspections.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Detalle</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha / Ubicación</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Puntaje</th>
                  <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredInspections.map((ins) => (
                  <tr key={ins.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{ins.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">ID: {ins.id.split('-')[0]}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 mb-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(ins.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {ins.location}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        ins.status === "Completada" 
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}>
                        {ins.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[4rem] bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${ins.score >= 80 ? 'bg-emerald-500' : ins.score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                            style={{ width: `${ins.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ins.score}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/portal/empresas/${companyId}/auditorias/${ins.id}`)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                          title="Continuar / Ver"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                        {!isClient && (
                          <button 
                            onClick={() => handleDelete(ins.id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Sin auditorías</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                Aún no hay inspecciones o auditorías registradas que coincidan con su búsqueda.
              </p>
              {!isClient && (
                <button 
                  onClick={() => setIsNewModalOpen(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
                >
                  Iniciar Primera Auditoría
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Audit Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-indigo-500" />
                Nueva Auditoría / Inspección
              </h3>
              <button 
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateInspection} className="p-6 flex flex-col gap-4 overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Plantilla a utilizar *
                </label>
                {templates.length > 0 ? (
                  <select 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                    required
                  >
                    <option value="">-- Seleccionar Plantilla --</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.type})</option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-xl">
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-400 mb-2">No hay plantillas disponibles.</p>
                    <p className="text-xs text-amber-700 dark:text-amber-500 mb-3">Debe crear al menos una plantilla de Checklist en la configuración del sistema antes de poder iniciar una auditoría.</p>
                    <button 
                      type="button"
                      onClick={() => router.push(`/portal/settings/checklists`)}
                      className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1 hover:underline"
                    >
                      <Settings className="w-3.5 h-3.5" /> Ir a Configuración de Plantillas
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                  Título de la Inspección *
                </label>
                <input 
                  type="text" 
                  value={auditTitle}
                  onChange={(e) => setAuditTitle(e.target.value)}
                  placeholder="Ej: Auditoría Mensual Obra Centro"
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Fecha *
                  </label>
                  <input 
                    type="date" 
                    value={auditDate}
                    onChange={(e) => setAuditDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                    Ubicación / Sector *
                  </label>
                  <input 
                    type="text" 
                    value={auditLocation}
                    onChange={(e) => setAuditLocation(e.target.value)}
                    placeholder="Ej: Subsuelo 2"
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={isLoading || templates.length === 0}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-sm"
                >
                  {isLoading ? 'Iniciando...' : 'Comenzar Auditoría'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
