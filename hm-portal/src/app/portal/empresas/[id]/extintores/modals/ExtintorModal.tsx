"use client";

import React, { useState, useTransition } from "react";
import { X, Save, AlertTriangle, Info } from "lucide-react";
import { createExtintor, updateExtintor, deleteExtintor } from "@/app/actions/extintores";

export default function ExtintorModal({ companyId, extintor, onClose }: { companyId: string, extintor?: any, onClose: () => void }) {
    const isEdit = !!extintor;
    const details = extintor ? JSON.parse(extintor.details || "{}") : {};

    const [isPending, startTransition] = useTransition();
    const [agentError, setAgentError] = useState("");

    const [fireClasses, setFireClasses] = useState<string[]>(details.fireClasses || []);

    const toggleFireClass = (c: string) => {
        if (fireClasses.includes(c)) {
            setFireClasses(fireClasses.filter(fc => fc !== c));
        } else {
            setFireClasses([...fireClasses, c]);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const agent = formData.get("agent") as string;
        if (agent.toLowerCase().includes("bromuro") || agent.toLowerCase().includes("tetracloruro")) {
            setAgentError("PROHIBIDO: El uso de bromuro de metilo o tetracloruro de carbono está prohibido (Art. 180 Dec 351/79).");
            return;
        }

        const data = {
            chapa: formData.get("chapa"),
            location: formData.get("location"),
            agent: agent,
            fireClasses: fireClasses,
            potential: formData.get("potential"),
            capacity: Number(formData.get("capacity")),
            coveredArea: Number(formData.get("coveredArea")),
            maxDistance: Number(formData.get("maxDistance")),
            manufacturingDate: formData.get("manufacturingDate"),
            lastInspection: formData.get("lastInspection"),
            nextInspection: formData.get("nextInspection"),
            expirationDate: formData.get("expirationDate"),
            status: formData.get("status") as string
        };

        startTransition(async () => {
            if (isEdit) {
                await updateExtintor(companyId, extintor.id, data);
            } else {
                await createExtintor(companyId, data);
            }
            onClose();
        });
    };

    const handleDelete = () => {
        if (confirm("¿Estás seguro de eliminar este extintor?")) {
            startTransition(async () => {
                await deleteExtintor(companyId, extintor.id);
                onClose();
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl my-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800">
                        {isEdit ? "Detalle de Extintor" : "Nuevo Extintor"}
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* IDENTIFICACION */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-700 border-b pb-2">Identificación</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">N° de Chapa / Baliza *</label>
                                <input required type="text" name="chapa" defaultValue={extintor?.name} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej. EXT-001" />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Ubicación *</label>
                                <input required type="text" name="location" defaultValue={extintor?.location} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej. Pasillo Central" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Capacidad (Kg/Lts)</label>
                                    <input type="number" step="0.1" name="capacity" defaultValue={details.capacity} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Superficie Prot. (m2)</label>
                                    <input type="number" name="coveredArea" defaultValue={details.coveredArea} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Max 200m2" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Agente Extintor *</label>
                                <select required name="agent" defaultValue={details.agent} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                                    <option value="">Seleccione agente...</option>
                                    <option value="Polvo Químico Seco (ABC)">Polvo Químico Seco (ABC)</option>
                                    <option value="Polvo Químico Seco (BC)">Polvo Químico Seco (BC)</option>
                                    <option value="Dióxido de Carbono (CO2)">Dióxido de Carbono (CO2)</option>
                                    <option value="Agua Presurizada">Agua Presurizada</option>
                                    <option value="Espuma AFFF">Espuma AFFF</option>
                                    <option value="Haloclean / HCFC">Haloclean / HCFC</option>
                                    <option value="Polvo Clase D">Polvo Clase D</option>
                                </select>
                                {agentError && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {agentError}</p>}
                            </div>
                        </div>

                        {/* CARACTERISTICAS TÉCNICAS Y FECHAS */}
                        <div className="space-y-4">
                            <h4 className="font-bold text-slate-700 border-b pb-2">Clases y Vencimientos</h4>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Clases de Fuego *</label>
                                <div className="flex gap-2">
                                    {['A', 'B', 'C', 'D', 'K'].map(c => (
                                        <button 
                                            key={c}
                                            type="button"
                                            onClick={() => toggleFireClass(c)}
                                            className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${fireClasses.includes(c) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Potencial Extintor</label>
                                    <input type="text" name="potential" defaultValue={details.potential} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej. 2A 10BC" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Distancia Recorrido</label>
                                    <input type="number" name="maxDistance" defaultValue={details.maxDistance} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" placeholder="Ej. 15m" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Última Carga</label>
                                    <input required type="date" name="lastInspection" defaultValue={extintor?.lastInspection ? new Date(extintor.lastInspection).toISOString().split('T')[0] : ''} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Vencimiento Carga (Anual)</label>
                                    <input required type="date" name="nextInspection" defaultValue={extintor?.nextInspection ? new Date(extintor.nextInspection).toISOString().split('T')[0] : ''} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Vencimiento Prueba Hidráulica (5 años) *</label>
                                <input required type="date" name="expirationDate" defaultValue={extintor?.expirationDate ? new Date(extintor.expirationDate).toISOString().split('T')[0] : ''} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                            </div>

                            {isEdit && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                                    <select name="status" defaultValue={extintor.status} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                                        <option value="Operativo">Operativo</option>
                                        <option value="Vencido">Vencido</option>
                                        <option value="Observado">Observado</option>
                                        <option value="En Mantenimiento">En Mantenimiento</option>
                                    </select>
                                </div>
                            )}

                        </div>
                    </div>
                    
                    <div className="bg-indigo-50 text-indigo-800 p-4 rounded-xl flex items-start gap-3 text-sm">
                        <Info className="w-5 h-5 shrink-0 mt-0.5 text-indigo-500" />
                        <div>
                            <p className="font-bold">Reglas Dec. 351/79 (Cap. 18):</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Mínimo 1 extintor cada 200 m2.</li>
                                <li>Distancia máx a recorrer: 20m para clase A, 15m para clase B.</li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t border-slate-100">
                        {isEdit ? (
                            <button type="button" onClick={handleDelete} disabled={isPending} className="px-4 py-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50">
                                Eliminar Equipo
                            </button>
                        ) : <div></div>}
                        
                        <div className="flex gap-3">
                            <button type="button" onClick={onClose} disabled={isPending} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50">
                                Cancelar
                            </button>
                            <button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50">
                                <Save className="w-5 h-5" />
                                {isPending ? 'Guardando...' : (isEdit ? 'Guardar Cambios' : 'Registrar Extintor')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
