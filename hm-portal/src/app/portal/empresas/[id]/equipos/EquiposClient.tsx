"use client";

import { useState } from "react";
import { Plus, Settings, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { createEquipment } from "@/app/actions/equipos";
import { useRouter } from "next/navigation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useAuth } from "@/components/providers/AuthProvider";

import { format } from "date-fns";
import { resolveMaintenanceAlert } from "@/app/actions/maintenance";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function EquiposClient({ companyId, initialEquipments, initialAlerts = [] }: { companyId: string, initialEquipments: any[], initialAlerts?: any[] }) {
  const router = useRouter();
  const { isClient } = useAuth();
  const [equipments, setEquipments] = useState(initialEquipments);
  const [alerts, setAlerts] = useState(initialAlerts);
  const [activeTab, setActiveTab] = useState<'equipos' | 'alertas'>('equipos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Grúa Torre',
    status: 'Operativo',
    hours: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createEquipment(companyId, {
      ...formData,
      hours: parseInt(formData.hours)
    });

    if (res.success && res.equipment) {
      setEquipments([res.equipment, ...equipments]);
      setIsModalOpen(false);
      setFormData({ name: '', category: 'Grúa Torre', status: 'Operativo', hours: '' });
    }
    setLoading(false);
  };

  // Stats for the top chart
  const operativos = equipments.filter(e => e.status === 'Operativo').length;
  const enMantenimiento = equipments.filter(e => e.status === 'En Mantenimiento').length;
  const criticos = equipments.filter(e => e.status === 'Crítico').length;

  const chartData = {
    labels: ['Operativo', 'En Mantenimiento', 'Crítico'],
    datasets: [{
      data: [operativos, enMantenimiento, criticos],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      borderWidth: 0
    }]
  };

  const handleResolveAlert = async (alertId: string) => {
      const res = await resolveMaintenanceAlert(companyId, alertId, "Resuelto manualmente");
      if (res.success) {
          setAlerts(alerts.map(a => a.id === alertId ? { ...a, isCompleted: true } : a));
      } else {
          alert("Error al resolver alerta");
      }
  };

  return (
    <div>
      {/* TABS NAVEGACIÓN */}
      <div className="flex space-x-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab("equipos")}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "equipos" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <Settings className="w-4 h-4" />
          Directorio de Equipos
        </button>
        <button
          onClick={() => setActiveTab("alertas")}
          className={`px-4 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "alertas" 
              ? "border-indigo-600 text-indigo-600" 
              : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Alertas de Mantenimiento ({alerts.filter(a => !a.isCompleted).length})
        </button>
      </div>

      {activeTab === 'equipos' && (
          <>
          {/* HEADER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="md:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
          <div className="w-32 h-32">
            <Doughnut data={chartData} options={{ cutout: '75%', plugins: { legend: { display: false } } }} />
          </div>
        </div>
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 flex flex-col justify-center">
            <p className="text-sm font-semibold text-emerald-600 uppercase">Operativos</p>
            <h3 className="text-4xl font-black text-emerald-700 mt-1">{operativos}</h3>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 flex flex-col justify-center">
            <p className="text-sm font-semibold text-amber-600 uppercase">En Mantenimiento</p>
            <h3 className="text-4xl font-black text-amber-700 mt-1">{enMantenimiento}</h3>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex flex-col justify-center">
            <p className="text-sm font-semibold text-red-600 uppercase">Críticos</p>
            <h3 className="text-4xl font-black text-red-700 mt-1">{criticos}</h3>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Inventario Centralizado ({equipments.length})</h2>
        {!isClient && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Alta de Activo</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipments.map((e) => (
          <div key={e.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  e.status === 'Operativo' ? 'bg-emerald-100 text-emerald-600' :
                  e.status === 'En Mantenimiento' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{e.name}</h3>
                  <p className="text-xs text-slate-500">{e.category}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                e.status === 'Operativo' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                e.status === 'En Mantenimiento' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {e.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <p className="text-xs text-slate-400">Horas de Operación Acumuladas</p>
                <p className="text-lg font-medium text-slate-700">
                  {e.hours ? `${e.hours.toLocaleString()} hs` : '0 hs'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/portal/empresas/${companyId}/equipos/${e.id}`)}
              className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Bitácora y Análisis Predictivo</span>
            </button>
          </div>
        ))}
      </div>

      {equipments.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
          <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600">No hay activos registrados</h3>
          <p className="text-slate-400 text-sm mt-1">Comienza agregando el primer equipo al inventario.</p>
        </div>
      )}

      {/* MODAL ALTA EQUIPO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Alta de Activo</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre / Identificador</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ej. Grúa Torre G-01" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría Técnica</label>
                <select 
                  value={formData.category} 
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option>Grúa Torre</option>
                  <option>Grúa Móvil</option>
                  <option>Generador Eléctrico</option>
                  <option>Caldera</option>
                  <option>Compresor Industrial</option>
                  <option>Autoelevador</option>
                  <option>Maquinaria Pesada</option>
                  <option>Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Horas de Operación Acumuladas</label>
                <input type="number" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ej. 1500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estado Operativo</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option>Operativo</option>
                  <option>En Mantenimiento</option>
                  <option>Crítico</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
                  {loading ? 'Guardando...' : <><CheckCircle className="w-4 h-4" /><span>Registrar Activo</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
      )}

      {activeTab === 'alertas' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 min-h-[400px] p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Cronograma de Mantenimiento Preventivo</h3>
              {alerts.length === 0 ? (
                  <div className="text-center py-20">
                      <CheckCircle className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
                      <h4 className="text-slate-600 font-bold mb-2">Todo al día</h4>
                      <p className="text-slate-500 text-sm">No hay alertas de mantenimiento pendientes.</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {alerts.map(alert => (
                          <div key={alert.id} className={`p-4 rounded-2xl border flex items-center justify-between ${alert.isCompleted ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-rose-200 shadow-sm'}`}>
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-bold text-slate-800">{alert.title}</h4>
                                  </div>
                                  <p className="text-sm text-slate-500">Equipo: {alert.equipment?.name || "Desconocido"} - Vencimiento: {format(new Date(alert.dueDate), "dd/MM/yyyy")}</p>
                              </div>
                              {!alert.isCompleted && (
                                  <button onClick={() => handleResolveAlert(alert.id)} className="px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl font-bold text-sm transition-colors border border-emerald-200 flex items-center gap-2">
                                      <CheckCircle className="w-4 h-4" />
                                      Marcar Resuelto
                                  </button>
                              )}
                              {alert.isCompleted && (
                                  <span className="text-sm font-bold text-slate-400">Resuelto</span>
                              )}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      )}
    </div>
  );
}
