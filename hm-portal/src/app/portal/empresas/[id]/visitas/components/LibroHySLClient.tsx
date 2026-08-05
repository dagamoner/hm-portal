"use client";

import React, { useState, useTransition } from "react";
import { BookMarked, Plus, Save, FileSignature, Calendar, Building2 } from "lucide-react";
import { createSafetyBookEntry } from "@/app/actions/reports-book";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/components/providers/AuthProvider";

export default function LibroHySLClient({ companyId, companyName, initialEntries }: { companyId: string, companyName: string, initialEntries: any[] }) {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [isCreating, setIsCreating] = useState(false);
    const [entries, setEntries] = useState(initialEntries);
    
    const [formData, setFormData] = useState({
        date: new Date().toISOString().substring(0, 10),
        observations: "",
        recommendations: "",
        deadlines: "",
        professional: user?.name || "",
        registryNumber: "",
        signedBy: user?.name || ""
    });

    const [signatureChecked, setSignatureChecked] = useState(false);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!signatureChecked) {
            alert("Debe asentar su firma digital para guardar el folio.");
            return;
        }

        startTransition(async () => {
            const res = await createSafetyBookEntry(companyId, formData);
            if (res.success && res.entry) {
                setEntries([res.entry, ...entries]);
                setIsCreating(false);
                setFormData({
                    date: new Date().toISOString().substring(0, 10),
                    observations: "",
                    recommendations: "",
                    deadlines: "",
                    professional: user?.name || "",
                    registryNumber: "",
                    signedBy: user?.name || ""
                });
                setSignatureChecked(false);
            } else {
                alert(res.error || "Error al crear asiento.");
            }
        });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center justify-between bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
                        <BookMarked className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Libro Digital de Higiene y Seguridad</h2>
                        <p className="text-slate-500 font-medium">Registro de actas y visaciones emulando el libro foliado oficial.</p>
                    </div>
                </div>
                {!isCreating && (
                    <button 
                        onClick={() => setIsCreating(true)}
                        className="bg-amber-500 text-white hover:bg-amber-600 px-6 py-3 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                        <Plus className="w-5 h-5" /> Nueva Acta / Folio
                    </button>
                )}
            </div>

            {isCreating && (
                <div className="bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-amber-50 p-6 border-b border-amber-100">
                        <h3 className="text-lg font-bold text-amber-800 flex items-center gap-2">
                            <FileSignature className="w-5 h-5" />
                            Redacción de Nueva Acta (Nuevo Folio)
                        </h3>
                    </div>
                    <form onSubmit={handleCreate} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Fecha de Visita</label>
                                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Profesional / Inspector</label>
                                <input required type="text" value={formData.professional} onChange={e => setFormData({...formData, professional: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Matrícula</label>
                                <input type="text" value={formData.registryNumber} onChange={e => setFormData({...formData, registryNumber: e.target.value})} placeholder="Opcional" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Observaciones / Constataciones</label>
                            <textarea required rows={5} value={formData.observations} onChange={e => setFormData({...formData, observations: e.target.value})} placeholder="Se deja constancia de..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Recomendaciones / Intimaciones</label>
                                <textarea rows={3} value={formData.recommendations} onChange={e => setFormData({...formData, recommendations: e.target.value})} placeholder="Se intima a la empresa a..." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Plazos (Días)</label>
                                <textarea rows={3} value={formData.deadlines} onChange={e => setFormData({...formData, deadlines: e.target.value})} placeholder="Ej: 5 días hábiles para regularizar." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500" />
                            </div>
                        </div>

                        {/* Firma Digital Checkout */}
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                            <input 
                                type="checkbox" 
                                id="signature"
                                checked={signatureChecked}
                                onChange={(e) => setSignatureChecked(e.target.checked)}
                                className="mt-1 w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                            />
                            <div>
                                <label htmlFor="signature" className="font-bold text-slate-800 cursor-pointer">Visar y Firmar Digitalmente</label>
                                <p className="text-sm text-slate-600 mt-1">
                                    Al marcar esta casilla, certifico que la información asentada es correcta y dejo mi firma digital bajo el usuario <strong>{formData.signedBy}</strong>. Esta acción genera un folio inalterable.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end border-t border-slate-100 pt-6">
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-2 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancelar</button>
                            <button type="submit" disabled={isPending || !signatureChecked} className="px-6 py-2 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 flex items-center gap-2">
                                <Save className="w-4 h-4" /> Asentar en Libro Oficial
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Renderizado de Folios */}
            <div className="space-y-8 max-w-4xl mx-auto">
                {entries.length === 0 && !isCreating && (
                    <div className="text-center py-12 text-slate-500 bg-white/60 rounded-3xl border border-white/50 backdrop-blur-xl">
                        <BookMarked className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p>El libro de Higiene y Seguridad está vacío.</p>
                        <p className="text-sm mt-1">Realice la apertura asentando el primer folio.</p>
                    </div>
                )}

                {entries.map((entry: any) => (
                    <div key={entry.id} className="bg-white border-2 border-slate-200 rounded-sm shadow-md overflow-hidden relative">
                        {/* Margen del libro */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-100 border-r border-slate-200 flex flex-col items-center py-4 space-y-4">
                            {[1,2,3,4,5,6].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-300"></div>)}
                        </div>
                        
                        <div className="pl-14 p-8">
                            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
                                <div>
                                    <h4 className="text-2xl font-black font-serif text-slate-800 uppercase tracking-widest">Acta de Visita</h4>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 font-mono">
                                        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(new Date(entry.date), "dd/MM/yyyy")}</span>
                                        <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {companyName}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Folio N°</div>
                                    <div className="text-4xl font-black text-rose-600 font-serif">{String(entry.folioNumber).padStart(4, '0')}</div>
                                </div>
                            </div>
                            
                            <div className="space-y-6 font-serif text-slate-800 leading-relaxed text-lg">
                                <div>
                                    <h5 className="font-bold text-sm uppercase text-slate-500 tracking-wider mb-2 font-sans">Observaciones y Constataciones</h5>
                                    <p className="whitespace-pre-wrap">{entry.observations}</p>
                                </div>
                                
                                {entry.recommendations && (
                                    <div>
                                        <h5 className="font-bold text-sm uppercase text-slate-500 tracking-wider mb-2 font-sans">Recomendaciones / Intimaciones</h5>
                                        <p className="whitespace-pre-wrap">{entry.recommendations}</p>
                                    </div>
                                )}

                                {entry.deadlines && (
                                    <div>
                                        <h5 className="font-bold text-sm uppercase text-slate-500 tracking-wider mb-2 font-sans">Plazos Otorgados</h5>
                                        <p className="whitespace-pre-wrap">{entry.deadlines}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-200 flex justify-end">
                                <div className="text-center w-64">
                                    {entry.signature ? (
                                        <div className="mb-2">
                                            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[10px] font-black uppercase tracking-widest font-sans">
                                                Firma Digital Válida
                                            </span>
                                        </div>
                                    ) : null}
                                    <p className="font-bold text-slate-800 border-b border-slate-300 pb-2">{entry.professional}</p>
                                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-sans">Profesional Actuante</p>
                                    {entry.registryNumber && <p className="text-xs text-slate-500 font-sans">MP: {entry.registryNumber}</p>}
                                    <p className="text-[10px] text-slate-400 mt-2 font-sans">Registrado por: {entry.signedBy} el {format(new Date(entry.createdAt), "dd/MM/yyyy HH:mm")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
