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
    tipoUsoEscape?: string;
};

type Sector = {
    id: string;
    establecimientoId?: string;
    name: string;
    uso?: string;
    subsectors: Subsector[];
    edificioExistente?: boolean;
    anchoRealEscape?: string;
};

const TIPOS_USO_ESCAPE = [
    { id: 'a', label: 'a) Sitios de asambleas, auditorios, salas de conciertos...', x: 1 },
    { id: 'b', label: 'b) Edificios educacionales, templos', x: 2 },
    { id: 'c', label: 'c) Lugares de trabajo, locales, patios y terrazas (comercio...)', x: 3 },
    { id: 'd', label: 'd) Salones de billares, canchas de bolos, gimnasios...', x: 5 },
    { id: 'e', label: 'e) Edificio de escritorios y oficinas, bancos, bibliotecas...', x: 8 },
    { id: 'f', label: 'f) Viviendas privadas y colectivas', x: 12 },
    { id: 'g', label: 'g) Edificios industriales (por defecto)', x: 16 },
    { id: 'h', label: 'h) Salas de juego', x: 2 },
    { id: 'i', label: 'i) Grandes tiendas, supermercados (PB y 1er subsuelo)', x: 3 },
    { id: 'j', label: 'j) Grandes tiendas, supermercados (pisos superiores)', x: 8 },
    { id: 'k', label: 'k) Hoteles, planta baja y restaurantes', x: 3 },
    { id: 'l', label: 'l) Hoteles, pisos superiores', x: 20 },
    { id: 'm', label: 'm) Depósitos', x: 30 }
];

export default function MediosEscapePCI({ company }: { company: any }) {
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

    const updateSectorField = (sectorId: string, field: string, value: any) => {
        setSectors(prev => prev.map(s => s.id === sectorId ? { ...s, [field]: value } : s));
    };

    const updateSubsectorEscape = (sectorId: string, subsectorId: string, tipo: string) => {
        setSectors(prev => prev.map(s => {
            if (s.id === sectorId) {
                const newSubs = s.subsectors.map(sub => {
                    if (sub.id === subsectorId) {
                        return { ...sub, tipoUsoEscape: tipo };
                    }
                    return sub;
                });
                return { ...s, subsectors: newSubs };
            }
            return s;
        }));
    };

    const calcularMediosDeEscape = (n: number) => {
        if (n <= 3) return 1;
        return Math.round(n / 4) + 1;
    };

    const calcularMetrosUAS = (nUas: number, esExistente: boolean) => {
        if (nUas <= 0) return 0;
        if (nUas <= 2) {
            return esExistente ? 0.96 : 1.10;
        }
        const base = esExistente ? 0.96 : 1.10;
        const extra = (nUas - 2) * 0.45;
        return base + extra;
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Medios de Escape</h2>
                    <p className="text-sm text-slate-500">Determinación de u.a.s. y verificación de escape según Dec. 351/79.</p>
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
                    <p className="text-slate-500">Crea o selecciona un establecimiento arriba para evaluar sus medios de escape.</p>
                </div>
            ) : filteredSectors.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center">
                    <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-600 mb-2">No hay sectores configurados en este establecimiento</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-6">Debes crear los sectores de incendio en la pestaña "Sectores de Incendio".</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {filteredSectors.map((sector, index) => {
                        let sTotal = 0;
                        let nTotalPersonas = 0;
                        
                        const subsectorsData = sector.subsectors.map(sub => {
                            const tipoObj = TIPOS_USO_ESCAPE.find(t => t.id === sub.tipoUsoEscape);
                            const xVal = tipoObj ? tipoObj.x : 0;
                            const sup = Number(sub.areaBruta) || 0;
                            const nPersonas = xVal > 0 ? Math.round(sup / xVal) : 0;
                            const nUas = nPersonas / 100;
                            const medios = calcularMediosDeEscape(nUas);

                            sTotal += sup;
                            nTotalPersonas += nPersonas;

                            return {
                                ...sub,
                                xVal,
                                sup,
                                nPersonas,
                                nUas,
                                medios
                            };
                        });

                        const nUasTotal = nTotalPersonas / 100;
                        const esExistente = sector.edificioExistente || false;
                        const metrosRequeridos = calcularMetrosUAS(Math.ceil(nUasTotal), esExistente);
                        const anchoReal = Number(sector.anchoRealEscape) || 0;
                        const cumpleEscape = anchoReal >= metrosRequeridos && anchoReal > 0;

                        return (
                            <div key={sector.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="bg-slate-100 p-4 border-b border-slate-200">
                                    <h3 className="text-lg font-bold text-slate-800">Sector {index + 1}: {sector.name}</h3>
                                </div>
                                
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-center border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-[#43a047] text-white">
                                                <th className="p-3 border border-[#2e7d32] font-semibold text-left">Subsector</th>
                                                <th className="p-3 border border-[#2e7d32] font-semibold w-32">Tipo de Uso</th>
                                                <th className="p-3 border border-[#2e7d32] font-semibold w-24">X [m²/pers]</th>
                                                <th className="p-3 border border-[#2e7d32] font-semibold w-28">Sup. piso (m²)</th>
                                                <th className="p-3 border border-[#2e7d32] font-semibold w-24">Nº pers. a evacuar</th>
                                                <th className="p-3 border border-[#2e7d32] font-semibold w-20">"n" u.a.s.</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white">
                                            {subsectorsData.map((sub, sIndex) => (
                                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-2 border border-slate-300 text-left text-slate-700">
                                                        {index + 1}.{sIndex + 1} - {sub.nombre || "Subsector"}
                                                    </td>
                                                    <td className="p-1 border border-slate-300">
                                                        <select
                                                            value={sub.tipoUsoEscape || ""}
                                                            onChange={(e) => updateSubsectorEscape(sector.id, sub.id, e.target.value)}
                                                            className="w-full text-center p-1 bg-white border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                                        >
                                                            <option value="" disabled>-</option>
                                                            {TIPOS_USO_ESCAPE.map(t => (
                                                                <option key={t.id} value={t.id} title={t.label}>{t.id}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="p-2 border border-slate-300 font-medium">
                                                        {sub.xVal > 0 ? sub.xVal : "-"}
                                                    </td>
                                                    <td className="p-2 border border-slate-300">
                                                        {sub.sup.toLocaleString('es-AR', {maximumFractionDigits: 2})}
                                                    </td>
                                                    <td className="p-2 border border-slate-300">
                                                        {sub.xVal > 0 ? sub.nPersonas : "-"}
                                                    </td>
                                                    <td className="p-2 border border-slate-300">
                                                        {sub.xVal > 0 ? sub.nUas.toLocaleString('es-AR', {minimumFractionDigits: 1, maximumFractionDigits: 1}) : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div className="p-6 bg-slate-50 border-t border-slate-200">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">U.A.S. Calculadas</div>
                                            <div className="text-3xl font-black text-slate-800">{nUasTotal.toLocaleString('es-AR', {minimumFractionDigits:1, maximumFractionDigits:1})}</div>
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm cursor-pointer w-max">
                                                <input 
                                                    type="checkbox" 
                                                    checked={sector.edificioExistente || false}
                                                    onChange={(e) => updateSectorField(sector.id, 'edificioExistente', e.target.checked)}
                                                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                Edificio Existente
                                            </label>
                                        </div>

                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Ancho Requerido (m)</div>
                                            <div className="text-3xl font-black text-indigo-600">{metrosRequeridos.toFixed(2)}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Ancho Real (m)</div>
                                            <input 
                                                type="number" 
                                                value={sector.anchoRealEscape || ''}
                                                onChange={(e) => updateSectorField(sector.id, 'anchoRealEscape', e.target.value)}
                                                placeholder="Ej: 7.50"
                                                className="w-full text-2xl font-black text-slate-800 bg-white border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 bg-white p-5 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-100">
                                            <span className="font-bold text-slate-500">Evaluación del Sector:</span>
                                            <span className={`px-4 py-1.5 rounded-full font-black text-sm border-2 ${anchoReal > 0 ? (cumpleEscape ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700') : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                                                {anchoReal > 0 ? (cumpleEscape ? 'CUMPLE' : 'NO CUMPLE') : 'INGRESAR ANCHO REAL'}
                                            </span>
                                        </div>
                                        <p className="text-base">
                                            "Para el Sector de Incendio {index + 1}, necesitaremos medios de escape que, en total, sea de <strong>{metrosRequeridos.toFixed(2)} m</strong>, medios de escape de <strong>{Math.ceil(nUasTotal)} u.a.s.</strong> <strong className={cumpleEscape ? 'text-emerald-600' : 'text-red-600'}>{anchoReal > 0 ? (cumpleEscape ? 'CUMPLE' : 'NO CUMPLE') : '---'}</strong>."
                                        </p>
                                        <p className="mt-3 text-slate-500">
                                            "Todas las puertas consideradas como salidas de emergencia (PE o EXIT), deben estar construidas con materiales incombustibles, deben estar dispuestas de forma tal que el sentido de apertura sea hacia el exterior (Dirección de evacuación), y que no interfieran con vías de escape al ser abiertas. Además, las salidas de emergencia deben estar equipadas con un dispositivo de apertura tipo barra antipánico (En caso de contar con cerradura o traba), deben estar visiblemente señalizadas e iluminadas por luces de emergencia (o cartelería de salida con iluminación permanente)."
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
