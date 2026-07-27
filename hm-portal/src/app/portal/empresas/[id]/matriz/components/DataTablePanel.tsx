"use client";

import { AlertCircle } from "lucide-react";

export default function DataTablePanel({ rows }: { rows: any[] }) {
    if (rows.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400 h-64 animate-in fade-in zoom-in-95">
                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold">No hay datos en la matriz de riesgos.</p>
                <p className="text-sm mt-1">Comienza agregando Establecimientos, Tareas y evaluando Peligros.</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-300">
            <table className="w-full text-left text-sm border-collapse bg-white">
                <thead>
                    <tr className="bg-slate-100/50 text-slate-500 uppercase tracking-wider text-[10px] font-black border-b border-slate-200">
                        <th className="p-3 border-r border-slate-200">Establecimiento</th>
                        <th className="p-3 border-r border-slate-200">Sector</th>
                        <th className="p-3 border-r border-slate-200">Proceso</th>
                        <th className="p-3 border-r border-slate-200">Puesto</th>
                        <th className="p-3 border-r border-slate-200">Tarea</th>
                        <th className="p-3 border-r border-slate-200 bg-indigo-50/50">Peligro</th>
                        <th className="p-3 border-r border-slate-200 bg-indigo-50/50 text-center">Tipo</th>
                        <th className="p-3 border-r border-slate-200 bg-emerald-50/50 text-center" title="Probabilidad">P</th>
                        <th className="p-3 border-r border-slate-200 bg-emerald-50/50 text-center" title="Severidad">S</th>
                        <th className="p-3 border-r border-slate-200 bg-emerald-50/50 text-center" title="Nivel de Riesgo">R</th>
                        <th className="p-3 border-r border-slate-200 bg-slate-50/50">Medidas Existentes</th>
                        <th className="p-3 bg-purple-50/50">Plan de Acción / Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {rows.map((r, i) => (
                        <tr key={i} className={`hover:bg-slate-50 transition-colors ${r.r === '-' ? 'opacity-60 bg-slate-50' : ''}`}>
                            <td className="p-3 align-top border-r border-slate-100 font-medium">{r.establishment}</td>
                            <td className="p-3 align-top border-r border-slate-100">{r.sector}</td>
                            <td className="p-3 align-top border-r border-slate-100">{r.process}</td>
                            <td className="p-3 align-top border-r border-slate-100">{r.role}</td>
                            <td className="p-3 align-top border-r border-slate-100 font-bold text-slate-800">{r.task}</td>
                            
                            <td className="p-3 align-top border-r border-slate-100 bg-indigo-50/10 font-bold">{r.hazardName}</td>
                            <td className="p-3 align-top border-r border-slate-100 bg-indigo-50/10 text-center text-[10px] uppercase">{r.hazardType}</td>
                            
                            <td className="p-3 align-top border-r border-slate-100 bg-emerald-50/10 text-center font-bold">{r.p}</td>
                            <td className="p-3 align-top border-r border-slate-100 bg-emerald-50/10 text-center font-bold">{r.s}</td>
                            <td className={`p-3 align-top border-r border-slate-100 text-center font-black ${r.color ? r.color : 'bg-emerald-50/10'}`}>
                                {r.r}
                            </td>
                            
                            <td className="p-3 align-top border-r border-slate-100 bg-slate-50/10 max-w-[200px] break-words">
                                {r.control}
                            </td>
                            
                            <td className="p-3 align-top bg-purple-50/10 max-w-[200px] break-words">
                                {r.action !== '-' ? (
                                    <div className="space-y-1">
                                        <p>{r.action}</p>
                                        <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                            r.actionStatus === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                            r.actionStatus === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {r.actionStatus === 'COMPLETED' ? 'Completado' : r.actionStatus === 'IN_PROGRESS' ? 'En Progreso' : 'Pendiente'}
                                        </span>
                                    </div>
                                ) : '-'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
