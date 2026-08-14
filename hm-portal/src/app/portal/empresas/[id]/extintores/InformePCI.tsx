"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors, updateCompany } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, Building2, FileText, Check, X, Minus } from "lucide-react";
import { TEXTOS_CONDICIONES, MATRIZ_CUADRO_PCI } from "./data/condiciones351";

import { generateWordReport } from "./exportWord";

export default function InformePCI({ company }: { company: any }) {
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
    const establecimiento = establecimientos.find(e => e.id === selectedEstId) || establecimientos[0];

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
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden print:w-full print:max-w-none print:p-0 print:m-0 print:space-y-0">
            <style>{`
                @media print {
                    @page { margin: 15mm; size: A4 portrait; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; }
                    .print\\:hidden { display: none !important; }
                    .page-break-after { page-break-after: always; }
                    .page-break-before { page-break-before: always; }
                    .avoid-break { page-break-inside: avoid; }
                    /* Force components to render full width for printing */
                    .shadow-sm, .border-2 { box-shadow: none !important; border-width: 1px !important; border-color: #e2e8f0 !important; }
                }
            `}</style>

            {/* PORTADA SOLO PARA IMPRESIÓN */}
            <div className="hidden print:flex flex-col items-center justify-center min-h-[250mm] page-break-after p-12 text-center bg-white">
                <img src="/logo-mh.png" alt="Logo MH" className="w-64 h-auto mb-16" />
                <h1 className="text-4xl font-black text-rose-600 mb-6 uppercase tracking-wider leading-tight">
                    Proyecto de Instalaciones de<br/>Protección Contra Incendios
                </h1>
                <h2 className="text-2xl font-bold text-amber-500 mb-16 uppercase">
                    {establecimiento?.nombre || "Establecimiento Principal"}
                </h2>
                
                <div className="w-full max-w-2xl border-t-4 border-b-4 border-slate-100 py-8 my-8 text-left grid grid-cols-2 gap-8">
                    <div>
                        <div className="text-xs font-bold uppercase text-slate-400 mb-1">Empresa / Razón Social</div>
                        <div className="text-xl font-black text-slate-800">{company?.nombre || "-"}</div>
                        <div className="text-sm text-slate-500 mt-1">CUIT: {company?.cuit || "-"}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase text-slate-400 mb-1">Ubicación / Domicilio</div>
                        <div className="text-xl font-black text-slate-800">{establecimiento?.domicilio || "-"}</div>
                        <div className="text-sm text-slate-500 mt-1">{establecimiento?.actividad || "-"}</div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20 print:hidden">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Informe del Sistema de Protección Contra Incendios</h2>
                    <p className="text-sm text-slate-500">Reporte final consolidado y evaluación de condiciones (Dec. 351/79).</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => generateWordReport(company, establecimiento, filteredSectors)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                    >
                        <FileText className="w-4 h-4" /> Word
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all"
                    >
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
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

            {establecimiento && (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                    <div className="p-8 space-y-12">
                        
                        {/* 1. Generalidades */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                                <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                                Generalidades y Establecimiento
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-slate-500 block mb-1">Nombre:</strong> <span className="font-bold text-slate-800 text-lg">{establecimiento.nombre || "-"}</span></div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-slate-500 block mb-1">Domicilio:</strong> <span className="font-bold text-slate-800 text-lg">{establecimiento.domicilio || "-"}</span></div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-slate-500 block mb-1">Actividad:</strong> <span className="font-bold text-slate-800 text-lg">{establecimiento.actividad || "-"}</span></div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200"><strong className="text-slate-500 block mb-1">Superficie Total:</strong> <span className="font-bold text-slate-800 text-lg">{establecimiento.superficieTotal || "0"} m²</span></div>
                            </div>
                        </section>

                        {/* 2. Sectores */}
                        <section>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                                <span className="bg-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                                Sectores de Incendio
                            </h3>
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="px-4 py-3">Sector</th>
                                            <th className="px-4 py-3">Subsectores</th>
                                            <th className="px-4 py-3">Superficie (m²)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {filteredSectors.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-slate-500">No hay sectores definados.</td></tr>}
                                        {filteredSectors.map((s, i) => (
                                            <tr key={s.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-bold text-slate-800">Sector {i+1}: {s.name || "-"}</td>
                                                <td className="px-4 py-3 text-slate-600">
                                                    {s.subsectors?.map((sub: any) => sub.nombre).join(", ") || "-"}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {s.subsectors?.reduce((acc: number, sub: any) => acc + (Number(sub.areaBruta) || 0), 0).toLocaleString('es-AR')} m²
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                    </div>
                </div>
            )}

            {filteredSectors.map((sector, sIdx) => {
                const superficieTotal = sector.subsectors?.reduce((acc: number, sub: any) => acc + (Number(sub.areaBruta) || 0), 0) || 0;
                const extintoresCalculados = Math.round(superficieTotal / 200);
                
                // U.A.S.
                let nTotalPersonas = 0;
                const TIPOS_USO_ESCAPE = [
                    { id: 'a', x: 1 }, { id: 'b', x: 2 }, { id: 'c', x: 3 }, { id: 'd', x: 5 },
                    { id: 'e', x: 8 }, { id: 'f', x: 12 }, { id: 'g', x: 16 }, { id: 'h', x: 2 },
                    { id: 'i', x: 3 }, { id: 'j', x: 8 }, { id: 'k', x: 3 }, { id: 'l', x: 20 }, { id: 'm', x: 30 }
                ];
                sector.subsectors?.forEach((sub: any) => {
                    const tipoObj = TIPOS_USO_ESCAPE.find(t => t.id === sub.tipoUsoEscape);
                    if (tipoObj && tipoObj.x > 0) {
                        nTotalPersonas += Math.round((Number(sub.areaBruta) || 0) / tipoObj.x);
                    }
                });
                const nUasTotal = nTotalPersonas / 100;
                
                // Medios escape
                const esExistente = sector.edificioExistente || false;
                const metrosRequeridos = calcularMetrosUAS(Math.ceil(nUasTotal), esExistente);
                const anchoReal = Number(sector.anchoRealEscape) || 0;
                const cumpleEscape = anchoReal >= metrosRequeridos && anchoReal > 0;

                // Matriz
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
                    <div key={sector.id} className="bg-white rounded-3xl shadow-sm border-2 border-slate-200 overflow-hidden mb-8 page-break-after">
                        <div className="bg-slate-100 p-6 border-b border-slate-200">
                            <h3 className="text-2xl font-black text-slate-800">Sector {sIdx + 1}: {sector.name}</h3>
                            <p className="text-slate-600 font-medium mt-1">Evaluación Detallada del Sector</p>
                        </div>
                        
                        <div className="p-8 space-y-12">
                            
                            {/* Puntos 3 a 7 */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <section>
                                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                        <span className="bg-rose-100 text-rose-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                        Tipo de Riesgo
                                    </h4>
                                    <div className="text-4xl font-black text-rose-600">{sector.riesgoLvl || "-"}</div>
                                </section>
                                
                                <section>
                                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                        <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                                        Carga de Fuego
                                    </h4>
                                    <div className="text-3xl font-black text-slate-800">{sector.cargaFuego || "-"} <span className="text-lg text-slate-500 font-medium">kg/m²</span></div>
                                    <div className="text-sm text-slate-500 mt-2">Equivalente en madera (4400 kcal/kg)</div>
                                </section>
                                
                                <section>
                                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                        <span className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">5</span>
                                        Resistencia al Fuego
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Vent. Natural</div>
                                            <div className="font-black text-slate-800">{sector.resistenciaFuego?.natural || "-"}</div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Vent. Forzada</div>
                                            <div className="font-black text-slate-800">{sector.resistenciaFuego?.forzada || "-"}</div>
                                        </div>
                                    </div>
                                </section>
                                
                                <section>
                                    <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                        <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">6</span>
                                        Potencial Extintor Mínimo
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Fuegos Clase A</div>
                                            <div className="font-black text-slate-800">{sector.potencialExtintor?.claseA || "-"}</div>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center">
                                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Fuegos Clase B</div>
                                            <div className="font-black text-slate-800">{sector.potencialExtintor?.claseB || "-"}</div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <section>
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                    <span className="bg-teal-100 text-teal-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">7</span>
                                    Verificación Cantidad de Extintores
                                </h4>
                                <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                    <div className="text-center">
                                        <div className="text-sm font-bold text-slate-500 uppercase mb-2">Calculados Mínimo</div>
                                        <div className="text-5xl font-black text-teal-600">{extintoresCalculados}</div>
                                        <div className="text-sm text-slate-500 mt-1">1 cada 200m²</div>
                                    </div>
                                    <div className="h-24 w-px bg-slate-200 hidden md:block"></div>
                                    <div className="flex-1 w-full">
                                        <div className="text-sm font-bold text-slate-500 uppercase mb-4 text-center md:text-left">Proyectados / Distribuidos</div>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                                <div className="text-2xl font-black text-slate-800">{sector.extintoresProyectados?.pqs10 || "0"}</div>
                                                <div className="text-xs text-slate-500 font-bold mt-1">PQS 10kg</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                                <div className="text-2xl font-black text-slate-800">{sector.extintoresProyectados?.pqs5 || "0"}</div>
                                                <div className="text-xs text-slate-500 font-bold mt-1">PQS 5kg</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                                <div className="text-2xl font-black text-slate-800">{sector.extintoresProyectados?.co2 || "0"}</div>
                                                <div className="text-xs text-slate-500 font-bold mt-1">CO₂ 5kg</div>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-slate-200 text-center shadow-sm">
                                                <div className="text-2xl font-black text-slate-800">{sector.extintoresProyectados?.k || "0"}</div>
                                                <div className="text-xs text-slate-500 font-bold mt-1">Clase K</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                    <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">8</span>
                                    Medios de Escape
                                </h4>
                                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center mb-6 text-center md:text-left">
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">U.A.S. Calc.</div>
                                            <div className="text-3xl font-black text-slate-800">{nUasTotal.toLocaleString('es-AR', {minimumFractionDigits:1, maximumFractionDigits:1})}</div>
                                        </div>
                                        
                                        <div>
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm w-max mx-auto md:mx-0">
                                                <input 
                                                    type="checkbox" 
                                                    checked={sector.edificioExistente || false}
                                                    onChange={(e) => updateSectorField(sector.id, 'edificioExistente', e.target.checked)}
                                                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                Edificio Existente
                                            </label>
                                        </div>

                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Requerido (m)</div>
                                            <div className="text-3xl font-black text-indigo-600">{metrosRequeridos.toFixed(2)}</div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-1">Ancho Real (m)</div>
                                            <input 
                                                type="number" 
                                                value={sector.anchoRealEscape || ''}
                                                onChange={(e) => updateSectorField(sector.id, 'anchoRealEscape', e.target.value)}
                                                placeholder="Ej: 7.50"
                                                className="w-full max-w-[120px] text-xl font-black text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white p-5 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-200 shadow-sm">
                                        <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-100">
                                            <span className="font-bold text-slate-500">Estado de Evaluación:</span>
                                            <span className={`px-4 py-1 rounded-full font-black text-sm border-2 ${anchoReal > 0 ? (cumpleEscape ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700') : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                                                {anchoReal > 0 ? (cumpleEscape ? 'CUMPLE' : 'NO CUMPLE') : 'INGRESAR ANCHO REAL'}
                                            </span>
                                        </div>
                                        <p>
                                            "Para el Sector de Incendio {sIdx + 1}, necesitaremos medios de escape que, en total, sea de {metrosRequeridos.toFixed(2)} m, medios de escape de {Math.ceil(nUasTotal)} u.a.s. <strong className={cumpleEscape ? 'text-emerald-600' : 'text-red-600'}>{anchoReal > 0 ? (cumpleEscape ? 'CUMPLE' : 'NO CUMPLE') : '---'}</strong>."<br/><br/>
                                            "Todas las puertas consideradas como salidas de emergencia (PE o EXIT), deben estar construidas con materiales incombustibles, deben estar dispuestas de forma tal que el sentido de apertura sea hacia el exterior (Dirección de evacuación), y que no interfieran con vías de escape al ser abiertas. Además, las salidas de emergencia deben estar equipadas con un dispositivo de apertura tipo barra antipánico (En caso de contar con cerradura o traba), deben estar visiblemente señalizadas e iluminadas por luces de emergencia (o cartelería de salida con iluminación permanente)."
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                    <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">9</span>
                                    Iluminación de Emergencia y Señalización
                                </h4>
                                <div className="bg-slate-50 text-slate-700 p-5 rounded-xl text-sm leading-relaxed border border-slate-200">
                                    Conforme a lo expuesto en el Art. 76 de la Ley 19587, los sectores analizados poseerán luces de emergencias en lugares estratégicos, que garantizarían en caso de algún siniestro la visualización de los distintos sectores, como así también permitirán la evacuación de las personas. Las mismas son de uso "no permanente", cuyo encendido se producirá automáticamente y en forma instantánea por falta de suministro de energía. En los medios de acceso y de circulación se podrán utilizar luces de emergencias y de señalización en una sola unidad. Las luces deben poseer un sistema de funcionamiento independiente a la red eléctrica natural, ya que funcionan con baterías selladas y de libre mantenimiento que se encuentran en carga permanente, provisto con sistema de carga automática y detector de falta de tensión para encendido instantáneo (no más de cinco segundos), y se accionan ante un eventual desperfecto eléctrico y tienen una autonomía de 4/2 horas. Todas las salidas del establecimiento estarán debidamente señalizadas mediante carteles "señaladores". Además, se colocarán carteles autoadhesivos y de plástico de alto impacto, indicando las salidas; como así también se colocarán las chapas balizas correspondientes para señalizar los extintores.
                                </div>
                            </section>

                            <section>
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
                                    <span className="bg-violet-100 text-violet-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">10</span>
                                    Condiciones Generales y Específicas (Dec. 351/79)
                                </h4>
                                
                                <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                                    <div className="font-bold text-slate-700 whitespace-nowrap">Uso (Cuadro PCI):</div>
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
                                        Selecciona el Uso arriba para desplegar el cuestionario de Condiciones del Decreto 351/79 para este sector.
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
                            </section>

                        </div>
                    </div>
                );
            })}
        </div>
    );
}
