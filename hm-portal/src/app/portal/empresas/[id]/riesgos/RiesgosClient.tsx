"use client";

import { useState } from "react";
import { 
    Building2, LayoutGrid, Settings, Briefcase, ClipboardList, 
    Plus, ChevronRight, MapPin, Layers, Users, Trash2, Edit2, ChevronDown, Activity, AlertTriangle
} from "lucide-react";
import { 
    createEstablishment, deleteEstablishment,
    createSector, deleteSector,
    createProcess, deleteProcess,
    createJobRole, deleteJobRole,
    createTask, deleteTask
} from "@/app/actions/risks";
import EstablishmentModal from "./components/EstablishmentModal";
import SectorModal from "./components/SectorModal";
import ProcessModal from "./components/ProcessModal";
import JobRoleModal from "./components/JobRoleModal";
import TaskModal from "./components/TaskModal";
import TaskDetailView from "./components/TaskDetailView";

export default function RiesgosClient({ companyId, initialEstablishments }: { companyId: string, initialEstablishments: any[] }) {
    const [establishments, setEstablishments] = useState(initialEstablishments);
    
    // Selection state
    const [selectedEst, setSelectedEst] = useState<any | null>(null);
    const [selectedSec, setSelectedSec] = useState<any | null>(null);
    const [selectedProc, setSelectedProc] = useState<any | null>(null);
    const [selectedRole, setSelectedRole] = useState<any | null>(null);
    
    // Modal state
    const [modalConfig, setModalConfig] = useState<{type: 'ESTABLISHMENT' | 'SECTOR' | 'PROCESS' | 'JOBROLE' | 'TASK' | null, data?: any}>({ type: null });

    const [detailModeTask, setDetailModeTask] = useState<any | null>(null);

    // Helper to refresh data visually (optimistic UI or simple reloads could be used, for now we let server actions revalidate and we could use router.refresh() but next 14 server actions do it automatically if we pass state, actually let's just let Next.js handle it)
    // Wait, with server actions and revalidatePath, the page will refresh, but we need to keep the selected IDs.
    // So we'll rely on the parent component passing down new establishments and we update our local state to keep selections active.
    
    // We update local state when props change
    if (JSON.stringify(initialEstablishments) !== JSON.stringify(establishments)) {
        setEstablishments(initialEstablishments);
        if (selectedEst) setSelectedEst(initialEstablishments.find((e: any) => e.id === selectedEst.id) || null);
        if (selectedSec) {
            const est = initialEstablishments.find((e: any) => e.id === selectedEst?.id);
            setSelectedSec(est?.sectors.find((s: any) => s.id === selectedSec.id) || null);
        }
        if (selectedProc) {
            const est = initialEstablishments.find((e: any) => e.id === selectedEst?.id);
            const sec = est?.sectors.find((s: any) => s.id === selectedSec?.id);
            setSelectedProc(sec?.processes.find((p: any) => p.id === selectedProc.id) || null);
        }
        if (selectedRole) {
            const est = initialEstablishments.find((e: any) => e.id === selectedEst?.id);
            const sec = est?.sectors.find((s: any) => s.id === selectedSec?.id);
            const proc = sec?.processes.find((p: any) => p.id === selectedProc?.id);
            setSelectedRole(proc?.jobRoles.find((r: any) => r.id === selectedRole.id) || null);
        }
        if (detailModeTask) {
            const est = initialEstablishments.find((e: any) => e.id === selectedEst?.id);
            const sec = est?.sectors.find((s: any) => s.id === selectedSec?.id);
            const proc = sec?.processes.find((p: any) => p.id === selectedProc?.id);
            const role = proc?.jobRoles.find((r: any) => r.id === selectedRole?.id);
            setDetailModeTask(role?.tasks.find((t: any) => t.id === detailModeTask.id) || null);
        }
    }

    const handleDelete = async (type: string, id: string) => {
        if (!confirm("¿Eliminar este elemento y todo su contenido?")) return;
        if (type === 'ESTABLISHMENT') {
            await deleteEstablishment(id, companyId);
            setSelectedEst(null); setSelectedSec(null); setSelectedProc(null); setSelectedRole(null);
        }
        if (type === 'SECTOR') {
            await deleteSector(id, companyId);
            setSelectedSec(null); setSelectedProc(null); setSelectedRole(null);
        }
        if (type === 'PROCESS') {
            await deleteProcess(id, companyId);
            setSelectedProc(null); setSelectedRole(null);
        }
        if (type === 'JOBROLE') {
            await deleteJobRole(id, companyId);
            setSelectedRole(null);
        }
        if (type === 'TASK') {
            await deleteTask(id, companyId);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-indigo-600" />
                        Gestor de Riesgos e Inventarios
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Estructura la empresa jerárquicamente para asignar la Matriz de Riesgos.
                    </p>
                </div>
            </div>

            {detailModeTask ? (
                <TaskDetailView 
                    task={detailModeTask} 
                    companyId={companyId} 
                    onBack={() => setDetailModeTask(null)} 
                />
            ) : (
                /* CASCADING PANELS */
                <div className="flex flex-nowrap overflow-x-auto gap-4 custom-scrollbar pb-4 min-h-[600px]">
                    
                    {/* PANEL 1: ESTABLECIMIENTOS */}
                    <div className="flex-none w-80 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h3 className="font-black text-slate-700 flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-indigo-500" />
                            Establecimientos
                        </h3>
                        <button onClick={() => setModalConfig({type: 'ESTABLISHMENT'})} className="p-1.5 bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {establishments.length === 0 && (
                            <p className="text-xs text-center text-slate-400 p-4 font-bold">No hay establecimientos</p>
                        )}
                        {establishments.map((est: any) => (
                            <div 
                                key={est.id} 
                                onClick={() => { setSelectedEst(est); setSelectedSec(null); setSelectedProc(null); setSelectedRole(null); }}
                                className={`p-4 rounded-2xl cursor-pointer border transition-all group relative ${
                                    selectedEst?.id === est.id 
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50'
                                }`}
                            >
                                <div className="font-bold text-slate-800 pr-8 text-sm">{est.name}</div>
                                <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                    <MapPin className="w-3 h-3" /> {est.address || 'Sin dirección'}
                                </div>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete('ESTABLISHMENT', est.id); }} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                    <ChevronRight className={`w-4 h-4 ${selectedEst?.id === est.id ? 'text-indigo-600' : 'text-slate-300'}`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PANEL 2: SECTORES */}
                {selectedEst && (
                    <div className="flex-none w-80 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-left-4">
                        <div className="p-4 border-b border-slate-100 bg-emerald-50/30 flex items-center justify-between">
                            <h3 className="font-black text-slate-700 flex items-center gap-2">
                                <LayoutGrid className="w-5 h-5 text-emerald-500" />
                                Sectores
                            </h3>
                            <button onClick={() => setModalConfig({type: 'SECTOR'})} className="p-1.5 bg-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {selectedEst.sectors?.length === 0 && (
                                <p className="text-xs text-center text-slate-400 p-4 font-bold">Añade sectores a {selectedEst.name}</p>
                            )}
                            {selectedEst.sectors?.map((sec: any) => (
                                <div 
                                    key={sec.id} 
                                    onClick={() => { setSelectedSec(sec); setSelectedProc(null); setSelectedRole(null); }}
                                    className={`p-4 rounded-2xl cursor-pointer border transition-all group relative ${
                                        selectedSec?.id === sec.id 
                                        ? 'bg-emerald-50 border-emerald-200 shadow-sm' 
                                        : 'bg-white border-slate-100 hover:border-emerald-100 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="font-bold text-slate-800 pr-8 text-sm">{sec.name}</div>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete('SECTOR', sec.id); }} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <ChevronRight className={`w-4 h-4 ${selectedSec?.id === sec.id ? 'text-emerald-600' : 'text-slate-300'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PANEL 3: PROCESOS */}
                {selectedSec && (
                    <div className="flex-none w-80 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-left-4">
                        <div className="p-4 border-b border-slate-100 bg-amber-50/30 flex items-center justify-between">
                            <h3 className="font-black text-slate-700 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-amber-500" />
                                Procesos
                            </h3>
                            <button onClick={() => setModalConfig({type: 'PROCESS'})} className="p-1.5 bg-amber-100 text-amber-600 hover:bg-amber-600 hover:text-white rounded-xl transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {selectedSec.processes?.length === 0 && (
                                <p className="text-xs text-center text-slate-400 p-4 font-bold">Añade procesos productivos</p>
                            )}
                            {selectedSec.processes?.map((proc: any) => (
                                <div 
                                    key={proc.id} 
                                    onClick={() => { setSelectedProc(proc); setSelectedRole(null); }}
                                    className={`p-4 rounded-2xl cursor-pointer border transition-all group relative ${
                                        selectedProc?.id === proc.id 
                                        ? 'bg-amber-50 border-amber-200 shadow-sm' 
                                        : 'bg-white border-slate-100 hover:border-amber-100 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="font-bold text-slate-800 pr-8 text-sm">{proc.name}</div>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete('PROCESS', proc.id); }} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <ChevronRight className={`w-4 h-4 ${selectedProc?.id === proc.id ? 'text-amber-600' : 'text-slate-300'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PANEL 4: PUESTOS */}
                {selectedProc && (
                    <div className="flex-none w-80 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-left-4">
                        <div className="p-4 border-b border-slate-100 bg-sky-50/30 flex items-center justify-between">
                            <h3 className="font-black text-slate-700 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-sky-500" />
                                Puestos
                            </h3>
                            <button onClick={() => setModalConfig({type: 'JOBROLE'})} className="p-1.5 bg-sky-100 text-sky-600 hover:bg-sky-600 hover:text-white rounded-xl transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {selectedProc.jobRoles?.length === 0 && (
                                <p className="text-xs text-center text-slate-400 p-4 font-bold">Añade puestos de trabajo</p>
                            )}
                            {selectedProc.jobRoles?.map((role: any) => (
                                <div 
                                    key={role.id} 
                                    onClick={() => setSelectedRole(role)}
                                    className={`p-4 rounded-2xl cursor-pointer border transition-all group relative ${
                                        selectedRole?.id === role.id 
                                        ? 'bg-sky-50 border-sky-200 shadow-sm' 
                                        : 'bg-white border-slate-100 hover:border-sky-100 hover:bg-slate-50'
                                    }`}
                                >
                                    <div className="font-bold text-slate-800 pr-8 text-sm">{role.name}</div>
                                    <div className="text-[10px] text-slate-500 font-semibold uppercase flex items-center gap-1 mt-1">
                                        <Users className="w-3 h-3" /> {role.personnelCount || 1} Trabajador(es)
                                    </div>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete('JOBROLE', role.id); }} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <ChevronRight className={`w-4 h-4 ${selectedRole?.id === role.id ? 'text-sky-600' : 'text-slate-300'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PANEL 5: TAREAS */}
                {selectedRole && (
                    <div className="flex-none w-80 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col overflow-hidden animate-in slide-in-from-left-4">
                        <div className="p-4 border-b border-slate-100 bg-rose-50/30 flex items-center justify-between">
                            <h3 className="font-black text-slate-700 flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-rose-500" />
                                Tareas
                            </h3>
                            <button onClick={() => setModalConfig({type: 'TASK'})} className="p-1.5 bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {selectedRole.tasks?.length === 0 && (
                                <p className="text-xs text-center text-slate-400 p-4 font-bold">Añade tareas para este puesto</p>
                            )}
                            {selectedRole.tasks?.map((task: any) => (
                                <div 
                                    key={task.id} 
                                    onClick={() => setDetailModeTask(task)}
                                    className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 transition-all cursor-pointer group relative"
                                >
                                    <div className="font-bold text-slate-800 pr-8 text-sm">{task.name}</div>
                                    <div className="text-[10px] text-slate-500 font-semibold uppercase mt-1">
                                        {task.type || 'Rutinaria'}
                                    </div>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); handleDelete('TASK', task.id); }} className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                        <ChevronRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            )}

            {/* MODALS */}
            {modalConfig.type === 'ESTABLISHMENT' && (
                <EstablishmentModal companyId={companyId} onClose={() => setModalConfig({type: null})} />
            )}
            {modalConfig.type === 'SECTOR' && selectedEst && (
                <SectorModal establishmentId={selectedEst.id} companyId={companyId} onClose={() => setModalConfig({type: null})} />
            )}
            {modalConfig.type === 'PROCESS' && selectedSec && (
                <ProcessModal sectorId={selectedSec.id} companyId={companyId} onClose={() => setModalConfig({type: null})} />
            )}
            {modalConfig.type === 'JOBROLE' && selectedProc && (
                <JobRoleModal processId={selectedProc.id} companyId={companyId} onClose={() => setModalConfig({type: null})} />
            )}
            {modalConfig.type === 'TASK' && selectedRole && (
                <TaskModal jobRoleId={selectedRole.id} companyId={companyId} onClose={() => setModalConfig({type: null})} />
            )}

        </div>
    );
}
