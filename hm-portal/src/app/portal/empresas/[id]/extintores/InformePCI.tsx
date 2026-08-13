"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors, updateCompany } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, Building2, FileText, Check, X, Minus } from "lucide-react";
import { TEXTOS_CONDICIONES, MATRIZ_CUADRO_PCI } from "./data/condiciones351";

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
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Informe Sistema de Protección Contra Incendios</h2>
                    <p className="text-sm text-slate-500">Reporte final consolidado y evaluación de condiciones (Dec. 351/79).</p>
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

            {filteredSectors.map((sector, sIdx) => {
                // Cálculos consolidados para el reporte del sector
                const superficieTotal = sector.subsectors.reduce((acc: number, sub: any) => acc + (Number(sub.areaBruta) || 0), 0);
                const cargaFuegoStr = sector.cargaFuego || "-";
                const riesgoLvl = sector.riesgoLvl || "-";
                
                // Cálculo u.a.s.
                let nTotalPersonas = 0;
                const TIPOS_USO_ESCAPE = [
                    { id: 'a', x: 1 }, { id: 'b', x: 2 }, { id: 'c', x: 3 }, { id: 'd', x: 5 },
                    { id: 'e', x: 8 }, { id: 'f', x: 12 }, { id: 'g', x: 16 }, { id: 'h', x: 2 },
                    { id: 'i', x: 3 }, { id: 'j', x: 8 }, { id: 'k', x: 3 }, { id: 'l', x: 20 }, { id: 'm', x: 30 }
                ];
                sector.subsectors.forEach((sub: any) => {
                    const tipoObj = TIPOS_USO_ESCAPE.find(t => t.id === sub.tipoUsoEscape);
                    const xVal = tipoObj ? tipoObj.x : 0;
                    if (xVal > 0) {
                        nTotalPersonas += Math.round((Number(sub.areaBruta) || 0) / xVal);
                    }
                });
                const nUasTotal = nTotalPersonas / 100;
                
                // Medios de escape verificación
                const esExistente = sector.edificioExistente || false;
                const metrosRequeridos = calcularMetrosUAS(Math.ceil(nUasTotal), esExistente);
                const anchoReal = Number(sector.anchoRealEscape) || 0;
                const cumpleEscape = anchoReal >= metrosRequeridos && anchoReal > 0;

                // Matriz de Condiciones
                const riesgoNum = parseInt(riesgoLvl.replace('R', '')) || 0;
                const matrizItem = MATRIZ_CUADRO_PCI.find(m => m.uso === sector.usoCuadroPCI && m.riesgo === riesgoNum);
                
                let condicionesEspecificasRequeridas: any[] = [];
                if (matrizItem) {
                    const reqS = matrizItem.s.map(id => ({ id, tipo: 'Situación', desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] }));
                    const reqC = matrizItem.c.map(id => ({ id, tipo: 'Construcción', desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] }));
                    const reqE = matrizItem.e.map(id => ({ 
                        id, 
                        tipo: 'Extinción', 
                        desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] || id // Fallback for special texts like "Cumplirá lo indicado..."
                    }));
                    condicionesEspecificasRequeridas = [...reqS, ...reqC, ...reqE];
                }

                return (
                    <div key={sector.id} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                        <div className="bg-slate-800 p-6 text-white">
                            <div className="flex items-center gap-3 mb-2">
                                <FileText className="w-6 h-6 text-blue-400" />
                                <h3 className="text-xl font-bold">Informe Sector de Incendio {sIdx + 1}: {sector.name}</h3>
                            </div>
                            <p className="text-slate-300">Uso: {sector.uso || "No definido"} | Superficie Total: {superficieTotal.toLocaleString('es-AR')} m²</p>
                        </div>
                        
                        <div className="p-6 space-y-8">
                            
                            {/* Resumen Puntos 1 a 7 */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="text-xs font-bold text-slate-500 uppercase">3. Riesgo</div>
                                    <div className="text-lg font-black text-slate-800">{riesgoLvl}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="text-xs font-bold text-slate-500 uppercase">4. Carga de Fuego</div>
                                    <div className="text-lg font-black text-slate-800">{cargaFuegoStr} kg/m²</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="text-xs font-bold text-slate-500 uppercase">5. Resist. al Fuego</div>
                                    <div className="text-sm font-bold text-slate-800 mt-1">N: {sector.resistenciaFuego?.natural || "-"} / F: {sector.resistenciaFuego?.forzada || "-"}</div>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="text-xs font-bold text-slate-500 uppercase">7. Extintores (Calc)</div>
                                    <div className="text-lg font-black text-slate-800">{Math.round(superficieTotal / 200)} ext.</div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Punto 8: Medios de Escape */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">8</span>
                                    Medios de Escape
                                </h4>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-4">
                                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
                                        <div>
                                            <div className="text-sm text-slate-500 font-medium">U.A.S. Calculadas</div>
                                            <div className="text-2xl font-black text-slate-800">{nUasTotal.toLocaleString('es-AR', {minimumFractionDigits:1, maximumFractionDigits:1})}</div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
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
                                            <div className="text-sm text-slate-500 font-medium">Metros Requeridos</div>
                                            <div className="text-2xl font-black text-indigo-600">{metrosRequeridos.toFixed(2)} m</div>
                                        </div>
                                        
                                        <div>
                                            <div className="text-sm text-slate-500 font-medium">Ancho Real (m)</div>
                                            <input 
                                                type="number" 
                                                value={sector.anchoRealEscape || ''}
                                                onChange={(e) => updateSectorField(sector.id, 'anchoRealEscape', e.target.value)}
                                                placeholder="Ej: 7.50"
                                                className="w-32 text-xl font-black text-slate-800 bg-white border border-slate-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                                            />
                                        </div>

                                        <div className={`px-6 py-3 rounded-xl border-2 font-black text-lg ${anchoReal > 0 ? (cumpleEscape ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-red-50 border-red-500 text-red-700') : 'bg-slate-100 border-slate-300 text-slate-400'}`}>
                                            {anchoReal > 0 ? (cumpleEscape ? 'CUMPLE' : 'NO CUMPLE') : 'INGRESAR ANCHO'}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-indigo-50 text-indigo-900 p-4 rounded-xl text-sm leading-relaxed border border-indigo-100">
                                        <p className="font-bold mb-2">Conclusión:</p>
                                        "Para el Sector de Incendio {sIdx + 1}, necesitaremos medios de escape que, en total, sea de {metrosRequeridos.toFixed(2)} m, medios de escape de {Math.ceil(nUasTotal)} u.a.s. {anchoReal > 0 ? (cumpleEscape ? 'CUMPLE' : 'NO CUMPLE') : '---'}."<br/><br/>
                                        "Todas las puertas consideradas como salidas de emergencia (PE o EXIT), deben estar construidas con materiales incombustibles, deben estar dispuestas de forma tal que el sentido de apertura sea hacia el exterior (Dirección de evacuación), y que no interfieran con vías de escape al ser abiertas. Además, las salidas de emergencia deben estar equipadas con un dispositivo de apertura tipo barra antipánico (En caso de contar con cerradura o traba), deben estar visiblemente señalizadas e iluminadas por luces de emergencia (o cartelería de salida con iluminación permanente)."
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Punto 9: Iluminación y Señalización */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="bg-amber-100 text-amber-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">9</span>
                                    Iluminación de Emergencia y Señalización
                                </h4>
                                <div className="bg-amber-50 text-amber-900 p-5 rounded-2xl text-sm leading-relaxed border border-amber-200/60 shadow-sm">
                                    Conforme a lo expuesto en el Art. 76 de la Ley 19587, los sectores analizados poseerán luces de emergencias en lugares estratégicos, que garantizarían en caso de algún siniestro la visualización de los distintos sectores, como así también permitirán la evacuación de las personas. Las mismas son de uso "no permanente", cuyo encendido se producirá automáticamente y en forma instantánea por falta de suministro de energía. En los medios de acceso y de circulación se podrán utilizar luces de emergencias y de señalización en una sola unidad. Las luces deben poseer un sistema de funcionamiento independiente a la red eléctrica natural, ya que funcionan con baterías selladas y de libre mantenimiento que se encuentran en carga permanente, provisto con sistema de carga automática y detector de falta de tensión para encendido instantáneo (no más de cinco segundos), y se accionan ante un eventual desperfecto eléctrico y tienen una autonomía de 4/2 horas. Todas las salidas del establecimiento estarán debidamente señalizadas mediante carteles "señaladores". Además, se colocarán carteles autoadhesivos y de plástico de alto impacto, indicando las salidas; como así también se colocarán las chapas balizas correspondientes para señalizar los extintores.
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            {/* Punto 10: Condiciones Generales y Específicas */}
                            <div>
                                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="bg-rose-100 text-rose-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">10</span>
                                    Condiciones Generales y Específicas (Dec. 351/79)
                                </h4>
                                
                                <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                                    <div className="font-bold text-slate-700 whitespace-nowrap">Uso según Cuadro PCI:</div>
                                    <select
                                        value={sector.usoCuadroPCI || ""}
                                        onChange={(e) => updateSectorField(sector.id, 'usoCuadroPCI', e.target.value)}
                                        className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="" disabled>Seleccione el uso en la matriz...</option>
                                        {Array.from(new Set(MATRIZ_CUADRO_PCI.map(m => m.uso))).map(u => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                    <div className="font-bold text-slate-700 whitespace-nowrap px-4 py-2 bg-slate-200 rounded-lg">
                                        Riesgo Detectado: {riesgoNum || "-"}
                                    </div>
                                </div>

                                {!sector.usoCuadroPCI ? (
                                    <div className="text-center p-8 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
                                        Selecciona el Uso en el cuadro de arriba para generar la matriz de condiciones a evaluar para este sector.
                                    </div>
                                ) : !matrizItem ? (
                                    <div className="text-center p-8 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold">
                                        El Riesgo actual ({riesgoNum}) no está contemplado en el Cuadro PCI para el uso seleccionado ({sector.usoCuadroPCI}). Revise la Carga de Fuego y Resistencia.
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Condiciones Generales */}
                                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="bg-slate-100 px-4 py-3 font-bold text-slate-700 border-b border-slate-200">
                                                Condiciones Generales (Situación, Construcción, Extinción)
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

                                        {/* Condiciones Específicas */}
                                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                            <div className="bg-indigo-50 px-4 py-3 font-bold text-indigo-900 border-b border-indigo-100 flex items-center justify-between">
                                                <span>Condiciones Específicas Requeridas para: {sector.usoCuadroPCI} (Riesgo {riesgoNum})</span>
                                                <span className="text-xs bg-indigo-200 text-indigo-800 px-2 py-1 rounded-full">{condicionesEspecificasRequeridas.length} Aplicables</span>
                                            </div>
                                            {condicionesEspecificasRequeridas.length === 0 ? (
                                                <div className="p-6 text-center text-slate-500 text-sm">No se requieren condiciones específicas extra para este uso y riesgo.</div>
                                            ) : (
                                                <div className="divide-y divide-slate-100">
                                                    {condicionesEspecificasRequeridas.map(cond => {
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
                    </div>
                );
            })}
        </div>
    );
}
