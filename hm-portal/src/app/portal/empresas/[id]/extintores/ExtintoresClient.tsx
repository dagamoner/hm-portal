"use client";

import React, { useState } from "react";
import { FireExtinguisher, ShieldAlert, CheckCircle2, ShieldCheck, Plus, Eye, Flame, TriangleAlert, Info, Columns4, AlertOctagon, FlameKindling } from "lucide-react";
import ExtintorModal from "./modals/ExtintorModal";
import ChecklistExtintorModal from "./modals/ChecklistExtintorModal";
import GeneralidadesPCI from "./GeneralidadesPCI";
import SectoresPCI from "./SectoresPCI";
import TiposRiesgoPCI from "./TiposRiesgoPCI";
import CargaFuegoPCI from "./CargaFuegoPCI";
import ResistenciaFuegoPCI from "./ResistenciaFuegoPCI";
import PotencialExtintorPCI from "./PotencialExtintorPCI";

export default function ExtintoresClient({ company, extintores }: { company: any, extintores: any[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
    const [selectedExtintor, setSelectedExtintor] = useState<any>(null);
    const [filter, setFilter] = useState("TODOS");
    const [activeTab, setActiveTab] = useState<"generalidades" | "sectores" | "riesgos" | "carga" | "resistencia" | "potencial" | "extintores">("generalidades");

    const today = new Date();
    const thirtyDays = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    const kpis = {
        total: extintores.length,
        vencidos: extintores.filter(e => e.status === 'Vencido' || e.status === 'Observado').length,
        porVencer: extintores.filter(e => {
            if (e.status !== 'Operativo') return false;
            if (e.nextInspection && new Date(e.nextInspection) <= thirtyDays && new Date(e.nextInspection) >= today) return true;
            if (e.expirationDate && new Date(e.expirationDate) <= thirtyDays && new Date(e.expirationDate) >= today) return true;
            return false;
        }).length,
        operativos: extintores.filter(e => e.status === 'Operativo').length
    };

    const filteredExtintores = extintores.filter(e => {
        if (filter === "VENCIDOS") return e.status === 'Vencido' || e.status === 'Observado';
        if (filter === "OPERATIVOS") return e.status === 'Operativo';
        return true;
    });

    const handleEdit = (extintor: any) => {
        setSelectedExtintor(extintor);
        setIsModalOpen(true);
    };

    const handleChecklist = (extintor: any) => {
        setSelectedExtintor(extintor);
        setIsChecklistModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex justify-between items-end mb-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Flame className="w-8 h-8 text-red-500" />
                        Protección contra Incendios
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">Gestión integral de prevención y combate de incendios (Dec. 351/79 Cap. 18)</p>
                </div>
            </div>

            <div className="flex gap-1 border-b border-slate-200 mb-6 overflow-x-auto custom-scrollbar">
                <button
                    onClick={() => setActiveTab('generalidades')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'generalidades' 
                            ? 'border-indigo-600 text-indigo-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <Info className="w-4 h-4" />
                    Generalidades del Establecimiento
                </button>
                <button
                    onClick={() => setActiveTab('sectores')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'sectores' 
                            ? 'border-indigo-600 text-indigo-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <Columns4 className="w-4 h-4" />
                    Sectores de Incendio
                </button>
                <button
                    onClick={() => setActiveTab('riesgos')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'riesgos' 
                            ? 'border-indigo-600 text-indigo-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <AlertOctagon className="w-4 h-4" />
                    Tipo de Riesgo
                </button>
                <button
                    onClick={() => setActiveTab('carga')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'carga' 
                            ? 'border-orange-500 text-orange-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <FlameKindling className="w-4 h-4" />
                    Carga de Fuego
                </button>
                <button
                    onClick={() => setActiveTab('resistencia')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'resistencia' 
                            ? 'border-amber-600 text-amber-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    Resistencia al Fuego
                </button>
                <button
                    onClick={() => setActiveTab('potencial')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'potencial' 
                            ? 'border-rose-600 text-rose-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <Flame className="w-4 h-4" />
                    Potencial Extintor
                </button>
                <button
                    onClick={() => setActiveTab('extintores')}
                    className={`flex items-center gap-2 pb-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === 'extintores' 
                            ? 'border-red-600 text-red-600' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                >
                    <FireExtinguisher className="w-4 h-4" />
                    Inventario de Extintores
                </button>
            </div>

            {activeTab === 'generalidades' && (
                <GeneralidadesPCI company={company} />
            )}

            {activeTab === 'sectores' && (
                <SectoresPCI company={company} />
            )}

            {activeTab === 'riesgos' && (
                <TiposRiesgoPCI company={company} />
            )}

            {activeTab === 'carga' && (
                <CargaFuegoPCI company={company} />
            )}

            {activeTab === 'resistencia' && (
                <ResistenciaFuegoPCI company={company} />
            )}

            {activeTab === 'potencial' && (
                <PotencialExtintorPCI company={company} />
            )}

            {activeTab === 'extintores' && (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <button 
                            onClick={() => { setSelectedExtintor(null); setIsModalOpen(true); }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" /> Nuevo Extintor
                        </button>
                    </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <FireExtinguisher className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Total Equipos</p>
                        <p className="text-2xl font-black text-slate-800">{kpis.total}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-sm font-medium">Operativos</p>
                        <p className="text-2xl font-black text-slate-800">{kpis.operativos}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-amber-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full" />
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                        <TriangleAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-amber-700 text-sm font-bold">Por Vencer (30d)</p>
                        <p className="text-2xl font-black text-amber-600">{kpis.porVencer}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-sm flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full" />
                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
                        <ShieldAlert className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-red-700 text-sm font-bold">Vencidos / Obs.</p>
                        <p className="text-2xl font-black text-red-600">{kpis.vencidos}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-sm border border-white/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <FireExtinguisher className="w-5 h-5 text-indigo-500" />
                        Padrón de Extintores
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={() => setFilter("TODOS")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'TODOS' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>Todos</button>
                        <button onClick={() => setFilter("OPERATIVOS")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'OPERATIVOS' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>Operativos</button>
                        <button onClick={() => setFilter("VENCIDOS")} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'VENCIDOS' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>Vencidos</button>
                    </div>
                </div>

                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                                <th className="p-4 font-bold">Identificación / Chapa</th>
                                <th className="p-4 font-bold">Ubicación</th>
                                <th className="p-4 font-bold">Tipo y Capacidad</th>
                                <th className="p-4 font-bold">Venc. Carga (Anual)</th>
                                <th className="p-4 font-bold">Venc. PH (5 Años)</th>
                                <th className="p-4 font-bold">Estado</th>
                                <th className="p-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredExtintores.map(extintor => {
                                const details = JSON.parse(extintor.details || "{}");
                                const isVencido = extintor.status === 'Vencido' || extintor.status === 'Observado';
                                
                                return (
                                    <tr key={extintor.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isVencido ? 'bg-red-50 text-red-500' : 'bg-slate-100 text-slate-500'}`}>
                                                    <FireExtinguisher className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800">{extintor.name}</p>
                                                    <p className="text-xs text-slate-500 flex gap-1 mt-0.5">
                                                        {(details.fireClasses || []).map((c: string) => (
                                                            <span key={c} className="bg-slate-200 px-1 rounded text-[10px] font-bold text-slate-600">Clase {c}</span>
                                                        ))}
                                                        {details.potential && <span className="text-indigo-600 font-bold ml-1">{details.potential}</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 font-medium text-slate-700">{extintor.location}</td>
                                        <td className="p-4">
                                            <p className="font-bold text-slate-700">{details.agent || 'N/D'}</p>
                                            <p className="text-xs text-slate-500">{details.capacity ? `${details.capacity} Kg/Lts` : 'N/D'}</p>
                                        </td>
                                        <td className="p-4">
                                            <span className={`font-medium ${extintor.nextInspection && new Date(extintor.nextInspection) < today ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                                {extintor.nextInspection ? new Date(extintor.nextInspection).toLocaleDateString() : 'N/D'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`font-medium ${extintor.expirationDate && new Date(extintor.expirationDate) < today ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                                                {extintor.expirationDate ? new Date(extintor.expirationDate).toLocaleDateString() : 'N/D'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-md text-xs font-bold border ${
                                                extintor.status === 'Operativo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                                extintor.status === 'Vencido' ? 'bg-red-50 text-red-700 border-red-200' : 
                                                'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}>
                                                {extintor.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleChecklist(extintor)} className="text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl transition-colors">
                                                    Checklist
                                                </button>
                                                <button onClick={() => handleEdit(extintor)} className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors flex items-center gap-1">
                                                    <Eye className="w-3 h-3" /> Ver
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredExtintores.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        No se encontraron extintores.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
            )}

            {isModalOpen && <ExtintorModal companyId={company.id} extintor={selectedExtintor} onClose={() => setIsModalOpen(false)} />}
            {isChecklistModalOpen && <ChecklistExtintorModal companyId={company.id} extintor={selectedExtintor} onClose={() => setIsChecklistModalOpen(false)} />}
        </div>
    );
}
