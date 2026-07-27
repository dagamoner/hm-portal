"use client";

import { useState } from "react";
import { X, Briefcase } from "lucide-react";
import { createJobRole } from "@/app/actions/risks";

export default function JobRoleModal({ processId, companyId, onClose }: { processId: string, companyId: string, onClose: () => void }) {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        await createJobRole(processId, companyId, formData);
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-sky-500 rounded-2xl text-white shadow-lg shadow-sky-500/30">
                            <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Nuevo Puesto de Trabajo</h3>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSave} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-slate-600 ml-1">Nombre del Puesto</label>
                        <input required name="name" type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold" placeholder="Ej: Operador de Soldadura" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-600 ml-1">Trabajadores</label>
                            <input name="personnelCount" type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-center" placeholder="1" defaultValue={1} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-slate-600 ml-1">Turnos</label>
                            <input name="shifts" type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold text-center" placeholder="TM / TT / TN" />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">Cancelar</button>
                        <button type="submit" disabled={isSaving} className="px-8 py-3 text-sm font-black text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-50 shadow-lg shadow-sky-200 rounded-2xl transition-all">
                            {isSaving ? 'Guardando...' : 'Guardar Puesto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
