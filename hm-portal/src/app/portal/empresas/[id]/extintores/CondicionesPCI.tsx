"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, Building2, Check, X, Minus } from "lucide-react";
import { TEXTOS_CONDICIONES, MATRIZ_CUADRO_PCI } from "./data/condiciones351";

export default function CondicionesPCI({ company }: { company: any }) {
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const rawGen = company.pciGeneralities ? (typeof company.pciGeneralities === 'string' ? JSON.parse(company.pciGeneralities) : company.pciGeneralities) : null;
    let establecimientos: any[] = [];
    if (rawGen) {
        if (Array.isArray(rawGen)) {
            establecimientos = rawGen;
        } else {
            establecimientos = [{ id: "default", nombre: "Establecimiento Principal" }];
        }
    }

    const [selectedEstId, setSelectedEstId] = useState<string>(establecimientos[0]?.id || "");

    const initialSectors = company.pciSectors 
        ? (typeof company.pciSectors === 'string' ? JSON.parse(company.pciSectors) : company.pciSectors) 
        : [];
    
    const [sectors, setSectors] = useState<any[]>(initialSectors);

    const filteredSectors = sectors.filter(s => {
        if (s.establecimientoId) return s.establecimientoId === selectedEstId;
        return establecimientos.length > 0 && selectedEstId === establecimientos[0].id;
    });

    const handleSave = () => {
        setSaveStatus("idle");
        startTransition(async () => {
            const result = await updateCompanyPciSectors(company.id, sectors);
            if (result.success) {
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        });
    };

    const updateSectorField = (sectorId: string, field: string, value: any) => {
        setSectors(prev => prev.map(s => s.id === sectorId ? { ...s, [field]: value } : s));
    };

    const updateCondicion = (sectorId: string, condId: string, field: 'estado' | 'obs', value: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                const actuales = s.condicionesEstado || {};
                const condData = actuales[condId] || { estado: '', obs: '' };
                return {
                    ...s,
                    condicionesEstado: {
                        ...actuales,
                        [condId]: { ...condData, [field]: value }
                    }
                };
            }
            return s;
        }));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Condiciones Generales y Específicas</h2>
                    <p className="text-sm text-slate-500">Evaluación de condiciones requeridas por Dec. 351/79.</p>
                </div>
                <div className="flex items-center gap-4">
                    {saveStatus === "success" && (
                        <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" /> Guardado
                        </span>
                    )}
                    {saveStatus === "error" && (
                        <span className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg">
                            <AlertCircle className="w-4 h-4" /> Error
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? "Guardando..." : <><Save className="w-4 h-4" /> Guardar</>}
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <Building2 className="w-5 h-5 text-slate-400" />
                <select 
                    value={selectedEstId}
                    onChange={(e) => setSelectedEstId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                    {establecimientos.length === 0 && <option value="" disabled>No hay establecimientos</option>}
                    {establecimientos.map(est => (
                        <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                </select>
            </div>

            {filteredSectors.map((sector, sIdx) => {
                const riesgoNum = parseInt((sector.riesgoLvl || "").replace('R', '')) || 0;
                const matrizItem = MATRIZ_CUADRO_PCI.find(m => m.uso === sector.usoCuadroPCI && m.riesgo === riesgoNum);
                
                let condReq: any[] = [];
                if (matrizItem) {
                    const reqS = matrizItem.s.map(id => ({ id, tipo: 'Situación', desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] }));
                    const reqC = matrizItem.c.map(id => ({ id, tipo: 'Construcción', desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] }));
                    const reqE = matrizItem.e.map(id => ({ 
                        id, 
                        tipo: 'Extinción', 
                        desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] || id
                    }));
                    condReq = [...reqS, ...reqC, ...reqE];
                }

                return (
                    <div key={sector.id} className="bg-white rounded-3xl shadow-sm border-2 border-slate-200 overflow-hidden mb-8">
                        <div className="bg-slate-100 p-6 border-b border-slate-200">
                            <h3 className="text-2xl font-black text-slate-800">Sector {sIdx + 1}: {sector.name}</h3>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                                <div className="font-bold text-slate-700 whitespace-nowrap">Clasificación según Cuadro PCI:</div>
                                <select
                                    value={sector.usoCuadroPCI || ""}
                                    onChange={(e) => updateSectorField(sector.id, 'usoCuadroPCI', e.target.value)}
                                    className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                >
                                    <option value="" disabled>Seleccione el uso...</option>
                                    {Array.from(new Set(MATRIZ_CUADRO_PCI.map(m => m.uso))).map(u => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                                <div className="font-bold text-slate-700 whitespace-nowrap px-4 py-2 bg-slate-200 rounded-lg">
                                    Riesgo Detectado: {riesgoNum || "-"}
                                </div>
                            </div>

                            {!sector.usoCuadroPCI ? (
                                <div className="text-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 font-medium">
                                    Selecciona la clasificación arriba para desplegar el cuestionario correspondiente.
                                </div>
                            ) : !matrizItem ? (
                                <div className="text-center p-8 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold">
                                    El Riesgo actual ({riesgoNum}) no está contemplado en el Cuadro PCI para el uso seleccionado ({sector.usoCuadroPCI}).
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Generales */}
                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="bg-slate-100 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">
                                            Condiciones Generales
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {TEXTOS_CONDICIONES.generales.map(cond => {
                                                const val = sector.condicionesEstado?.[cond.id]?.estado || '';
                                                const obs = sector.condicionesEstado?.[cond.id]?.obs || '';
                                                return (
                                                    <div key={cond.id} className="p-4 flex flex-col xl:flex-row gap-4 hover:bg-slate-50 transition-colors">
                                                        <div className="xl:w-2/3">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs border border-indigo-200">{cond.id}</span>
                                                                <span className="text-xs font-bold text-slate-500 uppercase">{cond.tipo}</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 text-justify">{cond.descripcion}</p>
                                                        </div>
                                                        <div className="xl:w-1/3 flex flex-col gap-2">
                                                            <div className="flex rounded-lg overflow-hidden border border-slate-300 shadow-sm text-xs font-bold">
                                                                <button onClick={() => updateCondicion(sector.id, cond.id, 'estado', 'CUMPLE')} className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${val === 'CUMPLE' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><Check className="w-3 h-3"/> CUMPLE</button>
                                                                <div className="w-px bg-slate-300"></div>
                                                                <button onClick={() => updateCondicion(sector.id, cond.id, 'estado', 'NO CUMPLE')} className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${val === 'NO CUMPLE' ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><X className="w-3 h-3"/> NO CUMPLE</button>
                                                                <div className="w-px bg-slate-300"></div>
                                                                <button onClick={() => updateCondicion(sector.id, cond.id, 'estado', 'NO APLICA')} className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${val === 'NO APLICA' ? 'bg-slate-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><Minus className="w-3 h-3"/> N/A</button>
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                value={obs}
                                                                onChange={(e) => updateCondicion(sector.id, cond.id, 'obs', e.target.value)}
                                                                placeholder="Observaciones..."
                                                                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Específicas */}
                                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                        <div className="bg-indigo-50 px-4 py-3 font-bold text-indigo-900 border-b border-indigo-100 flex items-center justify-between">
                                            <span>Condiciones Específicas Requeridas</span>
                                            <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">{condReq.length} Aplicables</span>
                                        </div>
                                        {condReq.length === 0 ? (
                                            <div className="p-6 text-center text-slate-500 text-sm">No hay específicas.</div>
                                        ) : (
                                            <div className="divide-y divide-slate-100">
                                                {condReq.map(cond => {
                                                    const val = sector.condicionesEstado?.[cond.id]?.estado || '';
                                                    const obs = sector.condicionesEstado?.[cond.id]?.obs || '';
                                                    return (
                                                        <div key={cond.id} className="p-4 flex flex-col xl:flex-row gap-4 hover:bg-slate-50 transition-colors">
                                                            <div className="xl:w-2/3">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-xs border border-rose-200">{cond.id}</span>
                                                                    <span className="text-xs font-bold text-slate-500 uppercase">{cond.tipo}</span>
                                                                </div>
                                                                <p className="text-sm text-slate-600 text-justify">{cond.desc}</p>
                                                            </div>
                                                            <div className="xl:w-1/3 flex flex-col gap-2">
                                                                <div className="flex rounded-lg overflow-hidden border border-slate-300 shadow-sm text-xs font-bold">
                                                                    <button onClick={() => updateCondicion(sector.id, cond.id, 'estado', 'CUMPLE')} className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${val === 'CUMPLE' ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><Check className="w-3 h-3"/> CUMPLE</button>
                                                                    <div className="w-px bg-slate-300"></div>
                                                                    <button onClick={() => updateCondicion(sector.id, cond.id, 'estado', 'NO CUMPLE')} className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${val === 'NO CUMPLE' ? 'bg-red-500 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><X className="w-3 h-3"/> NO CUMPLE</button>
                                                                    <div className="w-px bg-slate-300"></div>
                                                                    <button onClick={() => updateCondicion(sector.id, cond.id, 'estado', 'NO APLICA')} className={`flex-1 py-2 flex items-center justify-center gap-1 transition-colors ${val === 'NO APLICA' ? 'bg-slate-600 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}><Minus className="w-3 h-3"/> N/A</button>
                                                                </div>
                                                                <input 
                                                                    type="text" 
                                                                    value={obs}
                                                                    onChange={(e) => updateCondicion(sector.id, cond.id, 'obs', e.target.value)}
                                                                    placeholder="Observaciones..."
                                                                    className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                                />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
