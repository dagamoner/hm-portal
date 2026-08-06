"use client";

import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { createChemicalProduct } from "@/app/actions/chemicals";
import toast from "react-hot-toast";

const ALL_PICTOGRAMS = [
  { id: "GHS01", label: "Explosivo", icon: "💣" },
  { id: "GHS02", label: "Inflamable", icon: "🔥" },
  { id: "GHS03", label: "Comburente", icon: "⭕" },
  { id: "GHS04", label: "Gas a presión", icon: "🗜️" },
  { id: "GHS05", label: "Corrosivo", icon: "🧪" },
  { id: "GHS06", label: "Toxicidad Aguda", icon: "☠️" },
  { id: "GHS07", label: "Peligro Irritación", icon: "❗" },
  { id: "GHS08", label: "Peligro Salud", icon: "👤" },
  { id: "GHS09", label: "Peligro Ambiente", icon: "🐟" },
];

export function ChemicalForm({ companyId, onSuccess, onCancel }: any) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    casNumber: "",
    commonUse: "",
    warningWord: "",
    pictograms: [] as string[],
    hazardStatements: [] as string[],
    precautionaryStatements: [] as string[],
    storageLocation: "",
    incompatibilities: "",
    fdsUrl: "",
    fdsCompliant: false,
  });

  const togglePictogram = (id: string) => {
    setFormData(prev => ({
      ...prev,
      pictograms: prev.pictograms.includes(id)
        ? prev.pictograms.filter(p => p !== id)
        : [...prev.pictograms, id]
    }));
  };

  const handleArrayInput = (e: React.ChangeEvent<HTMLTextAreaElement>, field: "hazardStatements" | "precautionaryStatements") => {
    const lines = e.target.value.split('\n').filter(l => l.trim() !== "");
    setFormData(prev => ({ ...prev, [field]: lines }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createChemicalProduct(companyId, formData);
    if (res.success) {
      toast.success("Sustancia registrada");
      onSuccess(res.data);
    } else {
      toast.error("Error al registrar");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Identificación */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h3 className="font-black text-slate-800 border-b border-slate-200 pb-2">1. Identificación del Producto</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Comercial / Químico</label>
            <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Ácido Sulfúrico 98%" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nº CAS</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.casNumber} onChange={e => setFormData({...formData, casNumber: e.target.value})} placeholder="Ej. 7664-93-9" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Uso Previsto en Planta</label>
          <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.commonUse} onChange={e => setFormData({...formData, commonUse: e.target.value})} placeholder="Ej. Reactivo de laboratorio, Limpieza..." />
        </div>
      </div>

      {/* 2. Clasificación SGA */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h3 className="font-black text-slate-800 border-b border-slate-200 pb-2">2. Clasificación de Peligros (SGA/GHS)</h3>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Palabra de Advertencia</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="warningWord" value="PELIGRO" checked={formData.warningWord === "PELIGRO"} onChange={e => setFormData({...formData, warningWord: e.target.value})} className="w-4 h-4 text-red-600 focus:ring-red-500" />
              <span className="font-bold text-red-700 bg-red-50 px-3 py-1 rounded-lg">PELIGRO</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="warningWord" value="ATENCIÓN" checked={formData.warningWord === "ATENCIÓN"} onChange={e => setFormData({...formData, warningWord: e.target.value})} className="w-4 h-4 text-amber-600 focus:ring-amber-500" />
              <span className="font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-lg">ATENCIÓN</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="warningWord" value="" checked={formData.warningWord === ""} onChange={e => setFormData({...formData, warningWord: e.target.value})} className="w-4 h-4 text-slate-600 focus:ring-slate-500" />
              <span className="font-bold text-slate-600 bg-slate-200 px-3 py-1 rounded-lg">Ninguna</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pictogramas de Peligro</label>
          <div className="flex flex-wrap gap-4">
            {ALL_PICTOGRAMS.map(pic => {
              const isSelected = formData.pictograms.includes(pic.id);
              return (
                <button
                  key={pic.id}
                  type="button"
                  onClick={() => togglePictogram(pic.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all w-24 ${
                    isSelected ? "border-red-500 bg-red-50 shadow-md" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`w-12 h-12 bg-white border-2 flex items-center justify-center text-2xl shadow-sm rotate-45 transform origin-center scale-75 mb-2 ${
                    isSelected ? "border-red-500" : "border-slate-300"
                  }`}>
                    <span className="-rotate-45 block">{pic.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight text-slate-700">{pic.label}</span>
                  {isSelected && <Check size={14} className="text-red-500 absolute top-1 right-1" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frases H (Indicaciones de Peligro)</label>
            <p className="text-[10px] text-slate-500 mb-2">Escribe una frase por línea.</p>
            <textarea 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-mono" 
              rows={4} 
              defaultValue={formData.hazardStatements.join('\n')}
              onChange={e => handleArrayInput(e, "hazardStatements")}
              placeholder="Ej.&#10;H314 Provoca graves quemaduras...&#10;H302 Nocivo en caso de ingestión..." 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Frases P (Consejos de Prudencia)</label>
            <p className="text-[10px] text-slate-500 mb-2">Escribe una frase por línea.</p>
            <textarea 
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-mono" 
              rows={4} 
              defaultValue={formData.precautionaryStatements.join('\n')}
              onChange={e => handleArrayInput(e, "precautionaryStatements")}
              placeholder="Ej.&#10;P280 Usar guantes/ropa de protección...&#10;P260 No respirar polvos/humos..." 
            />
          </div>
        </div>
      </div>

      {/* 3. FDS y Almacenamiento */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4">
        <h3 className="font-black text-slate-800 border-b border-slate-200 pb-2">3. Ficha de Datos de Seguridad y Almacenamiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ubicación de Almacenamiento</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.storageLocation} onChange={e => setFormData({...formData, storageLocation: e.target.value})} placeholder="Ej. Depósito Inflamables" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Incompatibilidades</label>
            <input type="text" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500" value={formData.incompatibilities} onChange={e => setFormData({...formData, incompatibilities: e.target.value})} placeholder="Ej. Ácidos fuertes, bases..." />
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Ficha de Datos de Seguridad (FDS)</label>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white border border-slate-200 border-dashed rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">{formData.fdsUrl ? "Archivo adjunto" : "Subir PDF de Ficha de Seguridad..."}</span>
              <button type="button" className="text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5">
                <Upload size={14} /> Subir PDF
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer border border-slate-200 bg-white px-4 py-3 rounded-xl shrink-0">
              <input type="checkbox" className="w-4 h-4 text-emerald-600 rounded" checked={formData.fdsCompliant} onChange={e => setFormData({...formData, fdsCompliant: e.target.checked})} />
              <span className="text-sm font-bold text-slate-700">FDS Homologada SGA (16 Sec.)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
          Cancelar
        </button>
        <button type="submit" disabled={loading} className="px-8 py-2.5 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition-all disabled:opacity-50">
          {loading ? "Guardando..." : "Guardar Producto Químico"}
        </button>
      </div>
    </form>
  );
}
