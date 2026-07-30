"use client";

import { useState } from "react";
import { Plus, Users, ShieldAlert, CheckCircle, Search, User } from "lucide-react";
import { generateWorkers } from "@/app/actions/personal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

export default function PersonalClient({ companyId, initialWorkers }: { companyId: string, initialWorkers: any[] }) {
  const router = useRouter();
  const { isClient } = useAuth();
  const [workers, setWorkers] = useState(initialWorkers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    roleName: '',
    count: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await generateWorkers(companyId, formData.roleName, formData.count);

    if (res.success && res.workers) {
      setWorkers([...res.workers, ...workers]);
      setIsModalOpen(false);
      setFormData({ roleName: '', count: 1 });
    }
    setLoading(false);
  };

  const filteredWorkers = workers.filter(w => 
    w.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (w.laborData?.position || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o puesto..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        {!isClient && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 w-full md:w-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Generar Perfiles Operativos</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredWorkers.map((w) => (
          <div key={w.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all flex flex-col">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg border border-slate-200">
                {w.firstName.charAt(0)}{w.lastName.charAt(0)}
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-slate-800 truncate" title={`${w.firstName} ${w.lastName}`}>
                  {w.firstName} {w.lastName}
                </h3>
                <p className="text-xs text-slate-500 truncate" title={(w.laborData as any)?.position || 'Sin puesto'}>
                  {(w.laborData as any)?.position || 'Sin puesto'}
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Safety Score</p>
                <div className="flex items-center space-x-1">
                  <ShieldAlert className={`w-4 h-4 ${
                    w.safetyScore >= 90 ? 'text-emerald-500' :
                    w.safetyScore >= 70 ? 'text-amber-500' : 'text-red-500'
                  }`} />
                  <span className={`font-bold ${
                    w.safetyScore >= 90 ? 'text-emerald-600' :
                    w.safetyScore >= 70 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {w.safetyScore}%
                  </span>
                </div>
              </div>
              <div className="text-right">
                <button 
                  onClick={() => router.push(`/portal/empresas/${companyId}/personal/${w.id}`)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center space-x-1"
                >
                  <User className="w-3 h-3" />
                  <span>Perfil & PTW</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600">No se encontraron trabajadores</h3>
          <p className="text-slate-400 text-sm mt-1">Genera perfiles operativos para comenzar.</p>
        </div>
      )}

      {/* MODAL GENERADOR DE PERFILES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Generar Perfiles</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 mb-4">
                El sistema generará fichas de seguridad simuladas con un Safety Score basado en el riesgo del puesto.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Puesto o Función Laboral</label>
                <input 
                  type="text" 
                  value={formData.roleName} 
                  onChange={e => setFormData({...formData, roleName: e.target.value})} 
                  required 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" 
                  placeholder="Ej. Técnico Soldador de Alta Presión" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad de Perfiles</label>
                <input 
                  type="number" 
                  min="1" max="50"
                  value={formData.count} 
                  onChange={e => setFormData({...formData, count: parseInt(e.target.value)})} 
                  required 
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" 
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
                  {loading ? 'Generando...' : <><CheckCircle className="w-4 h-4" /><span>Generar</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
