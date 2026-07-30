"use client";

import { useState } from "react";
import { Plus, Car, Truck, Settings, FileText, CheckCircle } from "lucide-react";
import { createVehicle } from "@/app/actions/vehiculos";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function VehiculosClient({ companyId, initialVehicles }: { companyId: string, initialVehicles: any[] }) {
  const router = useRouter();
  const { isClient } = useAuth();
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Camioneta 4x4',
    brand: '',
    model: '',
    plate: '',
    year: new Date().getFullYear(),
    mileage: '',
    hours: '',
    status: 'Disponible'
  });

  const isHeavy = ['Autoelevador', 'Maquinaria', 'Tractor', 'Excavadora'].includes(formData.type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createVehicle(companyId, {
      ...formData,
      mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
      hours: formData.hours ? parseInt(formData.hours) : undefined
    });

    if (res.success && res.vehicle) {
      setVehicles([res.vehicle, ...vehicles]);
      setIsModalOpen(false);
      setFormData({ ...formData, brand: '', model: '', plate: '', mileage: '', hours: '' });
    }
    setLoading(false);
  };

  const getIcon = (type: string) => {
    if (type.includes('Camioneta') || type.includes('Auto')) return <Car className="w-5 h-5" />;
    if (type.includes('Camión')) return <Truck className="w-5 h-5" />;
    return <Settings className="w-5 h-5" />;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Directorio de Unidades ({vehicles.length})</h2>
        {!isClient && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Alta de Unidad</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-xl ${
                  v.status === 'Disponible' ? 'bg-emerald-100 text-emerald-600' :
                  v.status === 'En Mantenimiento' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  {getIcon(v.type)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{v.plate}</h3>
                  <p className="text-xs text-slate-500">{v.brand} {v.model}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                v.status === 'Disponible' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                v.status === 'En Mantenimiento' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {v.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-400">Tipo</p>
                <p className="text-sm font-medium text-slate-700">{v.type}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Año</p>
                <p className="text-sm font-medium text-slate-700">{v.year}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-slate-400">Uso Acumulado</p>
                <p className="text-sm font-medium text-slate-700">
                  {v.mileage ? `${v.mileage.toLocaleString()} km` : v.hours ? `${v.hours.toLocaleString()} horas` : 'No registrado'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => router.push(`/portal/empresas/${companyId}/vehiculos/${v.id}`)}
              className="w-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Ver Diagnóstico Técnico</span>
            </button>
          </div>
        ))}
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
          <Truck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600">No hay vehículos registrados</h3>
          <p className="text-slate-400 text-sm mt-1">Comienza agregando la primera unidad de la flota.</p>
        </div>
      )}

      {/* MODAL ALTA VEHICULO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Alta de Unidad</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Unidad</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  >
                    <option>Camioneta 4x4</option>
                    <option>Automóvil Corporativo</option>
                    <option>Camión de Carga</option>
                    <option>Autoelevador</option>
                    <option>Maquinaria</option>
                    <option>Tractor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Marca</label>
                  <input type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ej. Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Modelo</label>
                  <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ej. Hilux" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dominio / Patente</label>
                  <input type="text" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm uppercase" placeholder="AB 123 CD" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Año</label>
                  <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" min="1990" max="2030" />
                </div>

                {!isHeavy ? (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Kilometraje</label>
                    <input type="number" value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value, hours: ''})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ej. 120000" />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Horas de Uso</label>
                    <input type="number" value={formData.hours} onChange={e => setFormData({...formData, hours: e.target.value, mileage: ''})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Ej. 5000" />
                  </div>
                )}

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Estado Operativo</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option>Disponible</option>
                    <option>En Mantenimiento</option>
                    <option>Fuera de servicio</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
                  {loading ? 'Guardando...' : <><CheckCircle className="w-4 h-4" /><span>Registrar Unidad</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
