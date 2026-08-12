"use client";

import React, { useState, useTransition } from "react";
import { Plus, CheckCircle2, ShieldCheck, FileText, Trash2, Save, X, Calendar, Edit2, FileUp } from "lucide-react";
import { createPSO, updatePSO, createPSOStage, deletePSOStage } from "@/app/actions/projects-pso";

export default function PSOClient({ project, onOpenUploadModal, onDeleteDoc, isPending: parentIsPending }: { project: any, onOpenUploadModal?: () => void, onDeleteDoc?: (id: string) => void, isPending?: boolean }) {
    const [isPending, startTransition] = useTransition();
    const [isCreatingPSO, setIsCreatingPSO] = useState(false);
    const [isCreatingStage, setIsCreatingStage] = useState(false);

    // Initial PSO Draft state
    const [psoForm, setPsoForm] = useState({ art: "", hysResponsible: "" });
    // Stage form
    const [stageForm, setStageForm] = useState({ name: "", description: "", risks: "", preventions: "" });

    // Active PSO (assuming 1 active PSO per project for simplicity)
    const activePso = project.psos?.[0];

    const handleCreatePSO = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await createPSO(project.id, psoForm);
            setIsCreatingPSO(false);
        });
    };

    const handleUpdateStatus = (status: string) => {
        if(!activePso) return;
        startTransition(async () => {
            let dispositionNum = activePso.dispositionNum;
            if(status === 'Aprobado') {
                dispositionNum = prompt("Ingrese el número de Disposición de Aprobación de la ART:");
                if(!dispositionNum) return;
            }
            await updatePSO(activePso.id, { status, dispositionNum, approvalDate: status === 'Aprobado' ? new Date().toISOString() : undefined });
        });
    };

    const handleAddStage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!activePso) return;
        startTransition(async () => {
            await createPSOStage(activePso.id, stageForm);
            setIsCreatingStage(false);
            setStageForm({ name: "", description: "", risks: "", preventions: "" });
        });
    };

    const handleDeleteStage = (stageId: string) => {
        if(confirm("¿Eliminar esta etapa?")) {
            startTransition(async () => {
                await deletePSOStage(stageId);
            });
        }
    };

    const psoDocs = project.documents?.filter((d: any) => d.type === 'PROGRAMA_SEGURIDAD_911') || [];

    if (!activePso && !isCreatingPSO && psoDocs.length === 0) {
        return (
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 p-12 text-center">
                <ShieldCheck className="w-16 h-16 mx-auto text-indigo-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Programa de Seguridad de Obra (PSO)</h3>
                <p className="text-slate-500 mb-6 max-w-md mx-auto">No hay un Programa de Seguridad redactado o subido para esta obra.</p>
                <div className="flex items-center justify-center gap-4">
                    <button 
                        onClick={() => setIsCreatingPSO(true)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" /> Iniciar Redacción Digital
                    </button>
                    {onOpenUploadModal && (
                        <button onClick={onOpenUploadModal} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold shadow-sm transition-all flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" /> Subir PSO Existente
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (isCreatingPSO && !activePso) {
        return (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-indigo-600" /> Datos Generales del Programa
                </h3>
                <form onSubmit={handleCreatePSO} className="space-y-4 max-w-xl">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">A.R.T.</label>
                        <input required type="text" value={psoForm.art} onChange={e => setPsoForm({...psoForm, art: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Ej. Prevención ART" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Responsable de Higiene y Seguridad</label>
                        <input required type="text" value={psoForm.hysResponsible} onChange={e => setPsoForm({...psoForm, hysResponsible: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Nombre y Matrícula" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsCreatingPSO(false)} className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
                        <button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50">
                            <Save className="w-4 h-4" /> Guardar y Continuar
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {activePso && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-slate-800">Programa de Seguridad (Dec. 911/96)</h3>
                            <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                                activePso.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                activePso.status === 'Observado' ? 'bg-red-50 text-red-700 border-red-200' :
                                activePso.status === 'Presentado' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                                {activePso.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500"><strong>ART:</strong> {activePso.art} &bull; <strong>Resp. HyS:</strong> {activePso.hysResponsible}</p>
                        {activePso.dispositionNum && <p className="text-sm text-emerald-600 font-medium mt-1">Disposición Aprobación Nº: {activePso.dispositionNum}</p>}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        {activePso.status === 'Borrador' && (
                            <button onClick={() => handleUpdateStatus('Presentado')} disabled={isPending} className="px-4 py-2 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-100 transition-colors">
                                Marcar como Presentado a ART
                            </button>
                        )}
                        {activePso.status === 'Presentado' && (
                            <>
                                <button onClick={() => handleUpdateStatus('Aprobado')} disabled={isPending} className="px-4 py-2 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg hover:bg-emerald-100 transition-colors">
                                    Registrar Aprobación
                                </button>
                                <button onClick={() => handleUpdateStatus('Observado')} disabled={isPending} className="px-4 py-2 bg-red-50 text-red-700 font-bold text-xs rounded-lg hover:bg-red-100 transition-colors">
                                    Marcar como Observado
                                </button>
                            </>
                        )}
                        {(activePso.status === 'Aprobado' || activePso.status === 'Observado') && (
                            <button onClick={() => handleUpdateStatus('Borrador')} disabled={isPending} className="px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-200 transition-colors">
                                Volver a Borrador
                            </button>
                        )}
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Etapas Constructivas</h4>
                        <button onClick={() => setIsCreatingStage(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all">
                            <Plus className="w-4 h-4" /> Añadir Etapa
                        </button>
                    </div>

                    {isCreatingStage && (
                        <form onSubmit={handleAddStage} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl mb-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Etapa</label>
                                <input required type="text" value={stageForm.name} onChange={e => setStageForm({...stageForm, name: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Ej. Movimiento de Suelos" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Riesgos Principales</label>
                                    <textarea required rows={3} value={stageForm.risks} onChange={e => setStageForm({...stageForm, risks: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Caídas, atrapamientos..." />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">Medidas Preventivas</label>
                                    <textarea required rows={3} value={stageForm.preventions} onChange={e => setStageForm({...stageForm, preventions: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Uso de EPP, vallado perimetral..." />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsCreatingStage(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-200 rounded-lg">Cancelar</button>
                                <button type="submit" disabled={isPending} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold disabled:opacity-50 flex items-center gap-2"><Save className="w-4 h-4" /> Guardar Etapa</button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-4">
                        {activePso.stages?.map((stage: any, idx: number) => (
                            <div key={stage.id} className="border border-slate-100 rounded-2xl p-5 hover:shadow-md transition-shadow relative group">
                                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDeleteStage(stage.id)} disabled={isPending} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                                <h5 className="font-black text-slate-800 text-lg mb-3"><span className="text-indigo-400">0{idx + 1}.</span> {stage.name}</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                                        <h6 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Riesgos</h6>
                                        <p className="text-sm text-slate-600 whitespace-pre-line">{stage.risks}</p>
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                        <h6 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Medidas Preventivas</h6>
                                        <p className="text-sm text-slate-600 whitespace-pre-line">{stage.preventions}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {activePso.stages?.length === 0 && !isCreatingStage && (
                            <p className="text-center text-slate-500 py-6">Comienza a desglosar las etapas de trabajo de la obra para construir tu PSO.</p>
                        )}
                    </div>
                </div>
            </div>
            )}

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden mt-6">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            PSOs Subidos / Adjuntos
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Documentos PDF o links adjuntados como Programa de Seguridad.</p>
                    </div>
                    {onOpenUploadModal && (
                        <button onClick={onOpenUploadModal} className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
                            <FileUp className="w-4 h-4" /> {psoDocs.length > 0 ? 'Subir Otro' : 'Subir Documento / Link'}
                        </button>
                    )}
                </div>
                <div className="p-6">
                    {psoDocs.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">
                            <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                            <p>No hay PSOs subidos manualmente o links externos guardados.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {psoDocs.map((doc: any) => (
                                <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between">
                                    <div>
                                        <h4 className="font-bold text-slate-800">{doc.title}</h4>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                            <span className="px-2 py-1 rounded-md border font-bold bg-amber-50 text-amber-700 border-amber-200">
                                                {doc.status}
                                            </span>
                                            {doc.validUntil && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Vence: {new Date(doc.validUntil).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {doc.fileUrl && (
                                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors" title="Ver Documento">
                                                <FileText className="w-4 h-4" />
                                            </a>
                                        )}
                                        {onDeleteDoc && (
                                            <button 
                                                onClick={() => onDeleteDoc(doc.id)}
                                                disabled={parentIsPending}
                                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
