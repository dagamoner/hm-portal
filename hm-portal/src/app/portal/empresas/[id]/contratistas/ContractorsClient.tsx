"use client";

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { HardHat, Plus, Search, Building, FileText, CheckCircle, XCircle, Clock, AlertTriangle, FileUp, Building2, MapPin, X } from 'lucide-react';
import { createProject, createContractor, assignContractorToProject, uploadContractorDocument, updateContractorDocumentStatus, createSafetyProgram, updateSafetyProgramStatus } from '@/app/actions/contractors';
import { useRouter } from 'next/navigation';

export default function ContractorsClient({
    projects,
    contractors,
    companyId
}: {
    projects: any[],
    contractors: any[],
    companyId: string
}) {
    const router = useRouter();
    const { canEdit, isClient } = useAuth();
    const [activeTab, setActiveTab] = useState<'projects' | 'contractors'>('projects');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Modals
    const [showNewProject, setShowNewProject] = useState(false);
    const [showNewContractor, setShowNewContractor] = useState(false);
    const [showAssignContractor, setShowAssignContractor] = useState<{projectId: string} | null>(null);
    const [showUploadDoc, setShowUploadDoc] = useState<{contractorId: string} | null>(null);
    const [showSafetyProgram, setShowSafetyProgram] = useState<{projectContractorId: string} | null>(null);

    // Form States
    const [projectForm, setProjectForm] = useState({ name: '', location: '', startDate: '', endDate: '' });
    const [contractorForm, setContractorForm] = useState({ name: '', cuit: '', contactName: '', contactPhone: '', contactEmail: '' });
    const [assignForm, setAssignForm] = useState({ contractorId: '', role: 'Subcontratista', noticeOfWork: '' });
    const [docForm, setDocForm] = useState({ name: '', type: 'Constancia ART', fileUrl: 'https://ejemplo.com/doc.pdf', notes: '' });
    const [safetyProgramForm, setSafetyProgramForm] = useState({ title: '', resolution: '35/1998', validUntil: '' });

    const handleCreateProject = async () => {
        if (!projectForm.name || !projectForm.location) return;
        await createProject(companyId, projectForm);
        setShowNewProject(false);
        setProjectForm({ name: '', location: '', startDate: '', endDate: '' });
    };

    const handleCreateContractor = async () => {
        if (!contractorForm.name || !contractorForm.cuit) return;
        await createContractor(companyId, contractorForm);
        setShowNewContractor(false);
        setContractorForm({ name: '', cuit: '', contactName: '', contactPhone: '', contactEmail: '' });
    };

    const handleAssignContractor = async () => {
        if (!showAssignContractor || !assignForm.contractorId) return;
        await assignContractorToProject(companyId, showAssignContractor.projectId, assignForm.contractorId, assignForm);
        setShowAssignContractor(null);
        setAssignForm({ contractorId: '', role: 'Subcontratista', noticeOfWork: '' });
    };

    const handleUploadDoc = async () => {
        if (!showUploadDoc || !docForm.name) return;
        await uploadContractorDocument(companyId, { contractorId: showUploadDoc.contractorId, ...docForm });
        setShowUploadDoc(null);
        setDocForm({ name: '', type: 'Constancia ART', fileUrl: 'https://ejemplo.com/doc.pdf', notes: '' });
    };

    const handleCreateSafetyProgram = async () => {
        if (!showSafetyProgram || !safetyProgramForm.title) return;
        await createSafetyProgram(companyId, { projectContractorId: showSafetyProgram.projectContractorId, ...safetyProgramForm });
        setShowSafetyProgram(null);
        setSafetyProgramForm({ title: '', resolution: '35/1998', validUntil: '' });
    };

    const getStatusIcon = (status: string) => {
        if (status === 'Aprobado') return <CheckCircle className="w-5 h-5 text-green-500" />;
        if (status === 'Rechazado') return <XCircle className="w-5 h-5 text-red-500" />;
        if (status === 'Vencido') return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        return <Clock className="w-5 h-5 text-slate-400" />;
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
            {/* Modals... (Simplified for now) */}
            {showNewProject && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Nueva Obra / Proyecto</h3>
                            <button onClick={() => setShowNewProject(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nombre de la Obra *</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={projectForm.name} onChange={e => setProjectForm({...projectForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Ubicación / Establecimiento *</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={projectForm.location} onChange={e => setProjectForm({...projectForm, location: e.target.value})} />
                            </div>
                            <button onClick={handleCreateProject} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4">Guardar Proyecto</button>
                        </div>
                    </div>
                </div>
            )}

            {showNewContractor && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Nuevo Contratista</h3>
                            <button onClick={() => setShowNewContractor(false)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Razón Social *</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={contractorForm.name} onChange={e => setContractorForm({...contractorForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">CUIT *</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={contractorForm.cuit} onChange={e => setContractorForm({...contractorForm, cuit: e.target.value})} />
                            </div>
                            <button onClick={handleCreateContractor} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4">Guardar Contratista</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Contratistas</h2>
                        <p className="text-slate-500 font-medium mt-1">Control de Obras, Avisos SRT y Programas de Seguridad.</p>
                    </div>
                    {canEdit && (
                        <div className="flex gap-3">
                            <button onClick={() => setShowNewProject(true)} className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold tracking-widest uppercase text-xs flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Nueva Obra
                            </button>
                            <button onClick={() => setShowNewContractor(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold tracking-widest uppercase text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20">
                                <Plus className="w-4 h-4" /> Nuevo Contratista
                            </button>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-200 pb-1 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('projects')}
                        className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'projects' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Building2 className="w-4 h-4" />
                        Obras y Proyectos
                    </button>
                    <button 
                        onClick={() => setActiveTab('contractors')}
                        className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'contractors' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <HardHat className="w-4 h-4" />
                        Padrón de Contratistas
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 gap-6">
                        {projects.map((proj: any) => (
                            <div key={proj.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-100">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-2">{proj.name}</h3>
                                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {proj.location}</span>
                                            <span className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold">{proj.status}</span>
                                        </div>
                                    </div>
                                    {canEdit && (
                                        <button onClick={() => setShowAssignContractor({projectId: proj.id})} className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl transition-colors border border-slate-200 flex items-center gap-1">
                                            <Plus className="w-3.5 h-3.5" /> Asignar Contratista
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Contratistas Asignados ({proj.projectContractors?.length || 0})</h4>
                                    {proj.projectContractors?.length === 0 ? (
                                        <p className="text-slate-500 text-sm">No hay contratistas asignados a esta obra.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {proj.projectContractors.map((pc: any) => (
                                                <div key={pc.id} className="border border-slate-100 bg-slate-50/50 p-4 rounded-2xl flex flex-col gap-3">
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold text-slate-900">{pc.contractor.name}</span>
                                                        <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-lg">{pc.role}</span>
                                                    </div>
                                                    <div className="text-sm text-slate-500 flex flex-col gap-1">
                                                        <span>CUIT: {pc.contractor.cuit}</span>
                                                        <span>Aviso de Obra: <strong className="text-slate-700">{pc.noticeOfWork || 'Pendiente'}</strong></span>
                                                    </div>
                                                    {/* Safety Programs */}
                                                    <div className="mt-2 pt-2 border-t border-slate-200/60">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-bold text-slate-600">Programas de Seguridad</span>
                                                            <button onClick={() => setShowSafetyProgram({projectContractorId: pc.id})} className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-700">Añadir</button>
                                                        </div>
                                                        {pc.safetyPrograms?.map((sp: any) => (
                                                            <div key={sp.id} className="flex items-center justify-between bg-white p-2 border border-slate-100 rounded-lg mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    {getStatusIcon(sp.status)}
                                                                    <div className="flex flex-col">
                                                                        <span className="text-xs font-bold text-slate-800">{sp.title} (Res. {sp.resolution})</span>
                                                                        <span className="text-[10px] text-slate-500">{sp.status}</span>
                                                                    </div>
                                                                </div>
                                                                {canEdit && sp.status === 'Pendiente' && (
                                                                    <div className="flex gap-1">
                                                                        <button onClick={() => updateSafetyProgramStatus(companyId, sp.id, 'Aprobado')} className="p-1 text-green-600 hover:bg-green-50 rounded"><CheckCircle className="w-4 h-4" /></button>
                                                                        <button onClick={() => updateSafetyProgramStatus(companyId, sp.id, 'Rechazado')} className="p-1 text-red-600 hover:bg-red-50 rounded"><XCircle className="w-4 h-4" /></button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'contractors' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {contractors.map((cont: any) => (
                            <div key={cont.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">{cont.name}</h3>
                                        <span className="text-sm font-medium text-slate-500">CUIT: {cont.cuit}</span>
                                    </div>
                                </div>
                                <div className="flex-1 mt-4">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold text-slate-800">Documentación y Legajo Técnico</h4>
                                        <button onClick={() => setShowUploadDoc({contractorId: cont.id})} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                                            <FileUp className="w-3.5 h-3.5" /> Subir
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {cont.documents?.map((doc: any) => (
                                            <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <FileText className="w-5 h-5 text-slate-400" />
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-700">{doc.name}</span>
                                                        <span className="text-xs text-slate-500">{doc.type} • {doc.status}</span>
                                                    </div>
                                                </div>
                                                {canEdit && doc.status === 'Pendiente' && (
                                                    <div className="flex gap-1">
                                                        <button onClick={() => updateContractorDocumentStatus(companyId, doc.id, 'Aprobado')} className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                                                        <button onClick={() => updateContractorDocumentStatus(companyId, doc.id, 'Rechazado')} className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"><XCircle className="w-4 h-4" /></button>
                                                    </div>
                                                )}
                                                {doc.status === 'Aprobado' && <CheckCircle className="w-5 h-5 text-green-500 mr-2" />}
                                                {doc.status === 'Rechazado' && <XCircle className="w-5 h-5 text-red-500 mr-2" />}
                                            </div>
                                        ))}
                                        {(!cont.documents || cont.documents.length === 0) && (
                                            <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">No hay documentos subidos</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Other Modals for Assigning, Docs and Safety Programs would be here following the same pattern */}
            {showAssignContractor && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Asignar Contratista a Obra</h3>
                            <button onClick={() => setShowAssignContractor(null)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Contratista *</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={assignForm.contractorId} onChange={e => setAssignForm({...assignForm, contractorId: e.target.value})}>
                                    <option value="">Seleccione...</option>
                                    {contractors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Nº Aviso de Obra (Res 51/97)</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={assignForm.noticeOfWork} onChange={e => setAssignForm({...assignForm, noticeOfWork: e.target.value})} />
                            </div>
                            <button onClick={handleAssignContractor} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4">Confirmar Asignación</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showSafetyProgram && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Cargar Programa de Seguridad</h3>
                            <button onClick={() => setShowSafetyProgram(null)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Título del Programa *</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" placeholder="Ej: Prog. Seguridad Tareas de Montaje" value={safetyProgramForm.title} onChange={e => setSafetyProgramForm({...safetyProgramForm, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Resolución</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={safetyProgramForm.resolution} onChange={e => setSafetyProgramForm({...safetyProgramForm, resolution: e.target.value})}>
                                    <option value="35/1998">S.R.T. 35/1998 (Prog. Único)</option>
                                    <option value="319/1999">S.R.T. 319/1999 (Const. Repetitivas)</option>
                                </select>
                            </div>
                            <button onClick={handleCreateSafetyProgram} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4">Registrar Programa</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showUploadDoc && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Subir Documentación</h3>
                            <button onClick={() => setShowUploadDoc(null)}><X className="w-5 h-5 text-slate-400" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">Nombre del Archivo *</label>
                                <input className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={docForm.name} onChange={e => setDocForm({...docForm, name: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">Tipo de Documento</label>
                                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" value={docForm.type} onChange={e => setDocForm({...docForm, type: e.target.value})}>
                                    <option value="Constancia ART">Constancia ART</option>
                                    <option value="Clausula No Repeticion">Clausula de No Repetición</option>
                                    <option value="Alta AFIP">Alta AFIP (F.931)</option>
                                    <option value="Legajo Tecnico">Legajo Técnico</option>
                                </select>
                            </div>
                            <button onClick={handleUploadDoc} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4">Subir Archivo</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
