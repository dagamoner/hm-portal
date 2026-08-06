"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createEnvironmentalAspect, deleteEnvironmentalAspect } from "@/app/actions/environmental";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

export function EnvironmentalMatrix({ companyId, aspects, setAspects }: any) {
  const { isClient } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    process: "",
    aspect: "",
    impact: "",
    condition: "Normal",
    probability: 1,
    severity: 1,
    controls: "",
    actionPlan: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createEnvironmentalAspect(companyId, formData);
    if (res.success) {
      toast.success("Aspecto ambiental registrado");
      setAspects([res.data, ...aspects]);
      setIsAdding(false);
      setFormData({
        process: "", aspect: "", impact: "", condition: "Normal",
        probability: 1, severity: 1, controls: "", actionPlan: ""
      });
    } else {
      toast.error("Error al registrar el aspecto");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este aspecto ambiental?")) return;
    const res = await deleteEnvironmentalAspect(companyId, id);
    if (res.success) {
      toast.success("Aspecto eliminado");
      setAspects(aspects.filter((a: any) => a.id !== id));
    }
  };

  const getSignificanceColor = (isSig: boolean) => {
    return isSig 
      ? "bg-red-50 text-red-700 border-red-200" 
      : "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Aspectos e Impactos</h2>
          <p className="text-sm text-slate-500">Identificación y evaluación de riesgos ambientales.</p>
        </div>
        {!isClient && (
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <Plus size={16} />
            Nuevo Aspecto
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Proceso / Actividad</label>
              <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.process} onChange={e => setFormData({...formData, process: e.target.value})} placeholder="Ej. Pintura, Mantenimiento..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Aspecto Ambiental</label>
              <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.aspect} onChange={e => setFormData({...formData, aspect: e.target.value})} placeholder="Ej. Emisión de VOCs, Derrame..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Impacto Ambiental</label>
              <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.impact} onChange={e => setFormData({...formData, impact: e.target.value})} placeholder="Ej. Contaminación del aire..." />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Condición</label>
              <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}>
                <option value="Normal">Normal</option>
                <option value="Anormal">Anormal</option>
                <option value="Emergencia">Emergencia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Probabilidad (1-5)</label>
              <input required type="number" min="1" max="5" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.probability} onChange={e => setFormData({...formData, probability: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Severidad (1-5)</label>
              <input required type="number" min="1" max="5" className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" value={formData.severity} onChange={e => setFormData({...formData, severity: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Significancia</label>
              <div className="w-full bg-slate-200 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-700 cursor-not-allowed">
                {formData.probability * formData.severity} {(formData.probability * formData.severity) >= 12 ? "(Significativo)" : "(No Sig.)"}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Controles Existentes</label>
              <textarea className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" rows={2} value={formData.controls} onChange={e => setFormData({...formData, controls: e.target.value})} placeholder="Medidas actuales..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan de Acción (si es significativo)</label>
              <textarea className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm" rows={2} value={formData.actionPlan} onChange={e => setFormData({...formData, actionPlan: e.target.value})} placeholder="Mejoras propuestas..." />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
            <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50">
              {loading ? "Guardando..." : "Guardar Aspecto"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="p-4 font-bold">Proceso</th>
              <th className="p-4 font-bold">Aspecto / Impacto</th>
              <th className="p-4 font-bold text-center">Condición</th>
              <th className="p-4 font-bold text-center">P x S</th>
              <th className="p-4 font-bold text-center">Significancia</th>
              <th className="p-4 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {aspects.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">No hay aspectos ambientales registrados.</td>
              </tr>
            ) : aspects.map((aspect: any) => (
              <tr key={aspect.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-800 text-sm">{aspect.process}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-slate-700 text-sm">{aspect.aspect}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{aspect.impact}</div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-flex px-2 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600">
                    {aspect.condition}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <div className="text-sm font-bold text-slate-700">{aspect.probability} x {aspect.severity}</div>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold border ${getSignificanceColor(aspect.isSignificant)}`}>
                    {aspect.significance} - {aspect.isSignificant ? "Significativo" : "No Significativo"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {!isClient && (
                    <button onClick={() => handleDelete(aspect.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
