"use client";

import React, { useState, useTransition } from "react";
import { X, ClipboardCheck, AlertTriangle } from "lucide-react";
import { addExtintorChecklist } from "@/app/actions/extintores";

export default function ChecklistExtintorModal({ companyId, extintor, onClose }: { companyId: string, extintor: any, onClose: () => void }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        
        const data = {
            manometerGreen: formData.get("manometerGreen") === "on",
            sealIntact: formData.get("sealIntact") === "on",
            hoseGood: formData.get("hoseGood") === "on",
            cylinderGood: formData.get("cylinderGood") === "on",
            signageGood: formData.get("signageGood") === "on",
            accessFree: formData.get("accessFree") === "on",
            observations: formData.get("observations") as string,
            inspector: formData.get("inspector") as string
        };

        startTransition(async () => {
            await addExtintorChecklist(companyId, extintor.id, data);
            onClose();
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-xl w-full max-w-xl my-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <ClipboardCheck className="w-5 h-5 text-emerald-500" />
                            Checklist Mensual
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Extintor: {extintor.name} ({extintor.location})</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="manometerGreen" defaultChecked className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">¿Manómetro indicador de presión en zona verde (operativo)?</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="sealIntact" defaultChecked className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">¿Precinto de seguridad intacto y traba colocada?</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="hoseGood" defaultChecked className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">¿Manguera y tobera en buen estado, sin obstrucciones ni grietas?</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="cylinderGood" defaultChecked className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">¿Cilindro y pintura en buen estado general (sin corrosión ni golpes)?</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="signageGood" defaultChecked className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">¿Señalización superior y chapa baliza presentes y legibles?</span>
                        </label>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" name="accessFree" defaultChecked className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500" />
                            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">¿Acceso al extintor libre de obstáculos y elementos?</span>
                        </label>
                    </div>

                    <div className="bg-amber-50 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-sm">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-500" />
                        <p>Si alguna de las condiciones no se cumple, desmarca la casilla correspondiente. El equipo pasará a estado <strong>Observado</strong>.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Inspector</label>
                        <input required type="text" name="inspector" className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Nombre de quien realiza el control" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Observaciones</label>
                        <textarea name="observations" rows={3} className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" placeholder="Detalles de anomalías, si las hay..."></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button type="button" onClick={onClose} disabled={isPending} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50">
                            <ClipboardCheck className="w-5 h-5" />
                            {isPending ? 'Guardando...' : 'Guardar Checklist'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
