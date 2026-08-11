"use client";

import React, { useState, useTransition } from "react";
import { 
    Construction, Plus, Search, Calendar, MapPin, HardHat, CheckCircle2,
    Eye, Edit2, Trash2, Save, X, Activity, UserPlus 
} from "lucide-react";
import { createProject, updateProject, deleteProject } from "@/app/actions/projects";
import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function ObrasClient({ companyId, initialProjects }: { companyId: string, initialProjects: any[] }) {
    const [projects, setProjects] = useState(initialProjects);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any | null>(null);
    const [isPending, startTransition] = useTransition();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        clientName: "",
        surfaceArea: "",
        startDate: "",
        endDate: "",
        status: "Planificación",
        description: "",
        progress: 0
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)));

        startTransition(async () => {
            if (editingProject) {
                const res = await updateProject(editingProject.id, data);
                if (res.success) {
                    setProjects(projects.map(p => p.id === editingProject.id ? res.project : p));
                }
            } else {
                const res = await createProject(companyId, data);
                if (res.success) {
                    window.location.reload();
                }
            }
            setIsModalOpen(false);
            setEditingProject(null);
        });
    };

    const confirmDelete = (projectId: string) => {
        if(confirm("¿Estás seguro de que deseas eliminar esta obra? Todos sus datos y relaciones se perderán.")) {
            startTransition(async () => {
                const res = await deleteProject(projectId);
                if (res.success) {
                    setProjects(projects.filter(p => p.id !== projectId));
                }
            });
        }
    };

    const filteredProjects = projects.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch(status) {
            case "En Ejecución": return "bg-blue-100 text-blue-700 border-blue-200";
            case "Finalizada": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "Suspendida": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-amber-100 text-amber-700 border-amber-200";
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex justify-between items-center bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <Construction className="w-8 h-8 text-indigo-600" />
                        Obras y Proyectos
                    </h2>
                    <p className="text-slate-500 mt-1">Gestión de centros de trabajo temporales, asignación de personal y documentación de obra (PSO).</p>
                </div>
                <button 
                    onClick={() => { 
                        setFormData({ name: "", location: "", clientName: "", surfaceArea: "", startDate: "", endDate: "", status: "Planificación", description: "", progress: 0 }); 
                        setEditingProject(null); 
                        setIsModalOpen(true); 
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Nueva Obra
                </button>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nombre o ubicación..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        {projects.length} Obras
                    </div>
                </div>

                <div className="overflow-x-auto px-2 pb-2">
                    <table className="w-full text-sm text-left">
                        <thead className="text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-5">Nombre y Cliente</th>
                                <th className="px-6 py-5">Ubicación</th>
                                <th className="px-6 py-5">Estado</th>
                                <th className="px-6 py-5 text-center">Personal</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProjects.map((project: any) => (
                                <tr key={project.id} className="hover:bg-white/80 transition-all group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg bg-indigo-100 text-indigo-600 shadow-sm">
                                                <Construction className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-base">{project.name}</p>
                                                <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wider">{project.clientName || 'Sin cliente'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 align-top w-64">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium">
                                                <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="line-clamp-2" title={project.location}>{project.location}</span>
                                            </div>
                                            {project.location && (
                                                <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 shadow-inner mt-1 relative group-hover:border-indigo-200 transition-colors">
                                                    <iframe 
                                                        width="100%" 
                                                        height="100%" 
                                                        frameBorder="0" 
                                                        style={{ border: 0 }}
                                                        src={`https://maps.google.com/maps?q=${encodeURIComponent(project.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                                        allowFullScreen
                                                    />
                                                    <div className="absolute inset-0 bg-transparent cursor-pointer" title="Abrir en Google Maps" onClick={() => window.open(`https://maps.google.com/maps?q=${encodeURIComponent(project.location)}`, '_blank')}></div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-2">
                                            <span className={`w-fit px-3 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-tighter ${getStatusColor(project.status)}`}>
                                                {project.status}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${project.progress || 0}%` }}></div>
                                                </div>
                                                <span className="text-xs font-bold text-slate-500">{project.progress || 0}%</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-slate-600 font-bold bg-slate-50 w-max mx-auto px-3 py-1.5 rounded-lg border border-slate-100">
                                            <HardHat className="w-4 h-4" />
                                            {project.workers?.length || 0}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link 
                                                href={`/portal/empresas/${companyId}/obras/${project.id}`}
                                                className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100 flex items-center gap-1.5"
                                                title="Gestionar Obra"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-wider hidden md:inline">Panel</span>
                                            </Link>
                                            <button 
                                                onClick={() => { 
                                                    setEditingProject(project); 
                                                    setFormData({
                                                        name: project.name, location: project.location, clientName: project.clientName || "",
                                                        surfaceArea: project.surfaceArea || "", startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
                                                        endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
                                                        status: project.status, description: project.description || "", progress: project.progress || 0
                                                    }); 
                                                    setIsModalOpen(true); 
                                                }}
                                                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => confirmDelete(project.id)}
                                                disabled={isPending}
                                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all bg-white shadow-sm border border-slate-100 disabled:opacity-50"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white/90 backdrop-blur-2xl border border-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/30">
                                    <Construction className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800">
                                        {editingProject ? 'Editar Obra' : 'Nueva Obra'}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-medium mt-1">Completa los datos técnicos del proyecto.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <form id="project-form" onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nombre de la Obra *</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Ubicación / Dirección *</label>
                                        <input required type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Comitente / Cliente</label>
                                        <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Superficie (Mts2)</label>
                                        <input type="number" step="0.01" value={formData.surfaceArea} onChange={(e) => setFormData({...formData, surfaceArea: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fecha Inicio</label>
                                        <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Fecha Fin Estimada</label>
                                        <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Estado</label>
                                        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                                            <option value="Planificación">Planificación</option>
                                            <option value="En Ejecución">En Ejecución</option>
                                            <option value="Suspendida">Suspendida</option>
                                            <option value="Finalizada">Finalizada</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Avance (%)</label>
                                        <input type="number" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Descripción General</label>
                                        <textarea rows={3} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"></textarea>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" form="project-form" disabled={isPending} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                <Save className="w-4 h-4" />
                                {isPending ? 'Guardando...' : 'Guardar Obra'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
