"use client";

import { useState } from "react";
import { createCapa } from "@/app/actions/capa";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

export function CapaForm({ companyId, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    area: "",
    deviationType: "",
    riskLevel: "MINOR",
    description: "",
    immediateCorrection: "",
    notifiedPersons: "",
    backgroundCheck: "",
    interviews: "",
    inspections: "",
    rootCause: "",
    verificationTests: "",
    verificationResults: "",
    sopUpdated: false,
    status: "ABIERTO",
  });

  const [actions, setActions] = useState<any[]>([]);
  const [newAction, setNewAction] = useState({ type: "CORRECTIVA", description: "", responsible: "", deadline: "" });

  const handleAddAction = () => {
    if (!newAction.description || !newAction.responsible || !newAction.deadline) {
      toast.error("Completa todos los campos de la acción");
      return;
    }
    setActions([...actions, { ...newAction, status: "PENDIENTE" }]);
    setNewAction({ type: "CORRECTIVA", description: "", responsible: "", deadline: "" });
  };

  const handleRemoveAction = (index: number) => {
    setActions(actions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validar acciones en JSON
    const actionPlan = actions.map(a => ({
      ...a,
      deadline: new Date(a.deadline).toISOString(),
    }));

    const res = await createCapa(companyId, { ...formData, actionPlan });
    if (res.success) {
      toast.success("Caso CAPA registrado con éxito");
      onSuccess(res.data);
    } else {
      toast.error("Error al registrar el caso CAPA");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Identificación y Contención */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h3 className="font-black text-slate-800 border-b border-slate-200 pb-2">1. Identificación del Hallazgo y Contención</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tipo de Desvío</label>
            <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.deviationType} onChange={e => setFormData({...formData, deviationType: e.target.value})} placeholder="Ej. Falla en esterilización" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Área o Sector</label>
            <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Ej. Laboratorio, Planta Baja" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nivel de Riesgo</label>
            <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.riskLevel} onChange={e => setFormData({...formData, riskLevel: e.target.value})}>
              <option value="CRITICAL">CRÍTICO</option>
              <option value="MAJOR">MAYOR</option>
              <option value="MINOR">MENOR</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descripción del Problema</label>
          <textarea required rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe detalladamente qué sucedió..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Corrección Inmediata Aplicada</label>
            <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.immediateCorrection} onChange={e => setFormData({...formData, immediateCorrection: e.target.value})} placeholder="Ej. Se detuvo la máquina y se descartó el lote..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Personal Notificado</label>
            <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.notifiedPersons} onChange={e => setFormData({...formData, notifiedPersons: e.target.value})} placeholder="Nombres o cargos de las personas avisadas..." />
          </div>
        </div>
      </div>

      {/* 2. Investigación (Causa Raíz) */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h3 className="font-black text-slate-800 border-b border-slate-200 pb-2">2. Investigación de la Causa Raíz</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Antecedentes</label>
            <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.backgroundCheck} onChange={e => setFormData({...formData, backgroundCheck: e.target.value})} placeholder="¿Había ocurrido antes?..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Entrevistas e Inspecciones</label>
            <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.interviews} onChange={e => setFormData({...formData, interviews: e.target.value})} placeholder="Resumen de entrevistas con los operadores..." />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-rose-600 uppercase mb-1">Causa Raíz Definida</label>
          <textarea rows={3} required className="w-full bg-rose-50 border border-rose-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rose-500" value={formData.rootCause} onChange={e => setFormData({...formData, rootCause: e.target.value})} placeholder="Conclusión final de la causa que originó el problema..." />
        </div>
      </div>

      {/* 3. Plan de Acción (CAPA) */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h3 className="font-black text-slate-800 border-b border-slate-200 pb-2">3. Plan de Acción (Correctivas y Preventivas)</h3>
        
        {/* List Actions */}
        {actions.length > 0 && (
          <div className="space-y-2 mb-4">
            {actions.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-3">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${act.type === 'CORRECTIVA' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                      {act.type}
                    </span>
                    <span className="text-sm font-bold text-slate-700">{act.description}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Resp: {act.responsible} • Vence: {act.deadline}</div>
                </div>
                <button type="button" onClick={() => handleRemoveAction(idx)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add Action Form */}
        <div className="bg-slate-100 p-4 rounded-xl flex flex-col md:flex-row gap-3 items-end">
          <div className="w-full md:w-32 shrink-0">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tipo</label>
            <select className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm" value={newAction.type} onChange={e => setNewAction({...newAction, type: e.target.value})}>
              <option value="CORRECTIVA">Correctiva</option>
              <option value="PREVENTIVA">Preventiva</option>
            </select>
          </div>
          <div className="w-full flex-1">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Acción a realizar</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm" value={newAction.description} onChange={e => setNewAction({...newAction, description: e.target.value})} placeholder="Ej. Modificar POE de limpieza" />
          </div>
          <div className="w-full md:w-48 shrink-0">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Responsable</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm" value={newAction.responsible} onChange={e => setNewAction({...newAction, responsible: e.target.value})} placeholder="Ej. Juan Pérez" />
          </div>
          <div className="w-full md:w-36 shrink-0">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Plazo</label>
            <input type="date" className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm" value={newAction.deadline} onChange={e => setNewAction({...newAction, deadline: e.target.value})} />
          </div>
          <button type="button" onClick={handleAddAction} className="bg-slate-800 text-white p-1.5 rounded-lg hover:bg-slate-700 transition-colors h-9 w-9 flex items-center justify-center shrink-0">
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* 4. Verificación y Cierre */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h3 className="font-black text-slate-800 border-b border-slate-200 pb-2">4. Verificación de Eficacia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Método de Verificación</label>
            <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.verificationTests} onChange={e => setFormData({...formData, verificationTests: e.target.value})} placeholder="Ej. Hisopado a los 30 días, auditoría visual..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resultados Obtenidos</label>
            <textarea rows={2} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.verificationResults} onChange={e => setFormData({...formData, verificationResults: e.target.value})} placeholder="Ej. Cultivo negativo. El riesgo desapareció..." />
          </div>
        </div>
        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer border border-slate-200 bg-white px-4 py-3 rounded-xl w-fit">
            <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" checked={formData.sopUpdated} onChange={e => setFormData({...formData, sopUpdated: e.target.checked})} />
            <span className="text-sm font-bold text-slate-700">POE (Procedimientos Operativos Estándar) Actualizados</span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-8 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50">
          {loading ? "Guardando..." : "Crear Caso CAPA"}
        </button>
      </div>
    </form>
  );
}
