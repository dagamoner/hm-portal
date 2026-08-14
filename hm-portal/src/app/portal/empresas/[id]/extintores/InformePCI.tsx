"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciSectors, updateCompany } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, Building2, FileText, Check, X, Minus } from "lucide-react";
import { TEXTOS_CONDICIONES, MATRIZ_CUADRO_PCI } from "./data/condiciones351";

import { generateWordReport } from "./exportWord";
import { getSectorTotalSuperficie, calcularRiesgo, calcularCargaFuego, getResistenciaRequerida, getPotencialRequeridoA, getPotencialRequeridoB, TIPOS_USO_ESCAPE, calcularMetrosUAS } from "./pciCalculations";

export default function InformePCI({ company }: { company: any }) {
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

    const rawGen = company.pciGeneralities ? (typeof company.pciGeneralities === "string" ? JSON.parse(company.pciGeneralities) : company.pciGeneralities) : null;
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
        ? (typeof company.pciSectors === "string" ? JSON.parse(company.pciSectors) : company.pciSectors) 
        : [];
    
    const [sectors, setSectors] = useState<any[]>(initialSectors);

    const filteredSectors = sectors.filter((s: any) => {
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
                    .shadow-sm, .border, .border-2 { box-shadow: none !important; border-width: 1px !important; border-color: #000 !important; }
                    .print-header { background-color: #f1f5f9 !important; color: #000 !important; font-weight: bold; }
                }
            `}</style>

            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20 print:hidden">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Informe del Sistema de Protección Contra Incendios</h2>
                    <p className="text-sm text-slate-500">Reporte final consolidado para exportar.</p>
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
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
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

            {/* PORTADA */}
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
                        <div className="text-xl font-black text-slate-800">{company?.name || "-"}</div>
                        <div className="text-sm text-slate-500 mt-1">CUIT: {company?.taxId || "-"}</div>
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase text-slate-400 mb-1">Ubicación / Domicilio</div>
                        <div className="text-xl font-black text-slate-800">{establecimiento?.domicilio || "-"}</div>
                        <div className="text-sm text-slate-500 mt-1">{establecimiento?.actividad || "-"}</div>
                    </div>
                </div>
            </div>

            {/* INFORME CONTENT */}
            <div className="bg-white print:border-none border border-slate-200 rounded-3xl p-8 space-y-12">
                
                {/* INDICE */}
                <div className="page-break-after">
                    <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 uppercase">Índice</h2>
                    <ul className="space-y-4 text-lg font-medium text-slate-700">
                        <li>1. Generalidades</li>
                        <li>2. Protección Contra Incendios
                            <ul className="pl-8 mt-2 space-y-2 text-base text-slate-600">
                                <li>2.1. Sectores de Incendio</li>
                                <li>2.2. Tipo de Riesgo</li>
                                <li>2.3. Carga de Fuego</li>
                                <li>2.4. Resistencia al Fuego</li>
                                <li>2.5. Verificación de Cantidad de Extintores</li>
                                <li>2.6. Cálculo de Medios de Escape</li>
                                <li>2.7. Iluminación de Emergencia y Señalización</li>
                                <li>2.8. Condiciones Generales y Específicas</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                {/* 1. GENERALIDADES */}
                <div className="avoid-break">
                    <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 uppercase">1. Generalidades</h2>
                    <table className="w-full table-fixed text-left border-collapse border border-slate-200 mb-8">
                        <tbody>
                            <tr>
                                <th className="p-3 border border-slate-200 bg-slate-50 print-header w-1/3">Nombre del Establecimiento</th>
                                <td className="p-3 border border-slate-200">{establecimiento?.nombre || "-"}</td>
                            </tr>
                            <tr>
                                <th className="p-3 border border-slate-200 bg-slate-50 print-header">Domicilio</th>
                                <td className="p-3 border border-slate-200">{establecimiento?.ubicacionTerreno || "-"}</td>
                            </tr>
                            <tr>
                                <th className="p-3 border border-slate-200 bg-slate-50 print-header">Actividad</th>
                                <td className="p-3 border border-slate-200">{establecimiento?.tipoActividad || "-"}</td>
                            </tr>
                            <tr>
                                <th className="p-3 border border-slate-200 bg-slate-50 print-header">Superficie Total</th>
                                <td className="p-3 border border-slate-200">{filteredSectors.reduce((acc: number, s: any) => acc + getSectorTotalSuperficie(s), 0).toLocaleString('es-AR')} m²</td>
                            </tr>
                            <tr>
                                <th className="p-3 border border-slate-200 bg-slate-50 print-header">Cantidad de Pisos</th>
                                <td className="p-3 border border-slate-200">{establecimiento?.nivelesTotales || 0}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="text-2xl font-black text-slate-800 border-b-2 border-slate-200 pb-2 mb-6 uppercase">2. Protección Contra Incendios</h2>

                {/* 2.1 SECTORES DE INCENDIO */}
                <div className="avoid-break mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.1. Sectores de Incendio</h3>
                    <table className="w-full table-fixed text-left border-collapse border border-slate-200 mb-8 break-inside-auto">
                        <thead>
                            <tr className="bg-slate-100 print-header">
                                <th className="p-3 border border-slate-200 w-1/3">Sector</th>
                                <th className="p-3 border border-slate-200">Subsectores</th>
                                <th className="p-3 border border-slate-200 w-1/4 text-right">Superficie (m²)</th>
                            </tr>
                        </thead>
                        <tbody className="break-inside-auto">
                            {filteredSectors.map((s: any, i: number) => (
                                <tr key={s.id} className="break-inside-avoid">
                                    <td className="p-3 border border-slate-200 font-bold">Sector {i+1}: {s.name}</td>
                                    <td className="p-3 border border-slate-200">{s.subsectors?.map((sub: any) => sub.nombre).join(", ") || "-"}</td>
                                    <td className="p-3 border border-slate-200 text-right">{getSectorTotalSuperficie(s).toLocaleString('es-AR')} m²</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 2.2 TIPO DE RIESGO */}
                <div className="avoid-break mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.2. Tipo de Riesgo</h3>
                    <table className="w-full text-left border-collapse border border-slate-200 mb-8">
                        <thead>
                            <tr className="bg-slate-100 print-header">
                                <th className="p-3 border border-slate-200">Sector</th>
                                <th className="p-3 border border-slate-200">Actividad Predominante</th>
                                <th className="p-3 border border-slate-200">Material Predominante</th>
                                <th className="p-3 border border-slate-200 text-center">Riesgo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSectors.map((s: any, i: number) => {
                                const riesgo = calcularRiesgo(s.tipoActividad || "", s.tipoMateriales || "");
                                return (
                                    <tr key={s.id} className="break-inside-avoid">
                                        <td className="p-3 border border-slate-200 font-bold">Sector {i+1}: {s.name}</td>
                                        <td className="p-3 border border-slate-200">{s.tipoActividad || "-"}</td>
                                        <td className="p-3 border border-slate-200">{s.tipoMateriales || "-"}</td>
                                        <td className="p-3 border border-slate-200 text-center font-bold">{riesgo || "-"}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 2.3 CARGA DE FUEGO */}
                <div className="avoid-break mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.3. Carga de Fuego</h3>
                    {filteredSectors.map((sector: any, i: number) => {
                        const sup = getSectorTotalSuperficie(sector);
                        const { totalAcumuladoKcal, qf, pm } = calcularCargaFuego(sector);
                        return (
                            <div key={sector.id} className="mb-8">
                                <h4 className="font-bold text-lg mb-2">Sector {i+1}: {sector.name}</h4>
                                <table className="w-full text-left border-collapse border border-slate-200 mb-2">
                                    <thead>
                                        <tr className="bg-[#4caf50] text-white print:bg-slate-100 print:text-black print:font-bold">
                                            <th className="p-3 border border-slate-200">MATERIALES</th>
                                            <th className="p-3 border border-slate-200 text-right">PQ UNITARIO (Kcal/Kg)</th>
                                            <th className="p-3 border border-slate-200 text-right">Material Existente (Kg)</th>
                                            <th className="p-3 border border-slate-200 text-right">PQ Acumulado (Kcal)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(!sector.materialesCargaFuego || sector.materialesCargaFuego.length === 0) && (
                                            <tr><td colSpan={4} className="p-3 border border-slate-200 text-center">Sin materiales</td></tr>
                                        )}
                                        {sector.materialesCargaFuego?.map((mat: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="p-3 border border-slate-200">{mat.nombre}</td>
                                                <td className="p-3 border border-slate-200 text-right">{mat.pqUnitario}</td>
                                                <td className="p-3 border border-slate-200 text-right">{mat.cantidadKg}</td>
                                                <td className="p-3 border border-slate-200 text-right">{(Number(mat.pqUnitario) * Number(mat.cantidadKg)).toLocaleString('es-AR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 print-header">
                                            <td colSpan={3} className="p-3 border border-slate-200 text-right font-bold">Total Acumulado =</td>
                                            <td className="p-3 border border-slate-200 text-right font-bold">{totalAcumuladoKcal.toLocaleString('es-AR')}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                                <div className="flex justify-end gap-8 text-sm font-bold bg-slate-50 p-3 border border-slate-200 border-t-0 mb-4">
                                    <div>Pm = {pm.toFixed(2)} kg madera</div>
                                    <div>Sup. = {sup.toLocaleString('es-AR')} m²</div>
                                    <div className="text-emerald-700">QF = {qf.toFixed(2)} kg madera / m²</div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 2.4 RESISTENCIA AL FUEGO */}
                <div className="avoid-break mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.4. Resistencia al Fuego</h3>
                    <table className="w-full text-left border-collapse border border-slate-200 mb-8">
                        <thead>
                            <tr className="bg-slate-100 print-header">
                                <th className="p-3 border border-slate-200">Sector</th>
                                <th className="p-3 border border-slate-200">Uso</th>
                                <th className="p-3 border border-slate-200 text-center">Riesgo</th>
                                <th className="p-3 border border-slate-200 text-center">Carga de Fuego (Kg/m²)</th>
                                <th className="p-3 border border-slate-200 text-center">Vent. Natural</th>
                                <th className="p-3 border border-slate-200 text-center">Vent. Forzada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSectors.map((s: any, i: number) => {
                                const riesgo = calcularRiesgo(s.tipoActividad || "", s.tipoMateriales || "");
                                const { qf } = calcularCargaFuego(s);
                                const resNat = getResistenciaRequerida(qf, riesgo, false);
                                const resForz = getResistenciaRequerida(qf, riesgo, true);
                                return (
                                    <tr key={s.id} className="break-inside-avoid">
                                        <td className="p-3 border border-slate-200 font-bold">Sector {i+1}: {s.name}</td>
                                        <td className="p-3 border border-slate-200">{s.tipoActividad || "-"}</td>
                                        <td className="p-3 border border-slate-200 text-center font-bold">{riesgo || "-"}</td>
                                        <td className="p-3 border border-slate-200 text-center">{qf.toFixed(2)}</td>
                                        <td className="p-3 border border-slate-200 text-center font-bold">{resNat}</td>
                                        <td className="p-3 border border-slate-200 text-center font-bold">{resForz}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 2.5 POTENCIAL EXTINTOR */}
                <div className="avoid-break mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.5. Potencial Extintor Mínimo y Verificación</h3>
                    {filteredSectors.map((s: any, i: number) => {
                        const riesgo = calcularRiesgo(s.tipoActividad || "", s.tipoMateriales || "");
                        const { qf } = calcularCargaFuego(s);
                        const sup = getSectorTotalSuperficie(s);
                        const potA = getPotencialRequeridoA(qf, riesgo);
                        const potB = getPotencialRequeridoB(qf, riesgo);
                        const extintoresCalc = Math.round(sup / 200) || 1;
                        
                        const proj = s.extintoresProyectados || {};
                        const pqs10 = Number(proj.pqs10) || 0;
                        const pqs5 = Number(proj.pqs5) || 0;
                        const co2 = Number(proj.co2) || 0;
                        const k = Number(proj.k) || 0;
                        const totalProj = pqs10 + pqs5 + co2 + k;
                        
                        return (
                            <div key={s.id} className="mb-8 avoid-break">
                                <h4 className="font-bold text-lg mb-2">Sector {i+1}: {s.name}</h4>
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase">Superficie</div>
                                        <div className="text-lg font-black text-slate-800">{sup.toLocaleString('es-AR')} m²</div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase">Potencial A Requerido</div>
                                        <div className="text-lg font-black text-slate-800">{potA}</div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase">Potencial B Requerido</div>
                                        <div className="text-lg font-black text-slate-800">{potB}</div>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-center">
                                        <div className="text-xs font-bold text-slate-400 uppercase">Extintores Estimados</div>
                                        <div className="text-lg font-black text-slate-800">{extintoresCalc}</div>
                                    </div>
                                </div>
                                <table className="w-full text-left border-collapse border border-slate-200 mb-2">
                                    <thead>
                                        <tr className="bg-slate-100 print-header">
                                            <th className="p-3 border border-slate-200 w-1/3">Tipo de Extintor Proyectado</th>
                                            <th className="p-3 border border-slate-200 text-center">Cantidad</th>
                                            <th className="p-3 border border-slate-200 text-center">Aporta Potencial A</th>
                                            <th className="p-3 border border-slate-200 text-center">Aporta Potencial B</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="p-3 border border-slate-200 font-bold">PQS (10 kg)</td>
                                            <td className="p-3 border border-slate-200 text-center">{pqs10 > 0 ? pqs10 : "-"}</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-emerald-600">6A</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-emerald-600">40B</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-slate-200 font-bold">PQS (5 kg)</td>
                                            <td className="p-3 border border-slate-200 text-center">{pqs5 > 0 ? pqs5 : "-"}</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-emerald-600">4A</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-emerald-600">20B</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-slate-200 font-bold">CO2 (5 kg)</td>
                                            <td className="p-3 border border-slate-200 text-center">{co2 > 0 ? co2 : "-"}</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-slate-400">-</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-emerald-600">5B</td>
                                        </tr>
                                        <tr>
                                            <td className="p-3 border border-slate-200 font-bold">Clase K</td>
                                            <td className="p-3 border border-slate-200 text-center">{k > 0 ? k : "-"}</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-slate-400">-</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold text-slate-400">-</td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 print-header">
                                            <td colSpan={1} className="p-3 border border-slate-200 text-right font-bold">Total Extintores =</td>
                                            <td className="p-3 border border-slate-200 text-center font-bold">{totalProj}</td>
                                            <td colSpan={2} className="p-3 border border-slate-200 text-center">
                                                {totalProj >= extintoresCalc ? <span className="text-emerald-600 font-bold">CUMPLE</span> : <span className="text-red-600 font-bold">NO CUMPLE</span>}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        );
                    })}
                </div>

                {/* 2.6 MEDIOS DE ESCAPE */}
                <div className="avoid-break mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.6. Cálculo de Medios de Escape</h3>
                    <table className="w-full text-left border-collapse border border-slate-200 mb-8">
                        <thead>
                            <tr className="bg-slate-100 print-header">
                                <th className="p-3 border border-slate-200">Sector</th>
                                <th className="p-3 border border-slate-200">Uso Escape</th>
                                <th className="p-3 border border-slate-200 text-right">Factor (x)</th>
                                <th className="p-3 border border-slate-200 text-right">Personas (N)</th>
                                <th className="p-3 border border-slate-200 text-right">U.A.S. Calc</th>
                                <th className="p-3 border border-slate-200 text-right">Requerido (m)</th>
                                <th className="p-3 border border-slate-200 text-right">Ancho Real (m)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSectors.map((s: any, i: number) => {
                                let nPersonas = 0;
                                let usoLabel = "-";
                                let factor = "-";
                                
                                s.subsectors?.forEach((sub: any) => {
                                    const tipoObj = TIPOS_USO_ESCAPE.find(t => t.id === sub.tipoUsoEscape);
                                    if (tipoObj && tipoObj.x > 0) {
                                        nPersonas += Math.round((Number(sub.areaBruta) || 0) / tipoObj.x);
                                        usoLabel = tipoObj.label;
                                        factor = String(tipoObj.x);
                                    }
                                });
                                
                                const uas = nPersonas / 100;
                                const reqM = calcularMetrosUAS(Math.ceil(uas), s.edificioExistente);
                                const anchoReal = Number(s.anchoRealEscape) || 0;
                                const cumple = anchoReal >= reqM && anchoReal > 0;
                                
                                return (
                                    <tr key={s.id} className="break-inside-avoid">
                                        <td className="p-3 border border-slate-200 font-bold">Sector {i+1}: {s.name}</td>
                                        <td className="p-3 border border-slate-200 text-xs">{usoLabel}</td>
                                        <td className="p-3 border border-slate-200 text-right">{factor}</td>
                                        <td className="p-3 border border-slate-200 text-right font-bold">{nPersonas}</td>
                                        <td className="p-3 border border-slate-200 text-right">{uas.toFixed(2)}</td>
                                        <td className="p-3 border border-slate-200 text-right font-bold">{reqM.toFixed(2)}</td>
                                        <td className={`p-3 border border-slate-200 text-right font-bold ${cumple ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {anchoReal.toFixed(2)} {cumple ? "(CUMPLE)" : "(NO CUMPLE)"}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* 2.7 ILUMINACION */}
                <div className="avoid-break mb-8">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.7. Iluminación de Emergencia y Señalización</h3>
                    <p className="text-slate-700 leading-relaxed text-justify mb-4">
                        Conforme a lo expuesto en el Art. 76 de la Ley 19587, los sectores analizados poseerán luces de emergencias en lugares estratégicos, que garantizarían en caso de algún siniestro la visualización de los distintos sectores, como así también permitirán la evacuación de las personas. Las mismas son de uso "no permanente", cuyo encendido se producirá automáticamente y en forma instantánea por falta de suministro de energía. 
                    </p>
                    <p className="text-slate-700 leading-relaxed text-justify">
                        En los medios de acceso y de circulación se podrán utilizar luces de emergencias y de señalización en una sola unidad. Las luces deben poseer un sistema de funcionamiento independiente a la red eléctrica natural, provisto con sistema de carga automática y detector de falta de tensión para encendido instantáneo. Todas las salidas del establecimiento estarán debidamente señalizadas mediante carteles "señaladores".
                    </p>
                </div>

                {/* 2.8 CONDICIONES */}
                <div className="avoid-break">
                    <h3 className="text-xl font-bold text-slate-700 mb-4">2.8. Condiciones Generales y Específicas (Dec. 351/79)</h3>
                    {filteredSectors.map((s: any, i: number) => {
                        const riesgoRaw = calcularRiesgo(s.tipoActividad || "", s.tipoMateriales || "");
                        const riesgoNum = parseInt((riesgoRaw || "").replace('R', '')) || 0;
                        const matrizItem = MATRIZ_CUADRO_PCI.find((m:any) => m.uso === s.usoCuadroPCI && m.riesgo === riesgoNum);
                        
                        let condReq: any[] = [];
                        if (matrizItem) {
                            const reqS = matrizItem.s.map((id:any) => ({ id, tipo: 'Situación', desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] }));
                            const reqC = matrizItem.c.map((id:any) => ({ id, tipo: 'Construcción', desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] }));
                            const reqE = matrizItem.e.map((id:any) => ({ id, tipo: 'Extinción', desc: TEXTOS_CONDICIONES.especificas[id as keyof typeof TEXTOS_CONDICIONES.especificas] || id }));
                            condReq = [...reqS, ...reqC, ...reqE];
                        }
                        
                        return (
                            <div key={s.id} className="mb-8 page-break-after">
                                <h4 className="font-bold text-lg mb-2">Sector {i+1}: {s.name}</h4>
                                <div className="text-sm text-slate-600 mb-4">
                                    <strong>Uso Cuadro PCI:</strong> {s.usoCuadroPCI || "-"} | <strong>Riesgo:</strong> R{riesgoNum}
                                </div>
                                
                                {condReq.length > 0 ? (
                                    <table className="w-full text-left border-collapse border border-slate-200 text-sm">
                                        <thead>
                                            <tr className="bg-slate-100 print-header">
                                                <th className="p-3 border border-slate-200 w-24">Tipo</th>
                                                <th className="p-3 border border-slate-200">Descripción (Condición)</th>
                                                <th className="p-3 border border-slate-200 w-32 text-center">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {condReq.map((c, idx) => {
                                                const estadoObj = (s.condicionesEstado || {})[c.id] || {};
                                                return (
                                                    <tr key={idx}>
                                                        <td className="p-3 border border-slate-200 font-bold">{c.tipo} {c.id}</td>
                                                        <td className="p-3 border border-slate-200">{c.desc}</td>
                                                        <td className="p-3 border border-slate-200 text-center font-bold">
                                                            {estadoObj.estado || "NO APLICA"}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="p-4 bg-slate-50 border border-slate-200 text-center text-slate-500 italic">
                                        El Riesgo actual ({riesgoNum}) no está contemplado en el Cuadro PCI para el uso seleccionado.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
