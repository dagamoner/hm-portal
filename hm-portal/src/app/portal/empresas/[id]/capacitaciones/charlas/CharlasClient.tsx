"use client";

import React, { useState, useTransition } from "react";
import { Users, FileCheck, ClipboardCheck, ArrowLeft, Search, Check, Save } from "lucide-react";
import { createToolboxTalk } from "@/app/actions/transverse";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";

export default function CharlasClient({ companyId, initialTalks, workers }: { companyId: string, initialTalks: any[], workers: any[] }) {
    const { user, isClient } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [view, setView] = useState<'LIST' | 'NEW'>('LIST');
    const [talks, setTalks] = useState(initialTalks);
    
    // New Talk Form
    const [formData, setFormData] = useState({
        title: "",
        topic: "",
        date: new Date().toISOString().substring(0, 10),
        supervisor: user?.name || ""
    });
    
    // Selected workers for the checklist
    const [selectedWorkers, setSelectedWorkers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredWorkers = workers.filter(w => 
        (w.firstName + " " + w.lastName + " " + w.documentId).toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleWorker = (id: string) => {
        setSelectedWorkers(prev => 
            prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
        );
    };

    const selectAll = () => setSelectedWorkers(workers.map(w => w.id));
    const deselectAll = () => setSelectedWorkers([]);

    const handleCreate = () => {
        if (!formData.title || !formData.topic) {
            alert("Título y tema son obligatorios.");
            return;
        }
        if (selectedWorkers.length === 0) {
            alert("Debe marcar al menos un trabajador como presente.");
            return;
        }

        startTransition(async () => {
            const res = await createToolboxTalk(companyId, {
                ...formData,
                workerIds: selectedWorkers
            });
            if (res.success && res.talk) {
                // Fetch the new talk with relations (simulated for immediate UI update)
                const newTalk = {
                    ...res.talk,
                    signatures: selectedWorkers.map(wid => ({
                        workerId: wid,
                        worker: workers.find(w => w.id === wid),
                        signedAt: new Date()
                    }))
                };
                setTalks([newTalk, ...talks]);
                setView('LIST');
                setFormData({ title: "", topic: "", date: new Date().toISOString().substring(0, 10), supervisor: user?.name || "" });
                setSelectedWorkers([]);
            } else {
                alert(res.error || "Error al guardar.");
            }
        });
    };

    return (
        <div className="space-y-6 max-w-lg mx-auto pb-24">
            <div className="flex items-center justify-between bg-white/80 p-4 rounded-2xl backdrop-blur-xl shadow-sm border border-slate-200">
                <div className="flex items-center gap-3">
                    <Link href={`/portal/empresas/${companyId}/capacitaciones`} className="p-2 bg-slate-100 rounded-full text-slate-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 leading-tight">Charlas 5 Minutos</h2>
                        <p className="text-xs text-slate-500 font-medium">Registro rápido en campo</p>
                    </div>
                </div>
                {view === 'LIST' && !isClient && (
                    <button 
                        onClick={() => setView('NEW')}
                        className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg shadow-indigo-600/30"
                    >
                        <FileCheck className="w-5 h-5" />
                    </button>
                )}
            </div>

            {view === 'LIST' && (
                <div className="space-y-4">
                    {talks.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-white/60 rounded-3xl border border-white/50">
                            <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            <p>No hay charlas registradas.</p>
                        </div>
                    )}
                    {talks.map(talk => (
                        <div key={talk.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -z-0"></div>
                            <div className="relative z-10">
                                <h3 className="font-bold text-slate-800 text-lg">{talk.title}</h3>
                                <p className="text-sm text-slate-600 mb-3">{talk.topic}</p>
                                
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                                    <div className="text-xs text-slate-500">
                                        <p className="font-bold">{format(new Date(talk.date), "dd/MM/yyyy")}</p>
                                        <p>Sup: {talk.supervisor}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold border border-emerald-100">
                                        <Users className="w-4 h-4" />
                                        {talk.signatures?.length || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {view === 'NEW' && (
                <div className="space-y-6">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título de Charla</label>
                            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej. Uso de arnés" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tema Principal</label>
                            <input type="text" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} placeholder="Trabajos en altura" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
                                <ClipboardCheck className="w-5 h-5 text-indigo-600" />
                                Lista de Asistencia
                            </h3>
                            <div className="relative">
                                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                                <input 
                                    type="text" 
                                    placeholder="Buscar trabajador..." 
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        
                        <div className="p-2 border-b border-slate-100 flex justify-between bg-white">
                            <button onClick={selectAll} className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg">Seleccionar Todos</button>
                            <button onClick={deselectAll} className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg">Limpiar</button>
                        </div>

                        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
                            {filteredWorkers.map(w => {
                                const isSelected = selectedWorkers.includes(w.id);
                                return (
                                    <div 
                                        key={w.id} 
                                        onClick={() => toggleWorker(w.id)}
                                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors border ${
                                            isSelected 
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                                                : 'bg-white border-transparent hover:bg-slate-50'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-bold text-sm">{w.lastName}, {w.firstName}</p>
                                            <p className="text-[10px] opacity-70 text-slate-500">DNI: {w.documentId}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
                                            isSelected ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'
                                        }`}>
                                            {isSelected && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 pb-safe z-50">
                        <div className="max-w-lg mx-auto flex gap-3">
                            <button 
                                onClick={() => setView('LIST')} 
                                className="flex-1 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleCreate} 
                                disabled={isPending || selectedWorkers.length === 0}
                                className="flex-[2] py-3.5 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-600/20"
                            >
                                {isPending ? "Guardando..." : (
                                    <>
                                        <Save className="w-5 h-5" /> 
                                        Guardar ({selectedWorkers.length})
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
