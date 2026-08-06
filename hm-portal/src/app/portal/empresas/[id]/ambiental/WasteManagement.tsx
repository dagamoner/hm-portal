"use client";

import { useState } from "react";
import { Plus, Trash2, Truck, CheckCircle2, Package } from "lucide-react";
import { createHazardousWaste, updateHazardousWasteStatus, deleteHazardousWaste } from "@/app/actions/environmental";
import toast from "react-hot-toast";
import { format } from "date-fns";

export function WasteManagement({ companyId, waste, setWaste }: any) {
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    generationDate: format(new Date(), "yyyy-MM-dd"),
    amountKg: "",
    storageLocation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createHazardousWaste(companyId, formData);
    if (res.success) {
      toast.success("Residuo registrado");
      setWaste([res.data, ...waste]);
      setIsAdding(false);
      setFormData({
        type: "", description: "", generationDate: format(new Date(), "yyyy-MM-dd"),
        amountKg: "", storageLocation: ""
      });
    } else {
      toast.error("Error al registrar residuo");
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const res = await updateHazardousWasteStatus(companyId, id, newStatus);
    if (res.success) {
      toast.success("Estado actualizado");
      setWaste(waste.map((w: any) => w.id === id ? { ...w, status: newStatus } : w));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este registro de residuo?")) return;
    const res = await deleteHazardousWaste(companyId, id);
    if (res.success) {
      toast.success("Registro eliminado");
      setWaste(waste.filter((w: any) => w.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Almacenado": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"><Package size={14}/> Almacenado</span>;
      case "En Tránsito": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200"><Truck size={14}/> En Tránsito</span>;
      case "Dispuesto": return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"><CheckCircle2 size={14}/> Dispuesto</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Residuos Peligrosos</h2>
          <p className="text-sm text-slate-500">Registro, almacenamiento temporal y disposición final.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Registrar Residuo
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoría / Tipo</label>
              <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="Ej. Y48, Aceites usados..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción</label>
              <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Trapos contaminados, envases..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ubicación de Almacenamiento</label>
              <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.storageLocation} onChange={e => setFormData({...formData, storageLocation: e.target.value})} placeholder="Ej. Depósito 2..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fecha de Generación</label>
              <input required type="date" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.generationDate} onChange={e => setFormData({...formData, generationDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cantidad Estimada (Kg)</label>
              <input required type="number" step="0.1" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.amountKg} onChange={e => setFormData({...formData, amountKg: e.target.value})} placeholder="0.00" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl transition-colors disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar Registro"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {waste.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-slate-500 border border-dashed border-slate-300 rounded-2xl">
            No hay residuos registrados.
          </div>
        ) : waste.map((item: any) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-black text-slate-800">{item.type}</span>
                  {getStatusBadge(item.status)}
                </div>
                <p className="text-sm text-slate-600 font-medium">{item.description}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg text-sm font-bold">
                {item.amountKg} kg
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="font-bold">Generado:</span>
                <span>{format(new Date(item.generationDate), "dd/MM/yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Ubicación:</span>
                <span>{item.storageLocation}</span>
              </div>
              {item.manifestNumber && (
                <div className="flex justify-between">
                  <span className="font-bold">Manifiesto:</span>
                  <span className="text-indigo-600 font-bold">{item.manifestNumber}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center mt-auto">
              <div className="flex gap-1">
                {item.status === "Almacenado" && (
                  <button onClick={() => handleUpdateStatus(item.id, "En Tránsito")} className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors border border-amber-200">
                    Marcar en Tránsito
                  </button>
                )}
                {item.status === "En Tránsito" && (
                  <button onClick={() => handleUpdateStatus(item.id, "Dispuesto")} className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200">
                    Marcar Dispuesto
                  </button>
                )}
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
