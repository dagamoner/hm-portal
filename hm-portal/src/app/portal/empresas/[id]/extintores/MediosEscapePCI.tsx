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

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-[95vw] lg:max-w-[85vw] mx-auto overflow-x-hidden">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Cálculo de Medios de Escape</h2>
                    <p className="text-sm text-slate-500">Determinación de u.a.s. y medios de escape según Dec. 351/79.</p>
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
                <div className="bg-white rounded-xl border border-green-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-center border-collapse text-sm">
                            <thead>
                                <tr className="bg-[#43a047] text-white">
                                    <th className="p-3 border border-[#2e7d32] font-semibold w-24">Sector de<br/>Incendio</th>
                                    <th className="p-3 border border-[#2e7d32] font-semibold text-left">Uso</th>
                                    <th className="p-3 border border-[#2e7d32] font-semibold w-20">Tipo<br/>de Uso</th>
                                    <th className="p-3 border border-[#2e7d32] font-semibold w-24">X<br/>[m²/pers]</th>
                                    <th className="p-3 border border-[#2e7d32] font-semibold w-28">Sup. De<br/>piso del<br/>sector (m²)</th>
                                    <th className="p-3 border border-[#2e7d32] font-semibold w-24">Nº de<br/>personas a<br/>evacuar</th>
                                    <th className="p-3 border border-[#2e7d32] font-semibold w-20">"n"<br/>u.a.s.</th>
                                    <th className="p-3 border border-[#2e7d32] font-semibold w-28">Nº medios<br/>de escape<br/>y/o escalera<br/>mínimo</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {filteredSectors.map((sector, index) => {
                                    // Total for Sector
                                    let sTotal = 0;
                                    let nTotalPersonas = 0;
                                    
                                    // Pre-calculate subsectors to get sector totals
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
                                    const mediosTotal = calcularMediosDeEscape(nUasTotal);

                                    return (
                                        <React.Fragment key={sector.id}>
                                            {/* Sector Total Row */}
                                            <tr className="bg-[#81c784] font-bold text-slate-900 border-b-2 border-[#43a047]">
                                                <td className="p-2 border border-[#43a047] text-white bg-[#4caf50]">
                                                    {sector.name || index + 1}
                                                </td>
                                                <td className="p-2 border border-[#43a047] text-left text-white bg-[#4caf50]">
                                                    {sector.uso || "Edificio"}
                                                </td>
                                                <td className="p-2 border border-[#43a047] bg-[#4caf50]"></td>
                                                <td className="p-2 border border-[#43a047] bg-[#4caf50]"></td>
                                                <td className="p-2 border border-[#43a047] bg-white">
                                                    {sTotal.toLocaleString('es-AR', {maximumFractionDigits: 2})}
                                                </td>
                                                <td className="p-2 border border-[#43a047] bg-white">
                                                    {nTotalPersonas}
                                                </td>
                                                <td className="p-2 border border-[#43a047] bg-white">
                                                    {nUasTotal.toLocaleString('es-AR', {minimumFractionDigits: 1, maximumFractionDigits: 1})}
                                                </td>
                                                <td className="p-2 border border-[#43a047] bg-white">
                                                    {mediosTotal}
                                                </td>
                                            </tr>
                                            
                                            {/* Subsectors Rows */}
                                            {subsectorsData.map((sub, sIndex) => (
                                                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="p-2 border border-slate-300 font-medium text-slate-500">
                                                        {sector.name || index + 1}.{String(sIndex + 1).padStart(2, '0')}
                                                    </td>
                                                    <td className="p-2 border border-slate-300 text-left text-slate-700">
                                                        {sub.nombre || "Subsector"}
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
                                                    <td className="p-2 border border-slate-300">
                                                        {sub.xVal > 0 ? sub.medios : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-200">
                        <h4 className="font-bold text-slate-700 text-sm mb-2">Ancho Mínimo Permitido de U.A.S. (Dec. 351/79)</h4>
                        <div className="grid grid-cols-3 gap-4 max-w-lg text-xs">
                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center">
                                <div className="font-bold text-slate-500 mb-1">2 unidades</div>
                                <div className="font-mono">1,10m (Nuevos)</div>
                                <div className="font-mono text-slate-400">0,96m (Exist.)</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center">
                                <div className="font-bold text-slate-500 mb-1">3 unidades</div>
                                <div className="font-mono">1,55m (Nuevos)</div>
                                <div className="font-mono text-slate-400">1,45m (Exist.)</div>
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-center">
                                <div className="font-bold text-slate-500 mb-1">4 unidades</div>
                                <div className="font-mono">2,00m (Nuevos)</div>
                                <div className="font-mono text-slate-400">1,85m (Exist.)</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
