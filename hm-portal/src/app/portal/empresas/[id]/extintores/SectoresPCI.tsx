"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, Plus, Trash2, Edit2, Columns4, Building2 } from "lucide-react";

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
    subsectors: Subsector[];
    // ... other fields like risk, fire load, etc.
};

export default function SectoresPCI({ company }: { company: any }) {
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
    // If a sector doesn't have an establecimientoId, we assume it belongs to the first one for backward compatibility
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

    const addSector = () => {
        if (!selectedEstId) return alert("Por favor, crea un Establecimiento en la pestaña de Generalidades primero.");
        const newSector = { 
            id: Math.random().toString(36).substr(2, 9), 
            establecimientoId: selectedEstId,
            name: `Sector ${filteredSectors.length + 1}`, 
            subsectors: [] 
        };
        const nextList = [...sectors, newSector];
        setSectors(nextList);
        startTransition(async () => {
            await updateCompanyPciSectors(company.id, nextList);
        });
    };

    const deleteSector = (sectorId: string) => {
        if(confirm("¿Estás seguro de que deseas eliminar este sector y todos sus subsectores?")) {
            const nextList = sectors.filter(s => s.id !== sectorId);
            setSectors(nextList);
            startTransition(async () => {
                await updateCompanyPciSectors(company.id, nextList);
            });
        }
    };

    const renameSector = (sectorId: string, newName: string) => {
        setSectors(prev => prev.map(s => s.id === sectorId ? { ...s, name: newName } : s));
    };

    const addSubsector = (sectorId: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return {
                    ...s,
                    subsectors: [
                        ...s.subsectors,
                        {
                            id: Math.random().toString(36).substr(2, 9),
                            nombre: `${s.name.replace(/\D/g,'') || s.subsectors.length + 1}.${String(s.subsectors.length + 1).padStart(2, '0')}`,
                            uso: "Nuevo Sub-sector",
                            areaBruta: 0,
                            circulaciones: 0,
                            usoComun: 0
                        }
                    ]
                };
            }
            return s;
        }));
    };

    const updateSubsector = (sectorId: string, subsectorId: string, field: keyof Subsector, value: string | number) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return {
                    ...s,
                    subsectors: s.subsectors.map(sub => {
                        if (sub.id === subsectorId) {
                            return { ...sub, [field]: field === 'nombre' || field === 'uso' ? value : (Number(value) || 0) };
                        }
                        return sub;
                    })
                };
            }
            return s;
        }));
    };

    const deleteSubsector = (sectorId: string, subsectorId: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                return { ...s, subsectors: s.subsectors.filter(sub => sub.id !== subsectorId) };
            }
            return s;
        }));
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Sectores de Incendio</h2>
                    <p className="text-sm text-slate-500">Agrega y configura los diferentes sectores y subsectores de incendio del establecimiento.</p>
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

            {/* Selector de establecimientos */}
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
                <button
                    onClick={addSector}
                    disabled={!selectedEstId}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
                >
                    <Plus className="w-4 h-4" /> Agregar Sector
                </button>
            </div>

            {!selectedEstId ? (
                <div className="bg-slate-50 p-12 text-center rounded-3xl border border-slate-200 border-dashed">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-600 font-bold text-lg mb-2">Selecciona un Establecimiento</h3>
                    <p className="text-slate-500">Crea o selecciona un establecimiento arriba para gestionar sus sectores de incendio.</p>
                </div>
            ) : filteredSectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <Columns4 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores de incendio en este establecimiento</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Comienza creando el primer sector de incendio para luego ir dividiéndolo en sub-sectores y asignar sus áreas correspondientes.</p>
                    <button
                        onClick={addSector}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2 shadow-md transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> Crear Primer Sector
                    </button>
                </div>
            ) : (
                <div className="space-y-12">
                    {filteredSectors.map((sector, index) => {
                        // Calculate totals for the sector
                        const totalBruta = sector.subsectors.reduce((sum, sub) => sum + sub.areaBruta, 0);
                        const totalCirculaciones = sector.subsectors.reduce((sum, sub) => sum + sub.circulaciones, 0);
                        const totalUsoComun = sector.subsectors.reduce((sum, sub) => sum + sub.usoComun, 0);
                        const totalPiso = sector.subsectors.reduce((sum, sub) => sum + (sub.areaBruta - sub.circulaciones - sub.usoComun), 0);

                        return (
                            <div key={sector.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-[#1b5e3a] p-4 flex justify-between items-center text-white">
                                    <div className="flex items-center gap-3 group/title">
                                        <h3 className="text-xl font-bold flex items-center">
                                            <input 
                                                type="text" 
                                                value={sector.name} 
                                                onChange={(e) => renameSector(sector.id, e.target.value)}
                                                className="bg-transparent border-b border-transparent hover:border-white/50 focus:border-white focus:outline-none transition-colors px-1 w-64"
                                                placeholder="Nombre del Sector"
                                                title="Haz clic para renombrar el sector"
                                            />
                                            <Edit2 className="w-4 h-4 opacity-0 group-hover/title:opacity-100 transition-opacity ml-2 text-white/70" />
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => addSubsector(sector.id)}
                                            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" /> Agregar Sub-sector
                                        </button>
                                        <button 
                                            onClick={() => deleteSector(sector.id)}
                                            className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-lg transition-colors"
                                            title="Eliminar Sector completo"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto w-full custom-scrollbar pb-2">
                                    <table className="w-full text-left min-w-[1000px] border-collapse">
                                        <thead>
                                            <tr className="bg-[#1b5e3a] text-white">
                                                <th className="p-3 text-sm font-bold text-center border-r border-[#154a2e] w-24">Sectores de Incendio</th>
                                                <th className="p-3 text-sm font-bold border-r border-[#154a2e]">Uso</th>
                                                <th className="p-3 text-sm font-bold text-center border-r border-[#154a2e] w-32">Superficie Cubierta Total<br/><span className="text-xs font-normal opacity-80">[m²]</span></th>
                                                <th className="p-3 text-sm font-bold text-center border-r border-[#154a2e] w-32">Área de circulaciones<br/><span className="text-xs font-normal opacity-80">[m²]</span></th>
                                                <th className="p-3 text-sm font-bold text-center border-r border-[#154a2e] w-32">Áreas de uso común<br/><span className="text-xs font-normal opacity-80">[m²]</span></th>
                                                <th className="p-3 text-sm font-bold text-center w-32">Superficie de piso<br/><span className="text-xs font-normal opacity-80">[m²]</span></th>
                                                <th className="w-12"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Subsectors Rows */}
                                            {sector.subsectors.map((sub, sIdx) => {
                                                const superficiePiso = sub.areaBruta - sub.circulaciones - sub.usoComun;
                                                return (
                                                    <tr key={sub.id} className="border-b border-slate-200 hover:bg-slate-50 group">
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="text" 
                                                                value={sub.nombre} 
                                                                onChange={(e) => updateSubsector(sector.id, sub.id, 'nombre', e.target.value)}
                                                                className="w-full p-3 text-center bg-transparent focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm font-medium outline-none"
                                                                placeholder="Ej: 1.01"
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200">
                                                            <input 
                                                                type="text" 
                                                                value={sub.uso} 
                                                                onChange={(e) => updateSubsector(sector.id, sub.id, 'uso', e.target.value)}
                                                                className="w-full p-3 bg-transparent focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm italic text-slate-700 outline-none"
                                                                placeholder="Ej: Planta Baja"
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200 bg-slate-100/50">
                                                            <input 
                                                                type="number" 
                                                                step="0.01"
                                                                value={sub.areaBruta === 0 ? '' : sub.areaBruta} 
                                                                onChange={(e) => updateSubsector(sector.id, sub.id, 'areaBruta', e.target.value)}
                                                                className="w-full p-3 text-right bg-transparent focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm font-mono outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200 bg-slate-100/50">
                                                            <input 
                                                                type="number" 
                                                                step="0.01"
                                                                value={sub.circulaciones === 0 ? '' : sub.circulaciones} 
                                                                onChange={(e) => updateSubsector(sector.id, sub.id, 'circulaciones', e.target.value)}
                                                                className="w-full p-3 text-right bg-transparent focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm font-mono outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-0 border-r border-slate-200 bg-slate-100/50">
                                                            <input 
                                                                type="number" 
                                                                step="0.01"
                                                                value={sub.usoComun === 0 ? '' : sub.usoComun} 
                                                                onChange={(e) => updateSubsector(sector.id, sub.id, 'usoComun', e.target.value)}
                                                                className="w-full p-3 text-right bg-transparent focus:bg-white focus:ring-1 focus:ring-indigo-500 text-sm font-mono outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-3 text-right text-sm font-mono font-bold text-slate-800 bg-white">
                                                            {superficiePiso.toFixed(2)}
                                                        </td>
                                                        <td className="p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button 
                                                                onClick={() => deleteSubsector(sector.id, sub.id)}
                                                                className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                                title="Eliminar Sub-sector"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            
                                            {/* Sector Total Row */}
                                            <tr className="bg-slate-100 border-t-2 border-slate-300">
                                                <td colSpan={2} className="p-3 text-right font-bold text-slate-700">
                                                    Total del Sector
                                                </td>
                                                <td className="p-3 text-right font-mono font-bold text-slate-800 border-l border-slate-300">
                                                    {totalBruta.toFixed(2)}
                                                </td>
                                                <td className="p-3 text-right font-mono font-bold text-slate-800 border-l border-slate-300">
                                                    {totalCirculaciones.toFixed(2)}
                                                </td>
                                                <td className="p-3 text-right font-mono font-bold text-slate-800 border-l border-slate-300">
                                                    {totalUsoComun.toFixed(2)}
                                                </td>
                                                <td className="p-3 text-right font-mono font-black text-indigo-700 border-l border-slate-300 bg-indigo-50/50">
                                                    {totalPiso.toFixed(2)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    {sector.subsectors.length === 0 && (
                                        <div className="p-8 text-center text-slate-500 italic bg-white">
                                            Haz clic en "Agregar Sub-sector" para comenzar a cargar áreas.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
