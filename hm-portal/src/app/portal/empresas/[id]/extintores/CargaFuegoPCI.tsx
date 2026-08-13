"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, ShieldAlert, Plus, Trash2 } from "lucide-react";

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
    name: string;
    uso?: string;
    tipoMateriales?: string;
    tipoActividad?: string;
    subsectors: Subsector[];
    materialesCargaFuego?: MaterialCarga[];
};

// Extraídos de "Poderes Caloríficos para el cálculo de la Carga de Fuego" (Mcal/kg * 1000 = Kcal/kg)
const MATERIALES_DB = [
    { nombre: "Acumuladores de auto (batería)", kcal: 10000 },
    { nombre: "Aceites", kcal: 9500 },
    { nombre: "Acetaldheído", kcal: 6000 },
    { nombre: "Acetamida", kcal: 5000 },
    { nombre: "Acetato de Amilo", kcal: 8000 },
    { nombre: "Acetona", kcal: 7000 },
    { nombre: "Acetileno", kcal: 12000 },
    { nombre: "Acido acético", kcal: 4000 },
    { nombre: "Algodón", kcal: 4100 }, // En PDF dice 4, pero usamos 4100 del ejemplo si aplica, pondremos 4000
    { nombre: "Almidón", kcal: 4000 },
    { nombre: "Alcohol etílico", kcal: 6000 },
    { nombre: "Anilina", kcal: 9000 },
    { nombre: "Butano", kcal: 11000 },
    { nombre: "Carbono", kcal: 8000 },
    { nombre: "Caucho", kcal: 10000 },
    { nombre: "Cereales", kcal: 4000 },
    { nombre: "Cartón", kcal: 4000 },
    { nombre: "Celuloide", kcal: 4000 },
    { nombre: "Chocolate", kcal: 6000 },
    { nombre: "Cresol", kcal: 6000 },
    { nombre: "Cuero", kcal: 5000 },
    { nombre: "Fibras naturales", kcal: 4000 },
    { nombre: "Fósforo", kcal: 6000 },
    { nombre: "Gasoil", kcal: 10000 },
    { nombre: "Glicerina", kcal: 4000 },
    { nombre: "Grasas", kcal: 10000 },
    { nombre: "Harina", kcal: 4000 },
    { nombre: "Hexano", kcal: 11000 },
    { nombre: "Lana", kcal: 5000 },
    { nombre: "Libros y carpetas", kcal: 4000 },
    { nombre: "Maderas", kcal: 4400 },
    { nombre: "Magnesio", kcal: 6000 },
    { nombre: "Materiales sintéticos", kcal: 4000 },
    { nombre: "Metano", kcal: 12000 },
    { nombre: "Papel", kcal: 4000 },
    { nombre: "Petróleo", kcal: 10000 },
    { nombre: "Plástico", kcal: 9000 },
    { nombre: "Poliamida", kcal: 7000 },
    { nombre: "Polietileno", kcal: 11000 },
    { nombre: "Poliuretano", kcal: 6000 },
    { nombre: "P.V.C.", kcal: 5000 },
    { nombre: "Resinas", kcal: 6000 },
    { nombre: "Resinas sintéticas", kcal: 10000 },
    { nombre: "Te", kcal: 4000 },
    { nombre: "Textil", kcal: 4500 },
    { nombre: "Vestimentas", kcal: 4500 }
].sort((a, b) => a.nombre.localeCompare(b.nombre));

export default function CargaFuegoPCI({ company }: { company: any }) {
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

    const addMaterial = (sectorId: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                const newMaterial: MaterialCarga = {
                    id: crypto.randomUUID(),
                    nombre: "",
                    pqUnitario: "",
                    cantidadKg: ""
                };
                return { ...s, materialesCargaFuego: [...(s.materialesCargaFuego || []), newMaterial] };
            }
            return s;
        }));
    };

    const deleteMaterial = (sectorId: string, materialId: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return { ...s, materialesCargaFuego: (s.materialesCargaFuego || []).filter(m => m.id !== materialId) };
            }
            return s;
        }));
    };

    const updateMaterial = (sectorId: string, materialId: string, field: keyof MaterialCarga, value: string | number) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return {
                    ...s,
                    materialesCargaFuego: (s.materialesCargaFuego || []).map(m => {
                        if (m.id === materialId) {
                            const updated = { ...m, [field]: value };
                            // Si el usuario cambia el nombre desde el datalist, podemos auto-completar el Kcal
                            if (field === "nombre") {
                                const found = MATERIALES_DB.find(db => db.nombre === value);
                                if (found) {
                                    updated.pqUnitario = found.kcal;
                                }
                            }
                            return updated;
                        }
                        return m;
                    })
                };
            }
            return s;
        }));
    };

    const getSectorTotalSuperficie = (sector: Sector) => {
        return sector.subsectors.reduce((acc, sub) => {
            const bruta = Number(sub.areaBruta) || 0;
            const circ = Number(sub.circulaciones) || 0;
            const comun = Number(sub.usoComun) || 0;
            return acc + (bruta - circ - comun);
        }, 0);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Carga de Fuego por Sector</h2>
                    <p className="text-sm text-slate-500">Cálculo de QF (Kg madera / m²) según poder calorífico.</p>
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

            {/* Datalist for autocomplete */}
            <datalist id="materiales-db">
                {MATERIALES_DB.map((mat, i) => (
                    <option key={i} value={mat.nombre} />
                ))}
            </datalist>

            {sectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores creados</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Ve a la pestaña "Sectores de Incendio" para crear los sectores.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {sectors.map(sector => {
                        const totalSuperficie = getSectorTotalSuperficie(sector);
                        const materiales = sector.materialesCargaFuego || [];
                        
                        let totalAcumuladoKcal = 0;
                        materiales.forEach(m => {
                            const pq = Number(m.pqUnitario) || 0;
                            const kg = Number(m.cantidadKg) || 0;
                            totalAcumuladoKcal += (pq * kg);
                        });

                        const pm = totalAcumuladoKcal / 4400; // Peso en Kg madera
                        const qf = totalSuperficie > 0 ? pm / totalSuperficie : 0; // Kg madera / m2

                        return (
                            <div key={sector.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{sector.name || "Sector Sin Nombre"}</h3>
                                        <p className="text-sm text-slate-300">{sector.uso || "Sin Uso Definido"}</p>
                                    </div>
                                    <button 
                                        onClick={() => addMaterial(sector.id)}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" /> Agregar Material
                                    </button>
                                </div>
                                
                                <div className="overflow-x-auto w-full custom-scrollbar pb-2 p-6">
                                    <table className="w-full text-left min-w-[800px] border-collapse mb-6">
                                        <thead>
                                            <tr className="bg-[#4caf50] text-white">
                                                <th className="p-3 text-sm font-bold border-r border-[#3d8c40]">MATERIALES</th>
                                                <th className="p-3 text-sm font-bold border-r border-[#3d8c40] text-right">PQ UNITARIO (Kcal/Kg)</th>
                                                <th className="p-3 text-sm font-bold border-r border-[#3d8c40] text-right">Material Existente (Kg)</th>
                                                <th className="p-3 text-sm font-bold text-right">PQ Acumulado (Kcal)</th>
                                                <th className="w-12 border-l border-[#3d8c40]"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {materiales.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="p-4 text-center text-slate-400 italic bg-slate-50">
                                                        No hay materiales cargados en este sector.
                                                    </td>
                                                </tr>
                                            ) : materiales.map((mat) => {
                                                const pq = Number(mat.pqUnitario) || 0;
                                                const kg = Number(mat.cantidadKg) || 0;
                                                const acumulado = pq * kg;

                                                return (
                                                    <tr key={mat.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors group">
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="text" 
                                                                list="materiales-db"
                                                                value={mat.nombre} 
                                                                onChange={(e) => updateMaterial(sector.id, mat.id, 'nombre', e.target.value)}
                                                                className="w-full p-3 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm outline-none"
                                                                placeholder="Ej: Madera, Papel..."
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="number" 
                                                                value={mat.pqUnitario} 
                                                                onChange={(e) => updateMaterial(sector.id, mat.id, 'pqUnitario', e.target.value)}
                                                                className="w-full p-3 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm text-right outline-none font-mono"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="number" 
                                                                value={mat.cantidadKg} 
                                                                onChange={(e) => updateMaterial(sector.id, mat.id, 'cantidadKg', e.target.value)}
                                                                className="w-full p-3 bg-transparent focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-500 text-sm text-right outline-none font-mono"
                                                                placeholder="0"
                                                            />
                                                        </td>
                                                        <td className="p-3 text-right font-mono font-bold text-slate-700 bg-slate-50/50">
                                                            {acumulado > 0 ? acumulado.toLocaleString('es-AR') : "0"}
                                                        </td>
                                                        <td className="p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => deleteMaterial(sector.id, mat.id)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                                title="Eliminar Material"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                        {materiales.length > 0 && (
                                            <tfoot className="bg-slate-100">
                                                <tr>
                                                    <td colSpan={3} className="p-3 text-right font-bold text-slate-800 border-r border-slate-200">
                                                        Total Acumulado =
                                                    </td>
                                                    <td className="p-3 text-right font-bold font-mono text-slate-900 border-r border-slate-200">
                                                        {totalAcumuladoKcal > 0 ? totalAcumuladoKcal.toLocaleString('es-AR') : "0"}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        )}
                                    </table>

                                    {/* Summary Table */}
                                    <div className="flex justify-end pr-12">
                                        <table className="border-collapse bg-slate-50 border border-slate-200 rounded-xl overflow-hidden w-96 text-sm">
                                            <tbody>
                                                <tr className="border-b border-slate-200">
                                                    <td className="p-3 text-right font-bold text-slate-600 border-r border-slate-200 bg-white">Pm =</td>
                                                    <td className="p-3 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                                                        {pm.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                                    </td>
                                                    <td className="p-3 text-slate-500 font-mono text-xs w-24">Kg madera</td>
                                                </tr>
                                                <tr className="border-b border-slate-200">
                                                    <td className="p-3 text-right font-bold text-slate-600 border-r border-slate-200 bg-white">Sup. =</td>
                                                    <td className="p-3 text-right font-mono font-bold text-slate-800 border-r border-slate-200">
                                                        {totalSuperficie.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </td>
                                                    <td className="p-3 text-slate-500 font-mono text-xs">m²</td>
                                                </tr>
                                                <tr>
                                                    <td className="p-3 text-right font-black text-indigo-700 border-r border-slate-200 bg-indigo-50/50">QF =</td>
                                                    <td className="p-3 text-right font-mono font-black text-indigo-700 border-r border-slate-200 bg-indigo-50/50 text-base">
                                                        {qf.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                                    </td>
                                                    <td className="p-3 text-indigo-500 font-mono text-xs bg-indigo-50/50 font-bold">Kg mad / m²</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
