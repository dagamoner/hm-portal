"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, ShieldAlert, Trash2 } from "lucide-react";

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
    name: string;
    uso?: string;
    tipoMateriales?: string;
    tipoActividad?: string;
    subsectors: Subsector[];
};

const ACTIVIDADES = [
    "Residencial",
    "Administrativo",
    "Comercial",
    "Industrial",
    "Depósito",
    "Espectáculos",
    "Cultura"
];

const MATERIALES = [
    "Riesgo 1 (Explosivo)",
    "Riesgo 2 (Inflamable)",
    "Riesgo 3 (Muy Combustible)",
    "Riesgo 4 (Combustible)",
    "Riesgo 5 (Poco Combustible)",
    "Riesgo 6 (Incombustible)",
    "Riesgo 7 (Refractarios)"
];

// Matriz de Tabla 2.1 del Decreto 351/79
const calcularRiesgo = (actividad: string, material: string) => {
    if (!actividad || !material) return "-";
    
    const matIndex = MATERIALES.indexOf(material); // 0 to 6
    const r = `R${matIndex + 1}`; // R1 to R7
    
    if (actividad === "Residencial" || actividad === "Administrativo" || actividad === "Espectáculos" || actividad === "Cultura") {
        if (matIndex === 0 || matIndex === 1) return "NP"; // Riesgo 1 y 2 son No Permitidos
        if (matIndex === 2) return "R3";
        if (matIndex === 3) return "R4";
        return "-";
    }
    
    // Comercial, Industrial, Depósito
    if (actividad === "Comercial" || actividad === "Industrial" || actividad === "Depósito") {
        return r;
    }

    return "-";
};

export default function TiposRiesgoPCI({ company }: { company: any }) {
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    
    // Initialize sectors from DB
    const initialSectors: Sector[] = company.pciSectors 
        ? (typeof company.pciSectors === 'string' ? JSON.parse(company.pciSectors) : company.pciSectors) 
        : [];
    
    const [sectors, setSectors] = useState<Sector[]>(initialSectors);

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

    const deleteSector = (sectorId: string) => {
        if(confirm("¿Estás seguro de que deseas eliminar este sector y todos sus subsectores de forma permanente?")) {
            setSectors(prev => prev.filter(s => s.id !== sectorId));
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Tipo de Riesgo por Sector</h2>
                    <p className="text-sm text-slate-500">Definición de riesgo según Tabla 2.1 - Decreto 351/79.</p>
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

            {sectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores creados</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Ve a la pestaña "Sectores de Incendio" para crear los sectores antes de definir su tipo de riesgo.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full custom-scrollbar pb-2">
                        <table className="w-full text-left min-w-[1000px] border-collapse">
                            <thead>
                                <tr className="bg-[#1b5e3a] text-white">
                                    <th className="p-4 text-sm font-bold border-r border-[#154a2e] w-48">Sectores de Incendio</th>
                                    <th className="p-4 text-sm font-bold border-r border-[#154a2e] w-48">Uso</th>
                                    <th className="p-4 text-sm font-bold border-r border-[#154a2e]">Tipo de materiales predominantes en el sector</th>
                                    <th className="p-4 text-sm font-bold border-r border-[#154a2e] w-48">Tipo de actividad predominante en el sector</th>
                                    <th className="p-4 text-sm font-bold text-center w-32">Riesgo del sector</th>
                                    <th className="w-12 border-l border-[#154a2e]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {sectors.map((sector) => {
                                    const riesgoCalculado = calcularRiesgo(sector.tipoActividad || "", sector.tipoMateriales || "");
                                    const isNP = riesgoCalculado === "NP";

                                    return (
                                        <tr key={sector.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                                            <td className="p-0 border-r border-slate-200">
                                                <input 
                                                    type="text" 
                                                    value={sector.name || ""} 
                                                    onChange={(e) => updateSector(sector.id, 'name', e.target.value)}
                                                    className="w-full p-4 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm font-bold text-slate-800 outline-none"
                                                    placeholder="Nombre del Sector"
                                                />
                                            </td>
                                            <td className="p-0 border-r border-slate-200 bg-slate-50/50">
                                                <input 
                                                    type="text" 
                                                    value={sector.uso || ""} 
                                                    onChange={(e) => updateSector(sector.id, 'uso', e.target.value)}
                                                    className="w-full p-4 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm outline-none"
                                                    placeholder="Ej: Edificio"
                                                />
                                            </td>
                                            <td className="p-0 border-r border-slate-200 bg-slate-50/50">
                                                <select 
                                                    value={sector.tipoMateriales || ""}
                                                    onChange={(e) => updateSector(sector.id, 'tipoMateriales', e.target.value)}
                                                    className="w-full p-4 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Seleccionar Material...</option>
                                                    {MATERIALES.map(mat => (
                                                        <option key={mat} value={mat}>{mat}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-0 border-r border-slate-200 bg-slate-50/50">
                                                <select 
                                                    value={sector.tipoActividad || ""}
                                                    onChange={(e) => updateSector(sector.id, 'tipoActividad', e.target.value)}
                                                    className="w-full p-4 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Seleccionar Actividad...</option>
                                                    {ACTIVIDADES.map(act => (
                                                        <option key={act} value={act}>{act}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-black ${
                                                    isNP 
                                                        ? 'bg-red-100 text-red-700' 
                                                        : riesgoCalculado !== '-' 
                                                            ? 'bg-indigo-100 text-indigo-700'
                                                            : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                    {riesgoCalculado}
                                                </span>
                                            </td>
                                            <td className="p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => deleteSector(sector.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Eliminar Sector"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
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
