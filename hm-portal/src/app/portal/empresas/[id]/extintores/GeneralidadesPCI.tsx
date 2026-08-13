"use client";

import React, { useState, useTransition } from "react";
import { updateCompanyPciGeneralities } from "@/app/actions/companies";
import { Save, CheckCircle2, AlertCircle } from "lucide-react";

export default function GeneralidadesPCI({ company }: { company: any }) {
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    
    // Initialize form data with existing data or defaults
    const initialData = company.pciGeneralities ? (typeof company.pciGeneralities === 'string' ? JSON.parse(company.pciGeneralities) : company.pciGeneralities) : {};
    
    const [formData, setFormData] = useState({
        comentarioGeneral: initialData.comentarioGeneral || "",
        ubicacionTerreno: initialData.ubicacionTerreno || "",
        tipoZonificacion: initialData.tipoZonificacion || "",
        urbanizacionCircundante: initialData.urbanizacionCircundante || "NO",
        accesibleBomberos: initialData.accesibleBomberos || "NO",
        tipoConstruccion: initialData.tipoConstruccion || "",
        cantidadEdificios: initialData.cantidadEdificios || "",
        sismorresistente: initialData.sismorresistente || "NO",
        materialEstructural: initialData.materialEstructural || "",
        pisosSuperiores: initialData.pisosSuperiores || "",
        entrepisos: initialData.entrepisos || "N/A",
        subsuelos: initialData.subsuelos || "",
        nivelesTotales: initialData.nivelesTotales || "",
        instalacionElectrica: initialData.instalacionElectrica || "No Aplica",
        instalacionSanitaria: initialData.instalacionSanitaria || "No Aplica",
        gasNatural: initialData.gasNatural || "No Aplica",
        gasNaturalReglamentaria: initialData.gasNaturalReglamentaria || "No Aplica",
        incendioPreexistente: initialData.incendioPreexistente || "No Aplica",
        incendioPreexistenteReglamentaria: initialData.incendioPreexistenteReglamentaria || "No Aplica",
        actividadAireLibre: initialData.actividadAireLibre || "No Aplica",
        tipoActividad: initialData.tipoActividad || "No Aplica",
        almacenamiento: initialData.almacenamiento || "No Aplica"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        setSaveStatus("idle");
        startTransition(async () => {
            const result = await updateCompanyPciGeneralities(company.id, formData);
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
            
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-4 z-10">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Generalidades del Establecimiento</h2>
                    <p className="text-sm text-slate-500">Completa la información básica y estructural del establecimiento para el estudio de PCI.</p>
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

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2">1. Generalidades</h3>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Comentario / Descripción</label>
                    <textarea 
                        name="comentarioGeneral"
                        value={formData.comentarioGeneral}
                        onChange={handleChange}
                        placeholder="Ejemplo: El presente documento responde a la implementación de las instalaciones de protección contra incendios de un establecimiento destinado a Edificio de Viviendas"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
                    />
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
                            <input 
                                type="text"
                                name="ubicacionTerreno"
                                value={formData.ubicacionTerreno}
                                onChange={handleChange}
                                placeholder="Ej: Ciudad de Mendoza"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de zonificación</label>
                            <input 
                                type="text"
                                name="tipoZonificacion"
                                value={formData.tipoZonificacion}
                                onChange={handleChange}
                                placeholder="Ej: Urbana"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Urbanización circundante</label>
                            <select 
                                name="urbanizacionCircundante"
                                value={formData.urbanizacionCircundante}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Accesible a Bomberos</label>
                            <select 
                                name="accesibleBomberos"
                                value={formData.accesibleBomberos}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
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
                            <input 
                                type="text"
                                name="tipoConstruccion"
                                value={formData.tipoConstruccion}
                                onChange={handleChange}
                                placeholder="Ej: Edificación Nueva"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cantidad de Edificios</label>
                            <input 
                                type="text"
                                name="cantidadEdificios"
                                value={formData.cantidadEdificios}
                                onChange={handleChange}
                                placeholder="Ej: 1"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Sismorresistente</label>
                            <select 
                                name="sismorresistente"
                                value={formData.sismorresistente}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Mat. estructural predom.</label>
                            <input 
                                type="text"
                                name="materialEstructural"
                                value={formData.materialEstructural}
                                onChange={handleChange}
                                placeholder="Ej: Hormigón Armado"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cant. Pisos Superiores</label>
                            <input 
                                type="text"
                                name="pisosSuperiores"
                                value={formData.pisosSuperiores}
                                onChange={handleChange}
                                placeholder="Ej: 12"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Entrepisos</label>
                            <select 
                                name="entrepisos"
                                value={formData.entrepisos}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="SI">SI</option>
                                <option value="NO">NO</option>
                                <option value="N/A">N/A</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Cant. de subsuelos</label>
                            <input 
                                type="text"
                                name="subsuelos"
                                value={formData.subsuelos}
                                onChange={handleChange}
                                placeholder="Ej: 2"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">N° total niveles (inc. PB)</label>
                            <input 
                                type="text"
                                name="nivelesTotales"
                                value={formData.nivelesTotales}
                                onChange={handleChange}
                                placeholder="Ej: 15"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
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
                            <input 
                                type="text"
                                name="tipoActividad"
                                value={formData.tipoActividad}
                                onChange={handleChange}
                                placeholder="Ej: No Aplica"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
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
        </div>
    );
}
