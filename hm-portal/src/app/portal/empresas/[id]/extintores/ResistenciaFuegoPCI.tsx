"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, ShieldAlert, Building2, Wind } from "lucide-react";

type Subsector = {
    id: string;
    nombre: string;
    uso: string;
    areaBruta: number;
    circulaciones: number;
    usoComun: number;
};

type MaterialCarga = {
    id: string;
    nombre: string;
    pqUnitario: number | "";
    cantidadKg: number | "";
};

type Sector = {
    id: string;
    establecimientoId?: string;
    name: string;
    uso?: string;
    tipoMateriales?: string;
    tipoActividad?: string;
    ventilacion?: string;
    subsectors: Subsector[];
    materialesCargaFuego?: MaterialCarga[];
};

const MATERIALES = [
    "Riesgo 1 (Explosivo)",
    "Riesgo 2 (Inflamable)",
    "Riesgo 3 (Muy Combustible)",
    "Riesgo 4 (Combustible)",
    "Riesgo 5 (Poco Combustible)",
    "Riesgo 6 (Incombustible)",
    "Riesgo 7 (Refractarios)"
];

const calcularRiesgo = (actividad: string, material: string) => {
    if (!actividad || !material) return "-";
    
    const matIndex = MATERIALES.indexOf(material);
    const r = `R${matIndex + 1}`;
    
    if (actividad === "Residencial" || actividad === "Administrativo" || actividad === "Espectáculos" || actividad === "Cultura") {
        if (matIndex === 0 || matIndex === 1) return "NP";
        if (matIndex === 2) return "R3";
        if (matIndex === 3) return "R4";
        return "-";
    }
    
    // For anything else (Comercial, Industrial, Depósito, or custom activities), use general rule
    return r;
};

const determinarResistencia = (qf: number, riesgo: string, ventilacion: string) => {
    if (riesgo === "NP" || riesgo === "-") return "-";
    
    // Extract risk number (1 to 5)
    const rNum = parseInt(riesgo.replace("R", ""));
    if (isNaN(rNum) || rNum < 1 || rNum > 5) return "-";

    // Determine QF row index
    let qfRow = -1;
    if (qf <= 15) qfRow = 0;
    else if (qf <= 30) qfRow = 1;
    else if (qf <= 60) qfRow = 2;
    else if (qf <= 100) qfRow = 3;
    else qfRow = 4; // > 100

    // Cuadro 2.2.1 (Ventilación Natural)
    const cuadroNatural = [
        ["-", "F 60", "F 30", "F 30", "-"],
        ["-", "F 90", "F 60", "F 30", "F 30"],
        ["-", "F 120", "F 90", "F 60", "F 30"],
        ["-", "F 180", "F 120", "F 90", "F 60"],
        ["-", "F 180", "F 180", "F 120", "F 90"]
    ];

    // Cuadro 2.2.2 (Ventilación Forzada)
    const cuadroForzada = [
        ["-", "NP", "F 60", "F 60", "F 30"],
        ["-", "NP", "F 90", "F 60", "F 60"],
        ["-", "NP", "F 120", "F 90", "F 60"],
        ["-", "NP", "F 180", "F 120", "F 90"],
        ["-", "NP", "NP", "F 180", "F 120"]
    ];

    const matrix = ventilacion === "Forzada" ? cuadroForzada : cuadroNatural;
    
    return matrix[qfRow][rNum - 1]; // rNum is 1-indexed (1 to 5)
};

export default function ResistenciaFuegoPCI({ company }: { company: any }) {
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    
    // Parse establecimientos from pciGeneralities
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

    // Initialize sectors from DB
    const initialSectors: Sector[] = company.pciSectors 
        ? (typeof company.pciSectors === 'string' ? JSON.parse(company.pciSectors) : company.pciSectors) 
        : [];
    
    const [sectors, setSectors] = useState<Sector[]>(initialSectors);

    // Filter sectors by the selected establecimiento
    const filteredSectors = sectors.filter(s => {
        if (s.establecimientoId) return s.establecimientoId === selectedEstId;
        // Legacy sector without ID
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

    const updateSector = (sectorId: string, field: keyof Sector, value: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return { ...s, [field]: value };
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
                    <h2 className="text-xl font-bold text-slate-800">Resistencia al Fuego</h2>
                    <p className="text-sm text-slate-500">Cálculo según el riesgo, carga de fuego y condiciones de ventilación.</p>
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
                    {establecimientos.length === 0 && <option value="" disabled>No hay establecimientos (Ve a Generalidades)</option>}
                    {establecimientos.map(est => (
                        <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                </select>
            </div>

            {!selectedEstId ? (
                <div className="bg-slate-50 p-12 text-center rounded-3xl border border-slate-200 border-dashed">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-600 font-bold text-lg mb-2">Selecciona un Establecimiento</h3>
                    <p className="text-slate-500">Crea o selecciona un establecimiento arriba para gestionar la resistencia al fuego de sus sectores.</p>
                </div>
            ) : filteredSectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores configurados en este establecimiento</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Debes crear los sectores de incendio en la pestaña "Sectores de Incendio".</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-left min-w-[1000px] border-collapse">
                            <thead>
                                <tr className="bg-slate-800 text-white border-b border-slate-700">
                                    <th className="p-4 text-sm font-bold border-r border-slate-700">Sector</th>
                                    <th className="p-4 text-sm font-bold text-center border-r border-slate-700 w-32">Riesgo</th>
                                    <th className="p-4 text-sm font-bold text-center border-r border-slate-700 w-40">Carga de Fuego<br/><span className="text-xs font-normal opacity-70">[kg/m²]</span></th>
                                    <th className="p-4 text-sm font-bold text-center border-r border-slate-700 w-48">
                                        <div className="flex items-center justify-center gap-2">
                                            <Wind className="w-4 h-4" /> Ventilación
                                        </div>
                                    </th>
                                    <th className="p-4 text-sm font-black text-center text-amber-300">Resistencia Fuego</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSectors.map((sector) => {
                                    // Calculate QF
                                    const superficieTotal = getSectorTotalSuperficie(sector);
                                    const materiales = sector.materialesCargaFuego || [];
                                    let pqTotal = 0;
                                    materiales.forEach(m => {
                                        const pq = Number(m.pqUnitario) || 0;
                                        const kg = Number(m.cantidadKg) || 0;
                                        pqTotal += (pq * kg);
                                    });
                                    const pmTotal = pqTotal / 4400;
                                    const qf = superficieTotal > 0 ? (pmTotal / superficieTotal) : 0;

                                    // Get Riesgo
                                    const riesgo = calcularRiesgo(sector.tipoActividad || "", sector.tipoMateriales || "");

                                    // Get Ventilation (default to Natural)
                                    const ventilacion = sector.ventilacion || "Natural";

                                    // Calculate Resistencia
                                    const resistencia = determinarResistencia(qf, riesgo, ventilacion);

                                    return (
                                        <tr key={sector.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                                            <td className="p-4 border-r border-slate-100 bg-slate-50/50">
                                                <div className="font-bold text-slate-800 text-base">{sector.name || "Sector Sin Nombre"}</div>
                                                <div className="text-xs text-slate-500 mt-1">{sector.uso || "Sin Uso Definido"}</div>
                                            </td>
                                            <td className="p-4 text-center border-r border-slate-100">
                                                <div className={`inline-flex items-center justify-center px-3 py-1 rounded-lg font-bold text-sm ${
                                                    riesgo === "NP" 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : riesgo === "-" 
                                                            ? 'bg-slate-100 text-slate-400' 
                                                            : 'bg-indigo-100 text-indigo-700'
                                                }`}>
                                                    {riesgo}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center border-r border-slate-100 font-mono text-slate-700 font-bold bg-orange-50/30">
                                                {qf.toLocaleString('es-AR', {maximumFractionDigits: 2})}
                                            </td>
                                            <td className="p-3 border-r border-slate-100 bg-blue-50/30">
                                                <select
                                                    value={ventilacion}
                                                    onChange={(e) => updateSector(sector.id, "ventilacion", e.target.value)}
                                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-bold text-slate-700 outline-none shadow-sm cursor-pointer"
                                                >
                                                    <option value="Natural">Natural</option>
                                                    <option value="Forzada">Forzada</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className={`inline-flex items-center justify-center px-4 py-2 rounded-xl font-black text-lg ${
                                                    resistencia === "-" 
                                                        ? 'bg-slate-100 text-slate-400' 
                                                        : resistencia === "NP"
                                                            ? 'bg-red-100 text-red-600 ring-2 ring-red-500'
                                                            : 'bg-amber-100 text-amber-700 ring-2 ring-amber-500 shadow-sm'
                                                }`}>
                                                    {resistencia}
                                                </div>
                                            </td>
                                        </tr>
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
