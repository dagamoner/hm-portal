"use client";

import { useState } from "react";
import { Plus, Users, ShieldAlert, CheckCircle, Search, User, ChevronRight, ChevronLeft, Pencil, Trash2, Edit, X } from "lucide-react";
import { createActualWorkers, deleteWorker, updateWorker } from "@/app/actions/personal";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { BulkImportModal } from "@/components/workers/BulkImportModal";

export default function PersonalClient({ companyId, initialWorkers }: { companyId: string, initialWorkers: any[] }) {
  const router = useRouter();
  const { isClient } = useAuth();
  const [workers, setWorkers] = useState(initialWorkers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Wizard state
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState({
    position: '',
    function: '',
    count: 1
  });
  const [workersData, setWorkersData] = useState<any[]>([]);

  // Edit state
  const [editingWorker, setEditingWorker] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    // Initialize workers data array based on count
    const initialData = Array.from({ length: setupData.count }).map(() => ({
      firstName: '',
      lastName: '',
      documentId: '',
      cuil: '',
      phone: '',
      emergencyContact: '',
      address: '',
      eppDelivered: 'No',
      educationLevel: '',
      hireDate: '',
      position: setupData.position,
      function: setupData.function
    }));
    setWorkersData(initialData);
    setStep(2);
  };

  const handleWorkerDataChange = (index: number, field: string, value: string) => {
    const newData = [...workersData];
    newData[index][field] = value;
    setWorkersData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createActualWorkers(companyId, workersData);

    if (res.success && res.workers) {
      setWorkers([...res.workers, ...workers]);
      setIsModalOpen(false);
      resetModal();
    } else {
      alert("Error al crear perfiles");
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateWorker(editingWorker.id, companyId, {
      ...editingWorker,
      ...editingWorker.laborData // flattening for the action
    });
    if (res.success) {
      setWorkers(workers.map(w => w.id === editingWorker.id ? res.worker : w));
      setIsEditModalOpen(false);
      setEditingWorker(null);
    } else {
      alert("Error al actualizar");
    }
    setLoading(false);
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (confirm("¿Está seguro que desea eliminar este perfil? Esta acción no se puede deshacer.")) {
      const res = await deleteWorker(workerId, companyId);
      if (res.success) {
        setWorkers(workers.filter(w => w.id !== workerId));
      } else {
        alert("Error al eliminar");
      }
    }
  };

  const resetModal = () => {
    setStep(1);
    setSetupData({ position: '', function: '', count: 1 });
    setWorkersData([]);
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
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => setIsBulkModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 justify-center"
            >
              <Users className="w-4 h-4" />
              <span>Importación Masiva</span>
            </button>
            <button 
              onClick={() => { resetModal(); setIsModalOpen(true); }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 justify-center"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Personal</span>
            </button>
          </div>
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
              <div className="text-right flex items-center justify-end gap-2">
                {!isClient && (
                  <button 
                    onClick={() => {
                      setEditingWorker({
                        ...w,
                        cuil: w.laborData?.cuil || '',
                        phone: w.laborData?.phone || '',
                        emergencyContact: w.laborData?.emergencyContact || '',
                        address: w.laborData?.address || '',
                        eppDelivered: w.laborData?.eppDelivered || 'No',
                        educationLevel: w.laborData?.educationLevel || '',
                        position: w.laborData?.position || '',
                        function: w.laborData?.function || ''
                      });
                      setIsEditModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar perfil"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {!isClient && (
                  <button 
                    onClick={() => handleDeleteWorker(w.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar perfil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => router.push(`/portal/empresas/${companyId}/personal/${w.id}`)}
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors inline-flex items-center space-x-1"
                >
                  <User className="w-3 h-3" />
                  <span>Perfil</span>
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

      {/* MODAL GENERADOR DE PERFILES (WIZARD) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Generar Perfiles</h2>
                <p className="text-sm text-slate-500">Paso {step} de 2</p>
              </div>
              <button onClick={() => { setIsModalOpen(false); resetModal(); }} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            {step === 1 ? (
              <form onSubmit={handleNextStep} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Puesto</label>
                    <input 
                      type="text" 
                      value={setupData.position} 
                      onChange={e => setSetupData({...setupData, position: e.target.value})} 
                      required 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Ej. Técnico Soldador" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Función</label>
                    <input 
                      type="text" 
                      value={setupData.function} 
                      onChange={e => setSetupData({...setupData, function: e.target.value})} 
                      required 
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                      placeholder="Ej. Soldadura de Alta Presión" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Cantidad de Perfiles</label>
                  <input 
                    type="number" 
                    min="1" max="50"
                    value={setupData.count} 
                    onChange={e => setSetupData({...setupData, count: parseInt(e.target.value)})} 
                    required 
                    className="w-full md:w-1/3 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>

                <div className="pt-6 flex justify-end space-x-3 border-t border-slate-100">
                  <button type="button" onClick={() => { setIsModalOpen(false); resetModal(); }} className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-800">
                    Cancelar
                  </button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 flex items-center space-x-2">
                    <span>Siguiente</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2">
                  {workersData.map((worker, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm border-2 border-white">
                        {index + 1}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        <div className="col-span-full mb-2 border-b border-slate-200 pb-2">
                          <h4 className="font-bold text-slate-800">Datos Obligatorios</h4>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nombre/s *</label>
                          <input 
                            type="text" 
                            required
                            value={worker.firstName}
                            onChange={(e) => handleWorkerDataChange(index, 'firstName', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Apellido/s *</label>
                          <input 
                            type="text" 
                            required
                            value={worker.lastName}
                            onChange={(e) => handleWorkerDataChange(index, 'lastName', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">D.N.I. *</label>
                          <input 
                            type="text" 
                            required
                            value={worker.documentId}
                            onChange={(e) => handleWorkerDataChange(index, 'documentId', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">CUIL *</label>
                          <input 
                            type="text" 
                            required
                            value={worker.cuil}
                            onChange={(e) => handleWorkerDataChange(index, 'cuil', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono *</label>
                          <input 
                            type="text" 
                            required
                            value={worker.phone}
                            onChange={(e) => handleWorkerDataChange(index, 'phone', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Fecha de Ingreso *</label>
                          <input 
                            type="date" 
                            required
                            value={worker.hireDate}
                            onChange={(e) => handleWorkerDataChange(index, 'hireDate', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="col-span-full mt-4 mb-2 border-b border-slate-200 pb-2">
                          <h4 className="font-bold text-slate-800">Datos Opcionales</h4>
                        </div>
                        
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Contacto de emergencia</label>
                          <input 
                            type="text" 
                            value={worker.emergencyContact}
                            onChange={(e) => handleWorkerDataChange(index, 'emergencyContact', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Domicilio real</label>
                          <input 
                            type="text" 
                            value={worker.address}
                            onChange={(e) => handleWorkerDataChange(index, 'address', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Constancia de Entrega de EPP</label>
                          <select
                            value={worker.eppDelivered}
                            onChange={(e) => handleWorkerDataChange(index, 'eppDelivered', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                            <option value="Sí">Sí</option>
                            <option value="No">No</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nivel de estudio</label>
                          <select
                            value={worker.educationLevel}
                            onChange={(e) => handleWorkerDataChange(index, 'educationLevel', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          >
                            <option value="">Seleccionar...</option>
                            <option value="Primario">Primario</option>
                            <option value="Primario incompleto">Primario incompleto</option>
                            <option value="Secundario">Secundario</option>
                            <option value="Secundario incompleto">Secundario incompleto</option>
                            <option value="Terciario">Terciario</option>
                            <option value="Terciario incompleto">Terciario incompleto</option>
                            <option value="Universitario">Universitario</option>
                            <option value="Universitario incompleto">Universitario incompleto</option>
                            <option value="Posgrado">Posgrado</option>
                            <option value="Posgrado en curso">Posgrado en curso</option>
                            <option value="Sin nivel de estudio">Sin nivel de estudio</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 mt-4 flex justify-between border-t border-slate-100">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 flex items-center space-x-2">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Volver</span>
                  </button>
                  <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
                    {loading ? 'Guardando...' : <><CheckCircle className="w-4 h-4" /><span>Finalizar y Guardar</span></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Edit className="w-6 h-6 text-blue-600" />
                Editar Perfil
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre/s *</label>
                    <input 
                      type="text" required
                      value={editingWorker.firstName}
                      onChange={(e) => setEditingWorker({...editingWorker, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Apellido/s *</label>
                    <input 
                      type="text" required
                      value={editingWorker.lastName}
                      onChange={(e) => setEditingWorker({...editingWorker, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">D.N.I. *</label>
                    <input 
                      type="text" required
                      value={editingWorker.documentId}
                      onChange={(e) => setEditingWorker({...editingWorker, documentId: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">CUIL *</label>
                    <input 
                      type="text" required
                      value={editingWorker.cuil}
                      onChange={(e) => setEditingWorker({...editingWorker, cuil: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Puesto *</label>
                    <input 
                      type="text" required
                      value={editingWorker.position}
                      onChange={(e) => setEditingWorker({...editingWorker, position: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Función *</label>
                    <input 
                      type="text" required
                      value={editingWorker.function}
                      onChange={(e) => setEditingWorker({...editingWorker, function: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono</label>
                    <input 
                      type="text"
                      value={editingWorker.phone}
                      onChange={(e) => setEditingWorker({...editingWorker, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contacto de Emergencia</label>
                    <input 
                      type="text"
                      value={editingWorker.emergencyContact || ''}
                      onChange={(e) => setEditingWorker({...editingWorker, emergencyContact: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-800">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Import Modal */}
      <BulkImportModal 
        companyId={companyId}
        isOpen={isBulkModalOpen}
        onClose={() => {
          setIsBulkModalOpen(false);
          router.refresh(); // Refresh page to get latest data
        }}
      />
    </div>
  );
}
