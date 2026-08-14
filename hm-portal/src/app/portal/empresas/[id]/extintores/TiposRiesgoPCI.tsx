"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, ShieldAlert, Trash2, Building2 } from "lucide-react";

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

const calcularRiesgo = (actividad: string, material: string) => {
    if (!actividad || !material) return "-";
    
    const matIndex = MATERIALES.indexOf(material);
    if (matIndex === -1) return "-";
    const r = `R${matIndex + 1}`;
    
    const restringidas = ["Residencial", "Administrativo", "Espectáculos", "Cultura"];
    if (restringidas.includes(actividad)) {
        if (matIndex === 0 || matIndex === 1) return "NP";
        if (matIndex === 2) return "R3";
        if (matIndex === 3) return "R4";
        return "-";
    }
    
    // Para Comercial, Industrial, Depósito u otras personalizadas, se aplica la regla general
    return r;
};

export default function TiposRiesgoPCI({ company }: { company: any }) {
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

    const updateSector = (sectorId: string, field: keyof Sector, value: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return { ...s, [field]: value };
            }
            return s;
        }));
    };

    const deleteSector = (sectorId: string) => {
        if(confirm("¿Estás seguro de que deseas eliminar la configuración de riesgo de este sector? (El sector se mantendrá pero sus datos de riesgo se borrarán)")) {
            setSectors(prev => prev.map(s => {
                if (s.id === sectorId) {
                    return { ...s, uso: "", tipoMateriales: "", tipoActividad: "" };
                }
                return s;
            }));
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Tipo de Riesgo (Tabla 2.1)</h2>
                    <p className="text-sm text-slate-500">Dec. 351/79 Cap. 18 - Definición del tipo de riesgo por sector según actividad y materiales.</p>
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
                    <p className="text-slate-500">Crea o selecciona un establecimiento arriba para gestionar los riesgos de sus sectores.</p>
                </div>
            ) : filteredSectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores configurados en este establecimiento</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Debes crear los sectores de incendio en la pestaña "Sectores de Incendio" antes de poder asignarles su tipo de riesgo.</p>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-left min-w-[900px] border-collapse">
                            <thead>
                                <tr className="bg-indigo-900 text-white">
                                    <th className="p-4 text-sm font-bold border-r border-indigo-800 w-1/4">Sector de Incendio</th>
                                    <th className="p-4 text-sm font-bold border-r border-indigo-800 w-1/5">Actividad Predominante</th>
                                    <th className="p-4 text-sm font-bold border-r border-indigo-800 w-1/4">Material Predominante (Inciso 1.5)</th>
                                    <th className="p-4 text-sm font-bold text-center border-r border-indigo-800">Riesgo (Tabla 2.1)</th>
                                    <th className="w-12"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSectors.map((sector) => {
                                    const riesgo = calcularRiesgo(sector.tipoActividad || "", sector.tipoMateriales || "");
                                    const isNP = riesgo === "NP";
                                    
                                    return (
                                        <tr key={sector.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                                            <td className="p-0 border-r border-slate-200 bg-slate-100/30">
                                                <input 
                                                    type="text" 
                                                    value={sector.name} 
                                                    readOnly
                                                    className="w-full p-4 bg-transparent text-sm font-bold text-slate-700 outline-none cursor-not-allowed"
                                                />
                                            </td>
                                            <td className="p-0 border-r border-slate-200">
                                                <input
                                                    type="text"
                                                    list="actividades-list"
                                                    value={sector.tipoActividad || ""}
                                                    onChange={(e) => updateSector(sector.id, "tipoActividad", e.target.value)}
                                                    onBlur={handleSave}
                                                    placeholder="Seleccionar o escribir actividad..."
                                                    className="w-full p-4 bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
                                                />
                                            </td>
                                            <td className="p-0 border-r border-slate-200">
                                                <select
                                                    value={sector.tipoMateriales || ""}
                                                    onChange={(e) => updateSector(sector.id, "tipoMateriales", e.target.value)}
                                                    className="w-full p-4 bg-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 text-sm outline-none appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Seleccionar Material...</option>
                                                    {MATERIALES.map(m => <option key={m} value={m}>{m}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-4 text-center border-r border-slate-200">
                                                <div className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full font-black text-sm ${
                                                    isNP 
                                                        ? 'bg-red-100 text-red-700 ring-2 ring-red-500' 
                                                        : riesgo === "-" 
                                                            ? 'bg-slate-100 text-slate-400' 
                                                            : 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500'
                                                }`}>
                                                    {isNP ? 'NO PERMITIDO (NP)' : riesgo}
                                                </div>
                                            </td>
                                            <td className="p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => deleteSector(sector.id)}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    title="Limpiar datos de riesgo"
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
                    <datalist id="actividades-list">
                        {ACTIVIDADES.map(a => <option key={a} value={a} />)}
                    </datalist>
                </div>
            )}
        </div>
    );
}
