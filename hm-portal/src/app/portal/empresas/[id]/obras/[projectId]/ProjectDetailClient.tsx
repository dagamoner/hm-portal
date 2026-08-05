"use client";

import React, { useState, useTransition } from "react";
import { 
    Construction, ArrowLeft, Calendar, MapPin, HardHat, 
    FileText, Plus, Trash2, CheckCircle2, AlertCircle, Save, X, UserPlus, FileUp, Eye, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { addWorkerToProject, removeWorkerFromProject, createProjectDocument, deleteProjectDocument } from "@/app/actions/projects";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PSOClient from "./PSOClient";
import AvisoInicioClient from "./AvisoInicioClient";

export default function ProjectDetailClient({ companyId, project, companyWorkers }: { companyId: string, project: any, companyWorkers: any[] }) {
    const [activeTab, setActiveTab] = useState<'workers' | 'pso' | 'aviso' | 'pliegos'>('workers');
    const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const assignedWorkerIds = new Set(project.workers?.map((w: any) => w.id) || []);
    const availableWorkers = companyWorkers.filter(w => !assignedWorkerIds.has(w.id));

    const [docData, setDocData] = useState({
        type: "PROGRAMA_SEGURIDAD_911",
        title: "",
        fileUrl: "",
        status: "Presentado",
        validUntil: ""
    });

    const handleAssignWorker = (workerId: string) => {
        startTransition(async () => {
            await addWorkerToProject(project.id, workerId);
            setIsWorkerModalOpen(false);
        });
    };

    const handleRemoveWorker = (workerId: string) => {
        if(confirm("¿Quitar a este trabajador de la obra?")) {
            startTransition(async () => {
                await removeWorkerFromProject(project.id, workerId);
            });
        }
    };

    const handleSaveDoc = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(docData).forEach(([k, v]) => formData.append(k, String(v)));
        
        startTransition(async () => {
            const res = await createProjectDocument(project.id, formData);
            if (res.success) {
                setIsDocModalOpen(false);
                setDocData({ type: "PROGRAMA_SEGURIDAD_911", title: "", fileUrl: "", status: "Presentado", validUntil: "" });
            }
        });
    };

    const handleDeleteDoc = (docId: string) => {
        if(confirm("¿Eliminar este documento de forma permanente?")) {
            startTransition(async () => {
                await deleteProjectDocument(docId);
            });
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center gap-4">
                <Link 
                    href={`/portal/empresas/${companyId}/obras`}
                    className="p-3 bg-white/60 hover:bg-white text-slate-500 hover:text-indigo-600 rounded-2xl transition-all shadow-sm border border-white/50 backdrop-blur-xl"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1 bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-indigo-200">
                                {project.status}
                            </span>
                            <h2 className="text-2xl font-bold text-slate-800">{project.name}</h2>
                        </div>
                        <div className="flex items-center gap-6 mt-3 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {project.location}</div>
                            {project.clientName && <div className="flex items-center gap-2"><UserPlus className="w-4 h-4 text-slate-400" /> Comitente: {project.clientName}</div>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                <button 
                    onClick={() => setActiveTab('workers')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                        activeTab === 'workers' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/60 text-slate-600 hover:bg-white'
                    }`}
                >
                    <HardHat className="w-5 h-5" /> Personal Asignado ({project.workers?.length || 0})
                </button>
                <button 
                    onClick={() => setActiveTab('pso')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                        activeTab === 'pso' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/60 text-slate-600 hover:bg-white'
                    }`}
                >
                    <ShieldCheck className="w-5 h-5" /> P.S.O.
                </button>
                <button 
                    onClick={() => setActiveTab('aviso')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                        activeTab === 'aviso' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/60 text-slate-600 hover:bg-white'
                    }`}
                >
                    <FileText className="w-5 h-5" /> Aviso de Inicio
                </button>
                <button 
                    onClick={() => setActiveTab('pliegos')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                        activeTab === 'pliegos' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/60 text-slate-600 hover:bg-white'
                    }`}
                >
                    <FileText className="w-5 h-5" /> Pliegos y Anexos ({project.documents?.length || 0})
                </button>
            </div>

            {activeTab === 'workers' && (
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <HardHat className="w-5 h-5 text-indigo-500" />
                            Trabajadores en Obra
                        </h3>
                        <button 
                            onClick={() => setIsWorkerModalOpen(true)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Asignar Personal
                        </button>
                    </div>
                    <div className="p-6">
                        {project.workers?.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <HardHat className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>No hay trabajadores asignados a esta obra.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.workers?.map((worker: any) => (
                                    <div key={worker.id} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                {worker.firstName.charAt(0)}{worker.lastName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{worker.lastName}, {worker.firstName}</p>
                                                <p className="text-xs text-slate-500">DNI: {worker.documentId}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveWorker(worker.id)}
                                            disabled={isPending}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'pso' && (
                <PSOClient project={project} />
            )}

            {activeTab === 'aviso' && (
                <AvisoInicioClient project={project} company={project.company || { name: 'Empresa', cuit: '00-00000000-0' }} />
            )}

            {activeTab === 'pliegos' && (
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                Pliegos y Anexos (Control de Versiones)
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Sube versiones de los pliegos de condiciones. El sistema mantendrá el historial de versiones.</p>
                        </div>
                        <button 
                            onClick={() => setIsDocModalOpen(true)}
                            className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                        >
                            <FileUp className="w-4 h-4" /> Nuevo Documento
                        </button>
                    </div>
                    <div className="p-6">
                        {project.documents?.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                <p>No hay pliegos ni anexos cargados.</p>
                                <p className="text-sm mt-1">Sube el primer pliego de condiciones o documento anexo.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {project.documents?.map((doc: any) => (
                                    <div key={doc.id} className="bg-white border border-slate-100 p-5 rounded-2xl flex justify-between">
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">
                                                {doc.type.replace(/_/g, ' ')}
                                            </span>
                                            <h4 className="font-bold text-slate-800 mt-1">{doc.title}</h4>
                                            <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                                <span className={`px-2 py-1 rounded-md border font-bold ${
                                                    doc.status === 'Aprobado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                    doc.status === 'Observado' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                                                }`}>
                                                    {doc.status}
                                                </span>
                                                <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                                                    v{doc.version || 1}.0
                                                </span>
                                                {doc.validUntil && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> Vence: {format(new Date(doc.validUntil), "dd/MM/yyyy")}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {doc.fileUrl && (
                                                <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors" title="Ver Documento">
                                                    <Eye className="w-4 h-4" />
                                                </a>
                                            )}
                                            <button 
                                                onClick={() => handleDeleteDoc(doc.id)}
                                                disabled={isPending}
                                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Asignar Personal */}
            {isWorkerModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsWorkerModalOpen(false)}></div>
                    <div className="relative bg-white border border-slate-100 rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <UserPlus className="w-5 h-5 text-indigo-600" /> Asignar Personal
                            </h3>
                            <button onClick={() => setIsWorkerModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {availableWorkers.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">Todo el personal ya está asignado a esta obra.</p>
                            ) : (
                                <div className="space-y-3">
                                    {availableWorkers.map(w => (
                                        <div key={w.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                                            <div>
                                                <p className="font-bold text-slate-800 text-sm">{w.lastName}, {w.firstName}</p>
                                                <p className="text-xs text-slate-500">DNI: {w.documentId}</p>
                                            </div>
                                            <button 
                                                onClick={() => handleAssignWorker(w.id)}
                                                disabled={isPending}
                                                className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold disabled:opacity-50 transition-colors"
                                            >
                                                Asignar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Subir Documento */}
            {isDocModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDocModalOpen(false)}></div>
                    <div className="relative bg-white border border-slate-100 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <FileUp className="w-5 h-5 text-indigo-600" /> Subir Documento
                            </h3>
                            <button onClick={() => setIsDocModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        <div className="p-6">
                            <form id="doc-form" onSubmit={handleSaveDoc} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tipo de Documento</label>
                                    <select value={docData.type} onChange={(e) => setDocData({...docData, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-sm">
                                        <option value="PLIEGO">Pliego de Condiciones HyS</option>
                                        <option value="ANEXO">Documento Anexo</option>
                                        <option value="OTRO">Otro</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Título / Descripción</label>
                                    <input required type="text" value={docData.title} onChange={(e) => setDocData({...docData, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">URL del Archivo (Temporal)</label>
                                    <input type="url" value={docData.fileUrl} onChange={(e) => setDocData({...docData, fileUrl: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" placeholder="https://" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Estado</label>
                                    <select value={docData.status} onChange={(e) => setDocData({...docData, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-white text-sm">
                                        <option value="Presentado">Presentado</option>
                                        <option value="Observado">Observado</option>
                                        <option value="Aprobado">Aprobado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Fecha de Vencimiento (Opcional)</label>
                                    <input type="date" value={docData.validUntil} onChange={(e) => setDocData({...docData, validUntil: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setIsDocModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600">Cancelar</button>
                            <button type="submit" form="doc-form" disabled={isPending} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all disabled:opacity-50">
                                {isPending ? 'Guardando...' : 'Guardar Documento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
