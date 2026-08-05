"use client";

import React, { useState, useTransition } from "react";
import { Plus, ShieldAlert, Save, Trash2, CheckSquare, ListPlus, Link as LinkIcon, Unlink } from "lucide-react";
import { createPST, updatePST, deletePST, linkTaskToPST, unlinkTaskFromPST } from "@/app/actions/pst-policies";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function PSTClient({ companyId, initialPSTs, tasks }: { companyId: string, initialPSTs: any[], tasks: any[] }) {
    const [isPending, startTransition] = useTransition();
    const [isCreating, setIsCreating] = useState(false);
    
    // Default PST template structure
    const emptySteps = [{ step: "", risks: "", controls: "" }];
    
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        content: JSON.stringify(emptySteps)
    });
    
    const [editingSteps, setEditingSteps] = useState(emptySteps);

    const handleAddStep = () => {
        setEditingSteps([...editingSteps, { step: "", risks: "", controls: "" }]);
    };

    const handleUpdateStep = (index: number, field: string, value: string) => {
        const newSteps = [...editingSteps];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setEditingSteps(newSteps);
    };

    const handleRemoveStep = (index: number) => {
        const newSteps = editingSteps.filter((_, i) => i !== index);
        setEditingSteps(newSteps);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            await createPST(companyId, {
                title: formData.title,
                description: formData.description,
                content: editingSteps
            });
            setIsCreating(false);
            setFormData({ title: "", description: "", content: JSON.stringify(emptySteps) });
            setEditingSteps(emptySteps);
        });
    };

    const handleDelete = (id: string) => {
        if(confirm("¿Eliminar este Procedimiento Seguro de Trabajo?")) {
            startTransition(async () => {
                await deletePST(id);
            });
        }
    };

    const handleUpdateStatus = (id: string, status: string) => {
        startTransition(async () => {
            await updatePST(id, { status });
        });
    };

    const handleLinkTask = (pstId: string, taskId: string) => {
        if(!taskId) return;
        startTransition(async () => {
            await linkTaskToPST(pstId, taskId);
        });
    };

    const handleUnlinkTask = (pstId: string, taskId: string) => {
        startTransition(async () => {
            await unlinkTaskFromPST(pstId, taskId);
        });
    };

    return (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-indigo-500" />
                        Procedimientos Seguros de Trabajo (PST / ATS)
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Crea procedimientos paso a paso y vincúlalos a las tareas de la Matriz de Riesgos.</p>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Nuevo PST
                </button>
            </div>

            {isCreating && (
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Título del Procedimiento</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ej. Trabajo en Altura con Andamios" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Descripción / Alcance</label>
                                <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Aplicable al sector de mantenimiento..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Pasos del Procedimiento (ATS)</label>
                                <button type="button" onClick={handleAddStep} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 flex items-center gap-1">
                                    <ListPlus className="w-3 h-3" /> Añadir Paso
                                </button>
                            </div>
                            <div className="space-y-3">
                                {editingSteps.map((step, idx) => (
                                    <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl flex gap-3 relative group">
                                        <div className="font-black text-slate-300 text-xl pt-1">{(idx+1).toString().padStart(2, '0')}</div>
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Paso a realizar</label>
                                                <textarea required rows={2} value={step.step} onChange={(e) => handleUpdateStep(idx, 'step', e.target.value)} className="w-full text-sm p-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500" placeholder="Descripción de la tarea paso a paso" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-rose-500 uppercase mb-1">Peligros / Riesgos</label>
                                                <textarea required rows={2} value={step.risks} onChange={(e) => handleUpdateStep(idx, 'risks', e.target.value)} className="w-full text-sm p-2 border border-rose-200 bg-rose-50 rounded-lg focus:ring-1 focus:ring-rose-500" placeholder="¿Qué puede salir mal?" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-emerald-500 uppercase mb-1">Controles / EPP</label>
                                                <textarea required rows={2} value={step.controls} onChange={(e) => handleUpdateStep(idx, 'controls', e.target.value)} className="w-full text-sm p-2 border border-emerald-200 bg-emerald-50 rounded-lg focus:ring-1 focus:ring-emerald-500" placeholder="Medidas preventivas" />
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => handleRemoveStep(idx)} className="absolute -right-2 -top-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end border-t border-slate-200 pt-4 mt-6">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
                            <button type="submit" disabled={isPending} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2">
                                <Save className="w-4 h-4" /> Guardar Procedimiento
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="p-6 space-y-6">
                {initialPSTs.length === 0 && !isCreating && (
                    <div className="text-center py-12 text-slate-500">
                        <ShieldAlert className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p>No hay procedimientos seguros de trabajo.</p>
                        <p className="text-sm mt-1">Crea procedimientos detallados paso a paso para tus tareas críticas.</p>
                    </div>
                )}

                {initialPSTs.map((pst: any) => {
                    let parsedContent = [];
                    try { parsedContent = typeof pst.content === 'string' ? JSON.parse(pst.content) : pst.content; } catch(e) {}
                    
                    return (
                        <div key={pst.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="text-xl font-bold text-slate-800">{pst.title}</h4>
                                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                                            pst.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                            pst.status === 'Revisión' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                            {pst.status}
                                        </span>
                                        <span className="px-2 py-1 text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg">v{pst.version}.0</span>
                                    </div>
                                    <p className="text-sm text-slate-600">{pst.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {pst.status === 'Borrador' && (
                                        <button onClick={() => handleUpdateStatus(pst.id, 'Revisión')} disabled={isPending} className="px-3 py-1.5 bg-amber-50 text-amber-700 font-bold text-xs rounded-lg hover:bg-amber-100">Enviar a Revisión</button>
                                    )}
                                    {pst.status === 'Revisión' && (
                                        <button onClick={() => handleUpdateStatus(pst.id, 'Aprobado')} disabled={isPending} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg hover:bg-emerald-100">Aprobar PST</button>
                                    )}
                                    <button onClick={() => handleDelete(pst.id)} disabled={isPending} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6 border-b border-slate-100">
                                <h5 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><ListPlus className="w-4 h-4 text-indigo-500" /> Secuencia de Trabajo Seguro</h5>
                                <div className="space-y-3">
                                    {Array.isArray(parsedContent) && parsedContent.map((step: any, idx: number) => (
                                        <div key={idx} className="flex gap-4 p-3 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                                            <div className="font-black text-slate-300 pt-1">{(idx+1).toString().padStart(2, '0')}</div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Paso</div>
                                                    <p className="text-sm font-medium text-slate-700">{step.step}</p>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Peligros</div>
                                                    <p className="text-sm text-slate-600">{step.risks}</p>
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-1">Controles</div>
                                                    <p className="text-sm text-slate-600">{step.controls}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vinculación con Tareas */}
                            <div className="p-6 bg-slate-50/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="font-bold text-slate-800 flex items-center gap-2"><LinkIcon className="w-4 h-4 text-indigo-500" /> Tareas Vinculadas (Matriz de Riesgos)</h5>
                                    
                                    <div className="flex items-center gap-2">
                                        <select 
                                            id={`task-select-${pst.id}`}
                                            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="">Seleccionar Tarea para vincular...</option>
                                            {tasks.filter(t => !pst.tasks.some((pt:any) => pt.id === t.id)).map(t => (
                                                <option key={t.id} value={t.id}>{t.name}</option>
                                            ))}
                                        </select>
                                        <button 
                                            onClick={() => {
                                                const select = document.getElementById(`task-select-${pst.id}`) as HTMLSelectElement;
                                                handleLinkTask(pst.id, select.value);
                                                select.value = "";
                                            }}
                                            disabled={isPending}
                                            className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700"
                                        >
                                            Vincular
                                        </button>
                                    </div>
                                </div>
                                
                                {pst.tasks.length === 0 ? (
                                    <p className="text-sm text-slate-500">Este PST no está vinculado a ninguna tarea de la matriz.</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {pst.tasks.map((task: any) => (
                                            <div key={task.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm shadow-sm">
                                                <span className="font-medium text-slate-700">{task.name}</span>
                                                <button onClick={() => handleUnlinkTask(pst.id, task.id)} disabled={isPending} className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <Unlink className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
