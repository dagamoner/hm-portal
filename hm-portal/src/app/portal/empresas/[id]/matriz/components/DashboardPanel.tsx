"use client";

import { PieChart, AlertTriangle, ShieldCheck, Activity, CheckCircle2, TableProperties } from "lucide-react";
import RiskMatrix5x5 from "./RiskMatrix5x5";

export default function DashboardPanel({ rows, company }: { rows: any[], company: any }) {
    // Calculate statistics
    const totalHazards = rows.filter(r => r.id).length;
    const evaluatedHazards = rows.filter(r => r.r !== '-').length;
    const criticalRisks = rows.filter(r => r.level === 'Crítico').length;
    const highRisks = rows.filter(r => r.level === 'Alto').length;
    const pendingActions = rows.filter(r => r.actionStatus === 'PENDING' || r.actionStatus === 'IN_PROGRESS').length;

    // Aggregate by risk level
    const riskCounts = { Bajo: 0, Medio: 0, Alto: 0, Crítico: 0 };
    rows.forEach(r => {
        if (r.level && riskCounts[r.level as keyof typeof riskCounts] !== undefined) {
            riskCounts[r.level as keyof typeof riskCounts]++;
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
            {/* Resumen de Tarjetas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-slate-400 mb-3">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h4 className="text-3xl font-black text-slate-800">{evaluatedHazards}<span className="text-sm font-bold text-slate-400 mx-1">/</span>{totalHazards}</h4>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-1">Peligros Evaluados</p>
                </div>
                
                <div className="p-5 bg-rose-50 rounded-2xl border border-rose-100 flex flex-col items-center text-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-rose-500 mb-3">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <h4 className="text-3xl font-black text-rose-700">{criticalRisks}</h4>
                    <p className="text-xs font-bold text-rose-600/70 uppercase mt-1">Riesgos Críticos</p>
                </div>

                <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center text-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-orange-500 mb-3">
                        <PieChart className="w-6 h-6" />
                    </div>
                    <h4 className="text-3xl font-black text-orange-700">{highRisks}</h4>
                    <p className="text-xs font-bold text-orange-600/70 uppercase mt-1">Riesgos Altos</p>
                </div>

                <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col items-center text-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-purple-500 mb-3">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-3xl font-black text-purple-700">{pendingActions}</h4>
                    <p className="text-xs font-bold text-purple-600/70 uppercase mt-1">Acciones Pendientes</p>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-black text-slate-700 flex items-center gap-2">
                    <TableProperties className="w-5 h-5 text-indigo-500" /> Matriz de Probabilidad y Severidad
                </h4>
                <RiskMatrix5x5 rows={rows} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Gráfico Visual Simple (Barras) */}
                <div className="space-y-4">
                    <h4 className="font-black text-slate-700 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" /> Distribución de Niveles de Riesgo
                    </h4>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                        {[
                            { label: 'Crítico', count: riskCounts.Crítico, color: 'bg-rose-500' },
                            { label: 'Alto', count: riskCounts.Alto, color: 'bg-orange-500' },
                            { label: 'Medio', count: riskCounts.Medio, color: 'bg-yellow-500' },
                            { label: 'Bajo', count: riskCounts.Bajo, color: 'bg-emerald-500' },
                        ].map(item => {
                            const percentage = totalHazards > 0 ? (item.count / totalHazards) * 100 : 0;
                            return (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-600 uppercase">
                                        <span>{item.label} ({item.count})</span>
                                        <span>{percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Peligros Críticos */}
                <div className="space-y-4">
                    <h4 className="font-black text-slate-700 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" /> Top Peligros Prioritarios
                    </h4>
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                        <div className="divide-y divide-slate-100">
                            {rows.filter(r => r.r !== '-').sort((a, b) => Number(b.r) - Number(a.r)).slice(0, 5).map((r, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white shrink-0 ${r.level === 'Crítico' ? 'bg-rose-500' : r.level === 'Alto' ? 'bg-orange-500' : r.level === 'Medio' ? 'bg-yellow-500' : 'bg-emerald-500'}`}>
                                            {r.r}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{r.hazardName}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">{r.task} • {r.process}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${r.color.replace('text-', 'bg-').replace('600', '100')} ${r.color}`}>
                                        {r.level}
                                    </span>
                                </div>
                            ))}
                            {evaluatedHazards === 0 && (
                                <div className="p-8 text-center text-slate-400 font-bold text-sm">
                                    No hay peligros evaluados aún.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
