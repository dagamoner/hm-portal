"use client";

import { useState } from "react";
import { X, ShieldAlert } from "lucide-react";
import { createHazard } from "@/app/actions/risks";

export default function HazardModal({ taskId, companyId, onClose }: { taskId: string, companyId: string, onClose: () => void }) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        await createHazard(taskId, companyId, formData);
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-lg shadow-rose-600/30">
                            <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Identificar Peligro</h3>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-600 ml-1">Peligro Identificado</label>
                        <input required name="name" type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold" placeholder="Ej: Ruido superior a 85 dBA" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-600 ml-1">Tipo de Peligro</label>
                        <select name="type" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-slate-700">
                            <option value="Físico">Físico</option>
                            <option value="Químico">Químico</option>
                            <option value="Biológico">Biológico</option>
                            <option value="Ergonómico">Ergonómico</option>
                            <option value="Psicosocial">Psicosocial</option>
                            <option value="Mecánico">Mecánico</option>
                            <option value="Eléctrico">Eléctrico</option>
                            <option value="Incendio">Incendio</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-600 ml-1">Descripción de la Exposición / Fuente</label>
                        <textarea name="description" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-sm h-24 resize-none" placeholder="El trabajador se encuentra cerca del motor principal..."></textarea>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="px-8 py-3 text-sm font-black text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 shadow-lg shadow-rose-200 rounded-2xl transition-all">
                            {isSaving ? 'Agregando...' : 'Agregar Peligro'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
