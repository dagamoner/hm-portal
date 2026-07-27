"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Cpu, Download, Save, CheckCircle, Activity, FileText } from 'lucide-react';
import { startOrUpdateInvestigation } from '@/app/actions/investigations';
import { useRouter, useSearchParams } from 'next/navigation';

const METHODOLOGIES = [
    { id: 'ishikawa', name: 'Diagrama de Ishikawa', disabled: true },
    { id: 'arbol', name: 'Árbol de Causas', disabled: true },
    { id: '5porques', name: '5 Porqués', disabled: false },
    { id: 'rca', name: 'RCA (Root Cause Analysis)', disabled: true },
    { id: 'scat', name: 'Técnica SCAT (DuPont)', disabled: true },
    { id: 'tripod', name: 'Tripod Beta', disabled: true },
    { id: 'heinrich', name: 'Método de Heinrich', disabled: true },
    { id: 'amfe', name: 'AMFE (FMEA)', disabled: true },
    { id: 'estadistico', name: 'Análisis Estadístico', disabled: true },
];

export default function InvestigationClient({
    investigations,
    incidents,
    companyId
}: {
    investigations: any[],
    incidents: any[],
    companyId: string
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Tabs superior
    const [activeTab, setActiveTab] = useState<'nueva' | 'historial'>('nueva');

    // Selección de incidente
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
    
    // Metodología
    const [selectedMethod, setSelectedMethod] = useState('5porques');

    // Form fields (para 5 porqués y plan de acción heredado)
    const [cause, setCause] = useState('');
    const [actionPlan, setActionPlan] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Initial load from URL param if exists
    useEffect(() => {
        const incidentIdFromUrl = searchParams.get('incidentId');
        if (incidentIdFromUrl) {
            setSelectedIncidentId(incidentIdFromUrl);
        }
    }, [searchParams]);

    // Load active investigation details when incident changes
    useEffect(() => {
        if (selectedIncidentId) {
            const existingInv = investigations.find(i => i.incidentId === selectedIncidentId);
            if (existingInv) {
                setCause(existingInv.cause || '');
                setActionPlan(existingInv.actionPlan || '');
            } else {
                setCause('');
                setActionPlan('');
            }
        }
    }, [selectedIncidentId, investigations]);

    const filteredIncidents = useMemo(() => {
        return incidents.filter((inc) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                inc.title.toLowerCase().includes(searchLower) ||
                inc.location.toLowerCase().includes(searchLower) ||
                inc.id.toLowerCase().includes(searchLower)
            );
        });
    }, [incidents, searchTerm]);

    const activeIncident = incidents.find(i => i.id === selectedIncidentId);
    const activeInvestigation = investigations.find(i => i.incidentId === selectedIncidentId);
    const isCompleted = activeInvestigation?.status === 'Completada';

    const handleSave = async (complete: boolean = false) => {
        if (!selectedIncidentId) return;
        setIsSaving(true);
        try {
            await startOrUpdateInvestigation(companyId, selectedIncidentId, {
                cause,
                actionPlan,
                status: complete ? 'Completada' : 'En Progreso'
            });
            alert(complete ? 'Investigación completada y documento legal generado' : 'Avances guardados correctamente');
            router.refresh();
        } catch (error) {
            alert('Error al guardar la investigación');
        } finally {
            setIsSaving(false);
        }
    };

    const getSeverityColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'text-blue-500 font-bold';
            case 'MEDIUM': return 'text-indigo-500 font-bold';
            case 'HIGH': return 'text-orange-500 font-bold';
            case 'CRITICAL': return 'text-red-500 font-black';
            default: return 'text-slate-500';
        }
    };

    const getSeverityText = (level: string) => {
        switch (level) {
            case 'LOW': return 'BAJO';
            case 'MEDIUM': return 'MEDIO';
            case 'HIGH': return 'ALTO';
            case 'CRITICAL': return 'CRÍTICO';
            default: return level;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12 max-w-[1600px] mx-auto">
            {/* Top Tabs */}
            <div className="flex items-center gap-2 mb-6">
                <button 
                    onClick={() => setActiveTab('nueva')}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'nueva' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <span className="text-lg leading-none">+</span> Nueva Investigación
                </button>
                <button 
                    onClick={() => setActiveTab('historial')}
                    className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === 'historial' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                >
                    <Activity className="w-4 h-4" /> Historial de Análisis
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[800px]">
                {/* Columna Izquierda: Seleccionar Caso */}
                <div className="w-full lg:w-[350px] bg-white border border-slate-200 rounded-3xl p-5 flex flex-col shadow-sm">
                    <div className="flex items-center gap-2 mb-2 text-slate-800">
                        <Filter className="w-5 h-5 text-blue-500" />
                        <h3 className="font-bold text-lg tracking-tight">Seleccionar Caso</h3>
                    </div>
                    <p className="text-slate-500 text-xs font-medium mb-4">Busque el incidente que desea investigar.</p>
                    
                    <div className="relative mb-6">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Buscar incidente..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                        {filteredIncidents.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-sm font-bold text-slate-500">No hay incidentes</p>
                            </div>
                        ) : (
                            filteredIncidents.map((inc) => {
                                const isSelected = selectedIncidentId === inc.id;
                                return (
                                    <div 
                                        key={inc.id}
                                        onClick={() => setSelectedIncidentId(inc.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col gap-3 ${isSelected ? 'bg-blue-50/50 border-blue-400 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{inc.title}</h4>
                                            <span className="text-[10px] font-bold text-slate-400">INC-{inc.id.substring(0, 3).toUpperCase()}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="text-slate-500">{new Date(inc.date).toISOString().split('T')[0]}</span>
                                            <span className={getSeverityColor(inc.severity)}>{getSeverityText(inc.severity)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Columna Derecha: Metodología y Formulario */}
                <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                    
                    {/* Panel Superior: Metodología */}
                    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="font-bold text-lg tracking-tight text-slate-800 flex items-center gap-2">
                                    <Cpu className="w-5 h-5 text-purple-500" />
                                    Metodología de Análisis
                                </h3>
                                <p className="text-slate-500 text-xs font-medium mt-1">Elija el paradigma técnico de investigación.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
                            {METHODOLOGIES.map(method => (
                                <button
                                    key={method.id}
                                    disabled={method.disabled}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                                        selectedMethod === method.id
                                            ? 'bg-purple-50 border-purple-400 text-purple-700 shadow-sm'
                                            : method.disabled
                                                ? 'bg-slate-50 border-slate-200 text-slate-300 cursor-not-allowed'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                >
                                    {method.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Panel Inferior: Formulario / Resultados */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                            <h3 className="font-black text-slate-400 text-sm tracking-widest uppercase flex items-center gap-2">
                                <Cpu className="w-4 h-4" />
                                {activeIncident ? `INVESTIGACIÓN: ${METHODOLOGIES.find(m => m.id === selectedMethod)?.name}` : 'RESULTADOS DEL ANÁLISIS TÉCNICO'}
                            </h3>
                            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors">
                                <Download className="w-4 h-4" /> Exportar
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {!activeIncident ? (
                                <div className="h-full flex items-center justify-start text-slate-600 font-medium p-4">
                                    Error de conexión. (Seleccione un incidente para comenzar)
                                </div>
                            ) : selectedMethod === '5porques' ? (
                                <div className="space-y-6 pb-6">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
                                        <h4 className="font-bold text-slate-800 text-lg mb-1">{activeIncident.title}</h4>
                                        <p className="text-sm text-slate-500">{activeIncident.description}</p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Desarrollo de los 5 Porqués (Causa Raíz)</label>
                                            <textarea 
                                                rows={5}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500/50 font-medium resize-none custom-scrollbar"
                                                placeholder="1. ¿Por qué ocurrió el incidente? ...\n2. ¿Por qué? ...\n3. ¿Por qué? ...\n4. ¿Por qué? ...\n5. ¿Por qué? ..."
                                                value={cause}
                                                onChange={e => setCause(e.target.value)}
                                                disabled={isCompleted}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Plan de Acción / Medidas Preventivas</label>
                                            <textarea 
                                                rows={5}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-purple-500/50 font-medium resize-none custom-scrollbar"
                                                placeholder="¿Qué acciones se tomarán para atacar la causa raíz identificada?"
                                                value={actionPlan}
                                                onChange={e => setActionPlan(e.target.value)}
                                                disabled={isCompleted}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 mt-6 flex justify-end gap-4 border-t border-slate-100">
                                        {isCompleted ? (
                                            <div className="bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 w-full justify-center">
                                                <CheckCircle className="w-5 h-5" /> Investigación Completada
                                            </div>
                                        ) : (
                                            <>
                                                <button 
                                                    onClick={() => handleSave(false)}
                                                    disabled={isSaving}
                                                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    <Save className="w-4 h-4" /> Guardar Avances
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                                                            handleSave(true);
                                                        }
                                                    }}
                                                    disabled={isSaving || !cause || !actionPlan}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-xs flex items-center gap-2 shadow-xl shadow-purple-600/20 transition-all active:scale-95 disabled:opacity-50"
                                                >
                                                    <CheckCircle className="w-4 h-4" /> Completar Investigación
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
                                    <FileText className="w-12 h-12 text-slate-300 mb-4" />
                                    <h4 className="text-lg font-bold text-slate-500">Metodología no disponible</h4>
                                    <p className="text-sm text-slate-400">Esta metodología se habilitará en próximas versiones.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
