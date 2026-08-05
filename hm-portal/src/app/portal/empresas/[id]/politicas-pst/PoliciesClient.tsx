"use client";

import React, { useState, useTransition } from "react";
import { Plus, Book, Save, Trash2, CheckSquare, Users } from "lucide-react";
import { createPolicy, signPolicy, deletePolicy } from "@/app/actions/pst-policies";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function PoliciesClient({ companyId, initialPolicies, workers }: { companyId: string, initialPolicies: any[], workers: any[] }) {
    const [isPending, startTransition] = useTransition();
    const [isCreating, setIsCreating] = useState(false);
    
    const [formData, setFormData] = useState({
        type: "HYS",
        title: "",
        content: ""
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await createPolicy(companyId, formData);
            setIsCreating(false);
            setFormData({ type: "HYS", title: "", content: "" });
        });
    };

    const handleDelete = (id: string) => {
        if(confirm("¿Eliminar esta política? Se perderán las firmas asociadas.")) {
            startTransition(async () => {
                await deletePolicy(id);
            });
        }
    };

    const handleSign = (policyId: string, workerId: string) => {
        startTransition(async () => {
            await signPolicy(policyId, workerId);
        });
    };

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Book className="w-5 h-5 text-indigo-500" />
                    Políticas Institucionales
                </h3>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nueva Política
                </button>
            </div>

            {isCreating && (
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <form onSubmit={handleCreate} className="space-y-4 max-w-3xl">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tipo de Política</label>
                                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                    <option value="HYS">Higiene y Seguridad</option>
                                    <option value="ALCOHOL_DROGAS">Alcohol y Drogas</option>
                                    <option value="VIOLENCIA_LABORAL">Violencia Laboral / Acoso</option>
                                    <option value="AMBIENTAL">Política Ambiental</option>
                                    <option value="OTRA">Otra</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Título</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej. Política de Prevención Cero Accidentes" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Contenido de la Política</label>
                            <textarea required rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} placeholder="Redacte aquí la política completa..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
                            <button type="submit" disabled={isPending} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2">
                                <Save className="w-4 h-4" /> Guardar Política
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="p-6 space-y-6">
                {initialPolicies.length === 0 && !isCreating && (
                    <div className="text-center py-12 text-slate-500">
                        <Book className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p>No hay políticas registradas.</p>
                        <p className="text-sm mt-1">Crea la primera política para que el personal pueda firmarla.</p>
                    </div>
                )}

                {initialPolicies.map((policy: any) => (
                    <div key={policy.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-indigo-100 mb-2 inline-block">
                                    {policy.type.replace(/_/g, ' ')}
                                </span>
                                <h4 className="text-xl font-bold text-slate-800">{policy.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">Publicada el {format(new Date(policy.createdAt), "dd 'de' MMMM, yyyy", { locale: es })}</p>
                            </div>
                            <button onClick={() => handleDelete(policy.id)} disabled={isPending} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 bg-slate-50/50">
                            <p className="text-sm text-slate-600 whitespace-pre-wrap">{policy.content}</p>
                        </div>
                        
                        {/* Firmas Area */}
                        <div className="p-6 border-t border-slate-100">
                            <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-indigo-500" /> Registro de Firmas (Lectura y Aceptación)</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {workers.map(worker => {
                                    const hasSigned = policy.signatures.some((sig: any) => sig.workerId === worker.id);
                                    const signatureData = policy.signatures.find((sig: any) => sig.workerId === worker.id);
                                    
                                    return (
                                        <div key={worker.id} className={`p-4 border rounded-2xl flex justify-between items-center transition-all ${hasSigned ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-white'}`}>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{worker.lastName}, {worker.firstName}</p>
                                                <p className="text-xs text-slate-500">DNI: {worker.documentId}</p>
                                                {hasSigned && (
                                                    <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-wider">
                                                        Firmado el {format(new Date(signatureData.signedAt), "dd/MM/yyyy HH:mm")}
                                                    </p>
                                                )}
                                            </div>
                                            {!hasSigned ? (
                                                <button 
                                                    onClick={() => handleSign(policy.id, worker.id)}
                                                    disabled={isPending}
                                                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    Registrar Firma
                                                </button>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                                    <CheckSquare className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
