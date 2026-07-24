"use client";

import React, { useState, useMemo } from 'react';
import { 
    Activity, Plus, Search, FileText, TriangleAlert, ClipboardList, Zap, X, ChevronRight, ChevronLeft, Save, CheckCircle2, Download
} from 'lucide-react';
import { createErgonomicEvaluation } from '@/app/actions/ergonomics';
import { riskFactors, factorQuestions } from './ergonomicsData';
import { generateErgonomicsReportPDF } from '@/lib/pdfGenerator';

export default function ErgonomiaClient({ 
    evaluations, 
    companyId,
    companyName
}: { 
    evaluations: any[], 
    companyId: string,
    companyName: string
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [header, setHeader] = useState({ jobPosition: '', sector: '', workerName: '' });
    const [tasks, setTasks] = useState([{ id: 1, name: '', factors: [] as string[] }]);
    const [planilla2, setPlanilla2] = useState<Record<string, { paso1: boolean[], paso2: boolean[] }>>({});
    const [planilla3, setPlanilla3] = useState([{ id: 1, type: 'Administrativa', description: '' }]);
    const [diagnostico, setDiagnostico] = useState('');
    const [planAccion, setPlanAccion] = useState('');

    const activeFactors = useMemo(() => {
        const factors = new Set<string>();
        tasks.forEach(t => t.factors.forEach(f => factors.add(f)));
        return Array.from(factors).sort();
    }, [tasks]);

    const calculateRiskLevels = () => {
        const levels: Record<string, number> = {};
        activeFactors.forEach(f => {
            const data = planilla2[f] || { paso1: [], paso2: [] };
            const qDef = factorQuestions[f];
            
            // If no step 1 question is YES, risk is 1
            const hasPaso1Yes = data.paso1.some(v => v);
            if (!hasPaso1Yes) {
                levels[f] = 1;
            } else {
                // If has step 1 YES, check step 2
                const hasPaso2Yes = data.paso2.some(v => v);
                levels[f] = hasPaso2Yes ? 3 : 1; // 3 = No Tolerable, 1 = Tolerable
            }
        });
        return levels;
    };

    const riskLevels = calculateRiskLevels();
    const globalStatus = Object.values(riskLevels).some(l => l > 1) ? 'No Tolerable' : 'Tolerable';

    const toggleFactor = (taskId: number, factorId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                const factors = t.factors.includes(factorId) 
                    ? t.factors.filter(f => f !== factorId)
                    : [...t.factors, factorId];
                return { ...t, factors };
            }
            return t;
        }));
    };

    const handlePasoChange = (factorId: string, step: 'paso1' | 'paso2', index: number, value: boolean) => {
        setPlanilla2(prev => {
            const current = prev[factorId] || { paso1: Array(10).fill(false), paso2: Array(10).fill(false) };
            const updatedArray = [...current[step]];
            updatedArray[index] = value;
            return { ...prev, [factorId]: { ...current, [step]: updatedArray } };
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await createErgonomicEvaluation(companyId, {
                jobPosition: header.jobPosition,
                sector: header.sector,
                workerName: header.workerName,
                planilla1: { tasks, riskLevels },
                planilla2,
                planilla3,
                planilla4: { diagnostico, planAccion },
                globalStatus
            });
            setIsWizardOpen(false);
            // Reset state
            setHeader({ jobPosition: '', sector: '', workerName: '' });
            setTasks([{ id: 1, name: '', factors: [] }]);
            setPlanilla2({});
            setPlanilla3([{ id: 1, type: 'Administrativa', description: '' }]);
            setDiagnostico('');
            setPlanAccion('');
            setCurrentStep(1);
        } catch (error) {
            console.error(error);
            alert("Error al guardar");
        } finally {
            setIsSaving(false);
        }
    };

    const filtered = evaluations.filter(e => e.jobPosition.toLowerCase().includes(searchTerm.toLowerCase()) || e.sector.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="w-10 h-10 text-emerald-600" />
                        Protocolos de Ergonomía
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">
                        Gestión del Programa PEI bajo Res. SRT 886/2015 para {companyName}.
                    </p>
                </div>
                <button 
                    onClick={() => setIsWizardOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-3 shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> INICIAR EVALUACIÓN PEI
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex-shrink-0">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">GUÍA PEI (RES. 886/15)</h3>
                    <nav className="space-y-2">
                        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-slate-50 text-emerald-700 font-bold text-sm transition-colors text-left">
                            <FileText className="w-5 h-5 opacity-70" />
                            <span>Identificación inicial anual (Planilla 1)</span>
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors text-left">
                            <TriangleAlert className="w-5 h-5 opacity-40" />
                            <span>Evaluación de riesgos no tolerables</span>
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors text-left">
                            <ClipboardList className="w-5 h-5 opacity-40" />
                            <span>Plan de acción (Planilla 3)</span>
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors text-left">
                            <Zap className="w-5 h-5 opacity-40" />
                            <span>Seguimiento de mejoras (Planilla 4)</span>
                        </button>
                    </nav>
                </div>

                <div className="flex-1 w-full space-y-6">
                    <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                            <input 
                                type="text" 
                                placeholder="Buscar evaluaciones por puesto o sector..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium" 
                            />
                        </div>
                    </div>

                    {filtered.length === 0 && (
                        <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 py-32 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Activity className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-700 mb-2">Sin Evaluaciones Ergonómicas</h3>
                            <p className="text-slate-400 font-medium max-w-md mx-auto">
                                La Res. 886/15 exige una identificación anual de factores de riesgo para todos los puestos de trabajo.
                            </p>
                        </div>
                    )}

                    {filtered.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filtered.map(ev => (
                                <div key={ev.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-black text-slate-800 text-lg">{ev.jobPosition}</h4>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{ev.sector}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${ev.globalStatus === 'Tolerable' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                            {ev.globalStatus}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 font-medium line-clamp-2">
                                        Trabajador: {ev.workerName} | Riesgos: {ev.planilla1.riskLevels ? Object.keys(ev.planilla1.riskLevels).join(', ') : 'Ninguno'}
                                    </div>
                                    <button onClick={() => generateErgonomicsReportPDF(ev, companyName)} className="mt-auto w-full py-3 bg-slate-50 hover:bg-emerald-600 hover:text-white transition-colors rounded-xl text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" /> PDF Oficial
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Wizard Modal */}
            {isWizardOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => !isSaving && setIsWizardOpen(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-fade-in-up">
                        
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-lg leading-none">Asistente PEI SRT 886/15</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        {currentStep === 1 ? 'Paso 1: Identificación (Planilla 1)' : currentStep === 2 ? 'Paso 2: Evaluación Inicial (Planilla 2)' : 'Paso 3: Plan de Acción (Planilla 3)'}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => !isSaving && setIsWizardOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                            {currentStep === 1 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Puesto de Trabajo</label>
                                            <input value={header.jobPosition} onChange={e => setHeader({...header, jobPosition: e.target.value})} className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-colors" placeholder="Ej: Operario CNC" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Sector</label>
                                            <input value={header.sector} onChange={e => setHeader({...header, sector: e.target.value})} className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-colors" placeholder="Ej: Tornería" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Trabajador</label>
                                            <input value={header.workerName} onChange={e => setHeader({...header, workerName: e.target.value})} className="w-full px-4 py-3 text-sm font-bold bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 outline-none transition-colors" placeholder="Ej: Juan Pérez" />
                                        </div>
                                    </div>

                                    <div className="space-y-4 border-t border-slate-100 pt-6">
                                        <h4 className="font-black text-slate-700">Tareas Habituales</h4>
                                        <p className="text-xs text-slate-500 mb-4">Seleccione los factores de riesgo presentes en cada tarea.</p>
                                        
                                        {tasks.map((task, tIndex) => (
                                            <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                                                <div className="flex gap-4">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-black text-slate-500">{tIndex + 1}</div>
                                                    <input value={task.name} onChange={e => setTasks(prev => prev.map(t => t.id === task.id ? {...t, name: e.target.value} : t))} placeholder="Descripción de la tarea (Ej: Corte manual de piezas)" className="flex-1 px-4 py-1 text-sm font-bold border-b-2 border-slate-100 focus:border-emerald-500 outline-none transition-colors" />
                                                </div>
                                                <div className="pl-12 grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {Object.entries(riskFactors).map(([id, name]) => (
                                                        <label key={id} className={`flex items-start gap-2 p-2 rounded-xl cursor-pointer transition-colors border ${task.factors.includes(id) ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-transparent hover:bg-slate-100'}`}>
                                                            <input type="checkbox" checked={task.factors.includes(id)} onChange={() => toggleFactor(task.id, id)} className="mt-1 w-4 h-4 text-emerald-600 rounded" />
                                                            <div className="flex flex-col">
                                                                <span className={`text-[10px] font-black uppercase ${task.factors.includes(id) ? 'text-emerald-700' : 'text-slate-400'}`}>Factor {id}</span>
                                                                <span className={`text-xs font-medium leading-tight ${task.factors.includes(id) ? 'text-emerald-900' : 'text-slate-600'}`}>{name}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                        
                                        {tasks.length < 3 && (
                                            <button onClick={() => setTasks([...tasks, { id: Date.now(), name: '', factors: [] }])} className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold hover:bg-slate-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors flex items-center justify-center gap-2 text-sm">
                                                <Plus className="w-4 h-4" /> Agregar otra tarea principal
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-sm font-medium">
                                        El sistema ha seleccionado dinámicamente las siguientes evaluaciones de la <strong>Planilla 2</strong> en base a los riesgos identificados en el Paso 1. 
                                        Conteste afirmativamente (SI) solo si la condición aplica.
                                    </div>

                                    {activeFactors.length === 0 && (
                                        <div className="text-center py-20 text-slate-400 font-bold">
                                            No seleccionaste ningún factor de riesgo en el Paso 1. Puedes avanzar al final.
                                        </div>
                                    )}

                                    {activeFactors.map(factorId => {
                                        const qDef = factorQuestions[factorId];
                                        if (!qDef) return null;
                                        const p2Data = planilla2[factorId] || { paso1: [], paso2: [] };
                                        const showPaso2 = p2Data.paso1.some(v => v);

                                        return (
                                            <div key={factorId} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                                                    <h4 className="font-black text-slate-800">Planilla 2.{factorId}: {riskFactors[factorId]}</h4>
                                                </div>
                                                <div className="p-6 space-y-6">
                                                    <div>
                                                        <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">PASO 1: Identificar si la tarea implica...</h5>
                                                        <div className="space-y-2">
                                                            {qDef.paso1.map((q, i) => (
                                                                <label key={i} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${p2Data.paso1[i] ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                                    <span className="text-sm font-medium text-slate-700 max-w-[80%] leading-snug">{q}</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${p2Data.paso1[i] ? 'bg-rose-200 text-rose-800' : 'bg-slate-100 text-slate-400'}`}>SI</span>
                                                                        <input type="checkbox" className="sr-only" checked={!!p2Data.paso1[i]} onChange={e => handlePasoChange(factorId, 'paso1', i, e.target.checked)} />
                                                                    </div>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {showPaso2 && (
                                                        <div className="animate-fade-in border-t border-slate-100 pt-6">
                                                            <h5 className="text-[10px] font-black uppercase text-rose-500 tracking-widest mb-4 flex items-center gap-2"><TriangleAlert className="w-3.5 h-3.5" /> PASO 2: Determinación del Riesgo No Tolerable</h5>
                                                            <div className="space-y-2">
                                                                {qDef.paso2.map((q, i) => (
                                                                    <label key={i} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${p2Data.paso2[i] ? 'bg-rose-600 border-rose-700 text-white' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                                                                        <span className={`text-sm font-medium max-w-[80%] leading-snug ${p2Data.paso2[i] ? 'text-white' : 'text-slate-700'}`}>{q}</span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${p2Data.paso2[i] ? 'bg-white text-rose-800' : 'bg-slate-100 text-slate-400'}`}>SI</span>
                                                                            <input type="checkbox" className="sr-only" checked={!!p2Data.paso2[i]} onChange={e => handlePasoChange(factorId, 'paso2', i, e.target.checked)} />
                                                                        </div>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8 animate-fade-in">
                                    <div className="flex gap-6 items-start">
                                        <div className="flex-1 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                                            <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Resumen de Niveles de Riesgo</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                {activeFactors.map(f => (
                                                    <div key={f} className={`p-4 rounded-xl border flex justify-between items-center ${riskLevels[f] === 3 ? 'bg-rose-50 border-rose-200' : 'bg-emerald-50 border-emerald-200'}`}>
                                                        <span className="text-xs font-black uppercase text-slate-600">Factor {f}</span>
                                                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${riskLevels[f] === 3 ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'}`}>
                                                            {riskLevels[f] === 3 ? 'NO TOLERABLE (3)' : 'TOLERABLE (1)'}
                                                        </span>
                                                    </div>
                                                ))}
                                                {activeFactors.length === 0 && <span className="text-sm text-slate-400">Riesgo Global Tolerable</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {globalStatus === 'No Tolerable' && (
                                        <div className="space-y-4">
                                            <h4 className="font-black text-slate-800">Planilla 3: Medidas Correctivas y Preventivas</h4>
                                            {planilla3.map((m, i) => (
                                                <div key={m.id} className="flex gap-4 items-start">
                                                    <select value={m.type} onChange={e => setPlanilla3(prev => prev.map(item => item.id === m.id ? {...item, type: e.target.value} : item))} className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-emerald-500">
                                                        <option value="Administrativa">Administrativa</option>
                                                        <option value="Ingeniería">Ingeniería</option>
                                                    </select>
                                                    <input value={m.description} onChange={e => setPlanilla3(prev => prev.map(item => item.id === m.id ? {...item, description: e.target.value} : item))} placeholder="Describa la medida a implementar..." className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-emerald-500" />
                                                    <button onClick={() => setPlanilla3(prev => prev.filter(item => item.id !== m.id))} className="p-3 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-colors"><X className="w-5 h-5" /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => setPlanilla3([...planilla3, { id: Date.now(), type: 'Administrativa', description: '' }])} className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                                                <Plus className="w-3 h-3" /> Agregar Medida
                                            </button>
                                        </div>
                                    )}
                                    
                                    <div className="space-y-4 border-t border-slate-100 pt-6">
                                        <h4 className="font-black text-slate-800">Planilla 4: Seguimiento y Diagnóstico</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-200">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Diagnóstico General</label>
                                                <textarea rows={3} value={diagnostico} onChange={e => setDiagnostico(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-colors custom-scrollbar resize-none" placeholder="Conclusiones sobre los riesgos detectados..." />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Plan de Acción (si aplica)</label>
                                                <textarea rows={3} value={planAccion} onChange={e => setPlanAccion(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-colors custom-scrollbar resize-none" placeholder="Seguimiento de las medidas correctivas..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                            <button 
                                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                                className={`px-6 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                            >
                                <ChevronLeft className="w-4 h-4" /> Anterior
                            </button>
                            
                            {currentStep < 3 ? (
                                <button 
                                    onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
                                    className="px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                                >
                                    Siguiente Paso <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 bg-slate-900 text-white hover:bg-black shadow-lg transition-all active:scale-95 disabled:opacity-70"
                                >
                                    {isSaving ? 'Guardando...' : <><Save className="w-4 h-4" /> Finalizar PEI</>}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
