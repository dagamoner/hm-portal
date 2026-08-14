"use client";

import React, { useState, useTransition, useEffect } from "react";
import { updateCompanyPciGeneralities } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle, Plus, Trash2, Building2 } from "lucide-react";

const getEmptyEstablecimiento = () => ({
    id: crypto.randomUUID(),
    nombre: "Nuevo Establecimiento",
    comentarioGeneral: "",
    ubicacionTerreno: "",
    tipoZonificacion: "",
    urbanizacionCircundante: "NO",
    accesibleBomberos: "NO",
    tipoConstruccion: "",
    cantidadEdificios: "",
    sismorresistente: "NO",
    materialEstructural: "",
    pisosSuperiores: "",
    entrepisos: "N/A",
    subsuelos: "",
    nivelesTotales: "",
    instalacionElectrica: "No Aplica",
    instalacionSanitaria: "No Aplica",
    gasNatural: "No Aplica",
    gasNaturalReglamentaria: "No Aplica",
    incendioPreexistente: "No Aplica",
    incendioPreexistenteReglamentaria: "No Aplica",
    actividadAireLibre: "No Aplica",
    tipoActividad: "No Aplica",
    almacenamiento: "No Aplica"
});

export default function GeneralidadesPCI({ company }: { company: any }) {
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    
    // Initialize form data with existing data or defaults
    const rawData = company.pciGeneralities ? (typeof company.pciGeneralities === 'string' ? JSON.parse(company.pciGeneralities) : company.pciGeneralities) : null;
    
    let initialEstablecimientos: any[] = [];
    if (rawData) {
        if (Array.isArray(rawData)) {
            initialEstablecimientos = rawData;
        } else {
            // Migration of old single object
            initialEstablecimientos = [{ ...rawData, id: crypto.randomUUID(), nombre: "Establecimiento Principal" }];
        }
    }

    const [establecimientos, setEstablecimientos] = useState<any[]>(initialEstablecimientos);
    const [selectedId, setSelectedId] = useState<string>(initialEstablecimientos[0]?.id || "");

    const formData = establecimientos.find(e => e.id === selectedId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEstablecimientos(prev => prev.map(est => est.id === selectedId ? { ...est, [name]: value } : est));
    };

    const handleAdd = () => {
        const newEst = getEmptyEstablecimiento();
        const nextList = [...establecimientos, newEst];
        setEstablecimientos(nextList);
        setSelectedId(newEst.id);
        // Auto-guardado para que no se pierda al cambiar de pestaña
        startTransition(async () => {
            await updateCompanyPciGeneralities(company.id, nextList);
        });
    };

    const handleDelete = (id: string) => {
        if (confirm("¿Estás seguro de que deseas eliminar este establecimiento y todas sus generalidades? (Los sectores asociados no se eliminarán automáticamente)")) {
            const nextList = establecimientos.filter(e => e.id !== id);
            setEstablecimientos(nextList);
            if (selectedId === id) {
                setSelectedId(nextList[0]?.id || "");
            }
            startTransition(async () => {
                await updateCompanyPciGeneralities(company.id, nextList);
            });
        }
    };

    const handleSave = () => {
        setSaveStatus("idle");
        startTransition(async () => {
            const result = await updateCompanyPciGeneralities(company.id, establecimientos);
            if (result.success) {
                setSaveStatus("success");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        });
    };

    return (
        <div className="space-y-8 max-w-5xl animate-fade-in pb-12">
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-20">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Generalidades del Establecimiento</h2>
                    <p className="text-sm text-slate-500">Administra los diferentes establecimientos o sucursales de la empresa.</p>
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
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                >
                    {establecimientos.length === 0 && <option value="" disabled>No hay establecimientos</option>}
                    {establecimientos.map(est => (
                        <option key={est.id} value={est.id}>{est.nombre}</option>
                    ))}
                </select>
                <button 
                    onClick={handleAdd}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors"
                >
                    <Plus className="w-4 h-4" /> Agregar Establecimiento
                </button>
            </div>

            {formData ? (
                <>
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-lg font-black text-slate-800">1. Generalidades</h3>
                            <button 
                                onClick={() => handleDelete(formData.id)}
                                className="text-red-500 hover:text-red-700 text-sm font-bold flex items-center gap-1 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" /> Eliminar Establecimiento
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre del Establecimiento</label>
                                <input 
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    onBlur={handleSave}
                                    placeholder="Ej: Sede Central"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Comentario / Descripción</label>
                                <textarea 
                                    name="comentarioGeneral"
                                    value={formData.comentarioGeneral}
                                    onChange={handleChange}
                                    placeholder="Ejemplo: El presente documento responde a la implementación de las instalaciones de protección contra incendios de un establecimiento..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                        <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2">2. Descripción del Establecimiento en Estudio</h3>
                        
                        {/* 2.1 Entorno */}
                        <div className="space-y-4">
                            <h4 className="text-md font-bold text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">2.1 Condiciones del Entorno</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Ubicación del Terreno</label>
                                    <input type="text" name="ubicacionTerreno" value={formData.ubicacionTerreno} onChange={handleChange} placeholder="Ej: Ciudad de Mendoza" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de zonificación</label>
                                    <input type="text" name="tipoZonificacion" value={formData.tipoZonificacion} onChange={handleChange} placeholder="Ej: Urbana" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Urbanización circundante</label>
                                    <select name="urbanizacionCircundante" value={formData.urbanizacionCircundante} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="SI">SI</option><option value="NO">NO</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Accesible a Bomberos</label>
                                    <select name="accesibleBomberos" value={formData.accesibleBomberos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="SI">SI</option><option value="NO">NO</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 2.2 Infraestructura */}
                        <div className="space-y-4">
                            <h4 className="text-md font-bold text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg inline-block">2.2 Condiciones de la Infraestructura</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de construcción</label>
                                    <input type="text" name="tipoConstruccion" value={formData.tipoConstruccion} onChange={handleChange} placeholder="Ej: Edificación Nueva" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cantidad de Edificios</label>
                                    <input type="text" name="cantidadEdificios" value={formData.cantidadEdificios} onChange={handleChange} placeholder="Ej: 1" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Sismorresistente</label>
                                    <select name="sismorresistente" value={formData.sismorresistente} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="SI">SI</option><option value="NO">NO</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Mat. estructural predom.</label>
                                    <input type="text" name="materialEstructural" value={formData.materialEstructural} onChange={handleChange} placeholder="Ej: Hormigón Armado" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cant. Pisos Superiores</label>
                                    <input type="text" name="pisosSuperiores" value={formData.pisosSuperiores} onChange={handleChange} placeholder="Ej: 12" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Entrepisos</label>
                                    <select name="entrepisos" value={formData.entrepisos} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="SI">SI</option><option value="NO">NO</option><option value="N/A">N/A</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cant. de subsuelos</label>
                                    <input type="text" name="subsuelos" value={formData.subsuelos} onChange={handleChange} placeholder="Ej: 2" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">N° total niveles (inc. PB)</label>
                                    <input type="text" name="nivelesTotales" value={formData.nivelesTotales} onChange={handleChange} placeholder="Ej: 15" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                            </div>
                        </div>

                        {/* 2.3 Instalaciones */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <h5 className="font-bold text-slate-700 mb-3">Instalaciones:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">Inst. eléctrica reglamentaria:</span>
                                    <select name="instalacionElectrica" value={formData.instalacionElectrica} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm min-w-[120px]">
                                        <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-600">Inst. sanitaria reglamentaria:</span>
                                    <select name="instalacionSanitaria" value={formData.instalacionSanitaria} onChange={handleChange} className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm min-w-[120px]">
                                        <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                    </select>
                                </div>
                                
                                {/* Gas Natural */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-bold text-slate-700">Inst. gas natural (existente/prevista):</span>
                                        <select name="gasNatural" value={formData.gasNatural} onChange={handleChange} className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm min-w-[120px]">
                                            <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between pl-4">
                                        <span className="text-sm text-slate-500 font-medium">↳ Reglamentaria:</span>
                                        <select name="gasNaturalReglamentaria" value={formData.gasNaturalReglamentaria} onChange={handleChange} className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm min-w-[120px]">
                                            <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Incendio */}
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-bold text-slate-700">Inst. de incendio preexistente:</span>
                                        <select name="incendioPreexistente" value={formData.incendioPreexistente} onChange={handleChange} className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm min-w-[120px]">
                                            <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center justify-between pl-4">
                                        <span className="text-sm text-slate-500 font-medium">↳ Reglamentaria:</span>
                                        <select name="incendioPreexistenteReglamentaria" value={formData.incendioPreexistenteReglamentaria} onChange={handleChange} className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm min-w-[120px]">
                                            <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2.4 Actividades y Almacenamiento */}
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Actividad al aire libre</label>
                                    <select name="actividadAireLibre" value={formData.actividadAireLibre} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Actividad</label>
                                    <input type="text" name="tipoActividad" value={formData.tipoActividad} onChange={handleChange} placeholder="Ej: No Aplica" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Cuenta con almacenamiento</label>
                                    <select name="almacenamiento" value={formData.almacenamiento} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="SI">SI</option><option value="NO">NO</option><option value="No Aplica">No Aplica</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="bg-slate-50 p-12 text-center rounded-3xl border border-slate-200 border-dashed">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-slate-600 font-bold text-lg mb-2">Ningún Establecimiento</h3>
                    <p className="text-slate-500">Selecciona o agrega un establecimiento para editar sus generalidades.</p>
                </div>
            )}
        </div>
    );
}
