"use client";

import { useState } from "react";
import { X, Settings } from "lucide-react";
import { createProcess } from "@/app/actions/risks";

export default function ProcessModal({ sectorId, companyId, onClose }: { sectorId: string, companyId: string, onClose: () => void }) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        await createProcess(sectorId, companyId, formData);
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-lg shadow-amber-500/30">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Nuevo Proceso</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-600 ml-1">Nombre del Proceso</label>
                        <input required name="name" type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold" placeholder="Ej: Soldadura MIG" />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-600 ml-1">Descripción</label>
                        <textarea name="description" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-sm h-24 resize-none" placeholder="Descripción detallada de la operación..."></textarea>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="px-8 py-3 text-sm font-black text-white bg-amber-500 hover:bg-amber-600 disabled:opacity-50 shadow-lg shadow-amber-200 rounded-2xl transition-all">
                            {isSaving ? 'Guardando...' : 'Guardar Proceso'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
