"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, ShieldAlert, Building2 } from "lucide-react";

type Subsector = {
    id: string;
    nombre: string;
    uso: string;
    areaBruta: number;
    circulaciones: number;
    usoComun: number;
};

type Sector = {
    id: string;
    establecimientoId?: string;
    name: string;
    uso?: string;
    subsectors: Subsector[];
    extintoresProyectados?: {
        pqs10: number | "";
        pqs5: number | "";
        co2: number | "";
        k: number | "";
    };
};

export default function VerificacionExtintoresPCI({ company }: { company: any }) {
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

    const initialSectors: Sector[] = company.pciSectors 
        ? (typeof company.pciSectors === 'string' ? JSON.parse(company.pciSectors) : company.pciSectors) 
        : [];
    
    const [sectors, setSectors] = useState<Sector[]>(initialSectors);

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

    const updateProyectado = (sectorId: string, tipo: keyof NonNullable<Sector['extintoresProyectados']>, valor: string) => {
        const numValue = valor === "" ? "" : Number(valor);
        
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                const actuales = s.extintoresProyectados || { pqs10: "", pqs5: "", co2: "", k: "" };
                return {
                    ...s,
                    extintoresProyectados: {
                        ...actuales,
                        [tipo]: numValue
                    }
                };
            }
            return s;
        }));
    };

    const getSectorTotalSuperficie = (sector: Sector) => {
        return sector.subsectors.reduce((acc, sub) => {
            const bruta = Number(sub.areaBruta) || 0;
            return acc + bruta;
        }, 0);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Verificación de cantidad de Extintores</h2>
                    <p className="text-sm text-slate-500">Cálculo de extintores mínimos (1 cada 200m²) y distribución proyectada.</p>
                </div>
                <div className="flex items-center gap-4">
                    {saveStatus === "success" && (
                        <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" /> Guardado exitosamente
                        </span>
                    )}
                    {saveStatus === "error" && (
                        <span className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-3 py-1.5 rounded-lg">
                            <AlertCircle className="w-4 h-4" /> Error al guardar
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        {isPending ? "Guardando..." : <><Save className="w-4 h-4" /> Guardar Cambios</>}
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

            {!selectedEstId ? (
                <div className="bg-slate-50 p-12 text-center rounded-3xl border border-slate-200 border-dashed">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-600 font-bold text-lg mb-2">Selecciona un Establecimiento</h3>
                    <p className="text-slate-500">Crea o selecciona un establecimiento arriba para verificar la cantidad de extintores de sus sectores.</p>
                </div>
            ) : filteredSectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores configurados en este establecimiento</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Debes crear los sectores de incendio en la pestaña "Sectores de Incendio".</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-green-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-center border-collapse">
                            <thead>
                                <tr className="bg-[#43a047] text-white">
                                    <th className="p-4 border border-[#2e7d32] font-semibold" rowSpan={2}>Sector de<br/>Incendio</th>
                                    <th className="p-4 border border-[#2e7d32] font-semibold" rowSpan={2}>Uso</th>
                                    <th className="p-4 border border-[#2e7d32] font-semibold" rowSpan={2}>Sup. (m²)</th>
                                    <th className="p-2 border border-[#2e7d32] font-semibold" colSpan={2}>Calculados</th>
                                    <th className="p-2 border border-[#2e7d32] font-semibold" colSpan={2}>Proyectados/Seleccionados</th>
                                </tr>
                                <tr className="bg-[#43a047] text-white">
                                    <th className="p-2 border border-[#2e7d32] font-semibold w-24">Cant.</th>
                                    <th className="p-2 border border-[#2e7d32] font-semibold w-32">Tipo</th>
                                    <th className="p-2 border border-[#2e7d32] font-semibold w-24">Cant.</th>
                                    <th className="p-2 border border-[#2e7d32] font-semibold w-48">Tipo</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredSectors.map((sector) => {
                                    const superficieTotal = getSectorTotalSuperficie(sector);
                                    const calculados = Math.round(superficieTotal / 200);
                                    
                                    const proy = sector.extintoresProyectados || { pqs10: "", pqs5: "", co2: "", k: "" };

                                    return (
                                        <React.Fragment key={sector.id}>
                                            <tr>
                                                <td className="border border-slate-300 p-2 font-medium bg-[#4caf50] text-white" rowSpan={4}>
                                                    {sector.name || "-"}
                                                </td>
                                                <td className="border border-slate-300 p-2" rowSpan={4}>
                                                    {sector.uso || "-"}
                                                </td>
                                                <td className="border border-slate-300 p-2 font-medium" rowSpan={4}>
                                                    {superficieTotal.toLocaleString('es-AR', {maximumFractionDigits: 2})}
                                                </td>
                                                <td className="border border-slate-300 p-2 font-black text-lg text-slate-800" rowSpan={4}>
                                                    {calculados}
                                                </td>
                                                <td className="border border-slate-300 p-2 text-slate-600 font-medium" rowSpan={4}>
                                                    ABC (10kg)
                                                </td>
                                                <td className="border border-slate-300 p-1">
                                                    <input
                                                        type="number"
                                                        value={proy.pqs10}
                                                        onChange={(e) => updateProyectado(sector.id, 'pqs10', e.target.value)}
                                                        className="w-full text-center border-none focus:ring-2 focus:ring-indigo-500 rounded p-1 outline-none text-slate-800 font-bold"
                                                        placeholder="-"
                                                    />
                                                </td>
                                                <td className="border border-slate-300 p-2 text-slate-700">
                                                    PQS (ABC) 10 Kg
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-slate-300 p-1">
                                                    <input
                                                        type="number"
                                                        value={proy.pqs5}
                                                        onChange={(e) => updateProyectado(sector.id, 'pqs5', e.target.value)}
                                                        className="w-full text-center border-none focus:ring-2 focus:ring-indigo-500 rounded p-1 outline-none text-slate-800 font-bold"
                                                        placeholder="-"
                                                    />
                                                </td>
                                                <td className="border border-slate-300 p-2 text-slate-700">
                                                    PQS (ABC) 5Kg
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-slate-300 p-1">
                                                    <input
                                                        type="number"
                                                        value={proy.co2}
                                                        onChange={(e) => updateProyectado(sector.id, 'co2', e.target.value)}
                                                        className="w-full text-center border-none focus:ring-2 focus:ring-indigo-500 rounded p-1 outline-none text-slate-800 font-bold"
                                                        placeholder="-"
                                                    />
                                                </td>
                                                <td className="border border-slate-300 p-2 text-slate-700">
                                                    CO₂ (BC) 5Kg
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border border-slate-300 p-1">
                                                    <input
                                                        type="number"
                                                        value={proy.k}
                                                        onChange={(e) => updateProyectado(sector.id, 'k', e.target.value)}
                                                        className="w-full text-center border-none focus:ring-2 focus:ring-indigo-500 rounded p-1 outline-none text-slate-800 font-bold"
                                                        placeholder="-"
                                                    />
                                                </td>
                                                <td className="border border-slate-300 p-2 text-slate-700">
                                                    K
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
