"use client";

import { useState } from "react";
import { ArrowLeft, ShieldAlert, Plus, Trash2, CheckCircle2, AlertTriangle, Activity, Wrench } from "lucide-react";
import { createHazard, deleteHazard, saveRiskEvaluation, createImprovementAction } from "@/app/actions/risks";
import HazardModal from "./HazardModal";
import ImprovementActionModal from "./ImprovementActionModal";

const RISK_LEVELS = [
    { max: 4, label: "Bajo", color: "bg-emerald-100 text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
    { max: 8, label: "Medio", color: "bg-yellow-100 text-yellow-700", bg: "bg-yellow-50 border-yellow-200" },
    { max: 16, label: "Alto", color: "bg-orange-100 text-orange-700", bg: "bg-orange-50 border-orange-200" },
    { max: 25, label: "Crítico", color: "bg-rose-100 text-rose-700", bg: "bg-rose-50 border-rose-200" },
];

function getRiskLevel(p: number, s: number) {
    const r = p * s;
    if (r === 0) return { label: "-", color: "bg-slate-100 text-slate-500", bg: "bg-slate-50 border-slate-200" };
    return RISK_LEVELS.find(l => r <= l.max) || RISK_LEVELS[3];
}

export default function TaskDetailView({ task, companyId, onBack }: { task: any, companyId: string, onBack: () => void }) {
    const [isHazardModalOpen, setIsHazardModalOpen] = useState(false);
    const [actionModalEvalId, setActionModalEvalId] = useState<string | null>(null);
    
    // Evaluation state mapping hazardId -> { p, s, control }
    const [evaluations, setEvaluations] = useState<Record<string, {p: number, s: number, control: string}>>(() => {
        const evals: any = {};
        task.hazards?.forEach((h: any) => {
            if (h.evaluations && h.evaluations.length > 0) {
                evals[h.id] = {
                    p: h.evaluations[0].probability,
                    s: h.evaluations[0].severity,
                    control: h.evaluations[0].controlMeasures || ""
                };
            }
        });
        return evals;
    });

    const handleEvaluationChange = (hazardId: string, field: 'p' | 's' | 'control', value: string | number) => {
        setEvaluations(prev => ({
            ...prev,
            [hazardId]: {
                ...(prev[hazardId] || { p: 0, s: 0, control: "" }),
                [field]: value
            }
        }));
    };

    const handleSaveEvaluation = async (hazardId: string) => {
        const ev = evaluations[hazardId];
        if (!ev || !ev.p || !ev.s) return alert("Selecciona Probabilidad y Severidad");
        
        await saveRiskEvaluation(hazardId, companyId, {
            probability: ev.p,
            severity: ev.s,
            controlMeasures: ev.control
        });
        alert("Evaluación guardada con éxito");
    };

    const handleDeleteHazard = async (id: string) => {
        if (confirm("¿Eliminar este peligro y su evaluación?")) {
            await deleteHazard(id, companyId);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Encabezado */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                            {task.name}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[10px] font-bold uppercase tracking-wider">
                                Tarea {task.type}
                            </span>
                            <span className="text-sm text-slate-500 font-medium">
                                Matriz de Evaluación de Riesgos
                            </span>
                        </div>
                    </div>
                </div>
                <button onClick={() => setIsHazardModalOpen(true)} className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-rose-200 flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Agregar Peligro
                </button>
            </div>

            {/* Tabla de Peligros */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-black border-b border-slate-200 w-1/4">Peligro Identificado</th>
                                <th className="p-4 font-black border-b border-slate-200 w-32 text-center">Prob. (P)</th>
                                <th className="p-4 font-black border-b border-slate-200 w-32 text-center">Severidad (S)</th>
                                <th className="p-4 font-black border-b border-slate-200 w-32 text-center">Nivel (R)</th>
                                <th className="p-4 font-black border-b border-slate-200">Medidas de Control Existentes</th>
                                <th className="p-4 font-black border-b border-slate-200 w-24 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {(!task.hazards || task.hazards.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">
                                        <ShieldAlert className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p className="font-bold">No se han identificado peligros para esta tarea.</p>
                                        <p className="text-xs mt-1">Haz clic en Agregar Peligro para comenzar a evaluar.</p>
                                    </td>
                                </tr>
                            )}
                            {task.hazards?.map((hazard: any) => {
                                const ev = evaluations[hazard.id] || { p: 0, s: 0, control: "" };
                                const riskInfo = getRiskLevel(ev.p, ev.s);

                                return (
                                    <tr key={hazard.id} className={`${riskInfo.bg} transition-colors`}>
                                        <td className="p-4 align-top">
                                            <div className="font-bold text-slate-800">{hazard.name}</div>
                                            <div className="text-xs text-slate-500 mt-1">{hazard.description}</div>
                                            {hazard.type && <div className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-bold">{hazard.type}</div>}
                                        </td>
                                        <td className="p-4 align-top text-center">
                                            <select 
                                                className="w-full p-2 text-center bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm font-bold text-slate-700 cursor-pointer"
                                                value={ev.p}
                                                onChange={(e) => handleEvaluationChange(hazard.id, 'p', Number(e.target.value))}
                                            >
                                                <option value={0}>-</option>
                                                <option value={1}>1-Rara</option>
                                                <option value={2}>2-Improbable</option>
                                                <option value={3}>3-Posible</option>
                                                <option value={4}>4-Probable</option>
                                                <option value={5}>5-Casi Certera</option>
                                            </select>
                                        </td>
                                        <td className="p-4 align-top text-center">
                                            <select 
                                                className="w-full p-2 text-center bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm font-bold text-slate-700 cursor-pointer"
                                                value={ev.s}
                                                onChange={(e) => handleEvaluationChange(hazard.id, 's', Number(e.target.value))}
                                            >
                                                <option value={0}>-</option>
                                                <option value={1}>1-Insignificante</option>
                                                <option value={2}>2-Menor</option>
                                                <option value={3}>3-Moderada</option>
                                                <option value={4}>4-Mayor</option>
                                                <option value={5}>5-Catastrófica</option>
                                            </select>
                                        </td>
                                        <td className="p-4 align-top text-center">
                                            <div className={`mx-auto w-20 py-2 rounded-xl border flex flex-col items-center justify-center bg-white shadow-sm ${riskInfo.color.replace('bg-', 'border-')}`}>
                                                <span className="text-xl font-black">{ev.p * ev.s || '-'}</span>
                                                <span className={`text-[10px] font-bold uppercase ${riskInfo.color.split(' ')[1]}`}>{riskInfo.label}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 align-top">
                                            <textarea 
                                                className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 text-sm resize-none h-20"
                                                placeholder="Ej: Uso de EPP, ventilación local..."
                                                value={ev.control}
                                                onChange={(e) => handleEvaluationChange(hazard.id, 'control', e.target.value)}
                                            ></textarea>
                                        </td>
                                        <td className="p-4 align-top text-center space-y-2">
                                            <button onClick={() => handleSaveEvaluation(hazard.id)} className="w-full p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1 font-bold text-xs">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Guardar
                                            </button>
                                            {ev.p * ev.s > 4 && hazard.evaluations?.[0]?.id && (
                                                <button onClick={() => setActionModalEvalId(hazard.evaluations[0].id)} className="w-full p-2 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded-lg transition-colors flex items-center justify-center gap-1 font-bold text-xs">
                                                    <Wrench className="w-3.5 h-3.5" /> Plan
                                                </button>
                                            )}
                                            <button onClick={() => handleDeleteHazard(hazard.id)} className="w-full p-2 bg-white text-slate-400 border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg transition-colors flex items-center justify-center gap-1 font-bold text-xs">
                                                <Trash2 className="w-3.5 h-3.5" /> Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {isHazardModalOpen && (
                <HazardModal taskId={task.id} companyId={companyId} onClose={() => setIsHazardModalOpen(false)} />
            )}
            {actionModalEvalId && (
                <ImprovementActionModal riskEvaluationId={actionModalEvalId} companyId={companyId} onClose={() => setActionModalEvalId(null)} />
            )}
        </div>
    );
}
