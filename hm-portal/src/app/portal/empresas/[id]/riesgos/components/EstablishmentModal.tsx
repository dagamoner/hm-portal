"use client";

import { useState } from "react";
import { X, Building2, MapPin, Layers, LayoutTemplate } from "lucide-react";
import { createEstablishment } from "@/app/actions/risks";

export default function EstablishmentModal({ companyId, onClose }: { companyId: string, onClose: () => void }) {
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'BASIC' | 'LEGAL'>('BASIC');

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        const formData = new FormData(e.currentTarget);
        await createEstablishment(companyId, formData);
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-800">Nuevo Establecimiento</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Gestión de Inventario</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* TABS */}
                <div className="flex px-6 pt-4 space-x-6 border-b border-slate-100 bg-slate-50/50">
                    <button 
                        onClick={() => setActiveTab('BASIC')}
                        className={`pb-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'BASIC' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Datos Básicos
                    </button>
                    <button 
                        onClick={() => setActiveTab('LEGAL')}
                        className={`pb-4 text-xs font-black uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'LEGAL' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                    >
                        Detalles Legales <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full text-[9px]">(Próximamente)</span>
                    </button>
                </div>

                <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    {activeTab === 'BASIC' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase text-slate-600 ml-1">Nombre del Establecimiento</label>
                                <input required name="name" type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" placeholder="Ej: Planta Industrial Norte" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Dirección</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input name="address" type="text" className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm" placeholder="Av. Siempre Viva 742" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Tipo / Uso</label>
                                    <input name="type" type="text" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm" placeholder="Fábrica / Oficinas / Depósito" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Sup. Cubierta (m²)</label>
                                    <input name="coveredArea" type="number" step="0.1" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-center" placeholder="1500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Sup. Descub. (m²)</label>
                                    <input name="uncoveredArea" type="number" step="0.1" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-center" placeholder="500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-600 ml-1">Plantas / Niveles</label>
                                    <input name="floors" type="number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm text-center" placeholder="1" />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'LEGAL' && (
                        <div className="h-64 flex flex-col items-center justify-center text-center animate-in fade-in opacity-50">
                            <LayoutTemplate className="w-12 h-12 text-slate-300 mb-3" />
                            <h4 className="text-sm font-black text-slate-600">En Construcción</h4>
                            <p className="text-xs font-medium text-slate-400 mt-1 max-w-xs">
                                Aquí se ubicarán los formularios para Régimen Normativo, Organización, Dotación y Funcionamiento.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                        <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all">Cancelar</button>
                        <button type="submit" disabled={isSaving || activeTab === 'LEGAL'} className="px-8 py-3 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-lg shadow-indigo-200 rounded-2xl transition-all flex items-center gap-2">
                            {isSaving ? 'Guardando...' : 'Guardar Establecimiento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
