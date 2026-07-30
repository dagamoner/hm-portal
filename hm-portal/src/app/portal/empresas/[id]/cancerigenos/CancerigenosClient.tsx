"use client";

import React, { useState } from 'react';
import { 
    ShieldAlert, Plus, Shield, Wind, Microscope, ArrowRight, ArrowLeft, Check, Search, Save, AlertCircle, X, MapPin, Download
} from 'lucide-react';
import { ESOP_AGENTS } from '@/lib/esopData';
import { createCancerigenoEvaluation } from '@/app/actions/cancerigenos';
import { useRouter } from 'next/navigation';
import { generateCancerigenosReportPDF } from '@/lib/pdfGenerator';
import { useAuth } from '@/components/providers/AuthProvider';

export default function CancerigenosClient({ 
    presentaciones, 
    companyId,
    companyName
}: { 
    presentaciones: any[], 
    companyId: string,
    companyName: string
}) {
    const { isClient } = useAuth();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [year, setYear] = useState(new Date().getFullYear());
    const [responsables, setResponsables] = useState({
        datos: { cuil: '', cargo: '' },
        hys: { cuil: '', matricula: '', caracter: 'Interno', horas: '' },
        medicina: { cuil: '', matricula: '', caracter: 'Externo', horas: '' }
    });
    const [puestos, setPuestos] = useState<any[]>([]);
    const [sustancias, setSustancias] = useState<any[]>([]);
    const [diagnostico, setDiagnostico] = useState('');
    const [planAccion, setPlanAccion] = useState('');
    
    // Temp states
    const [newPuesto, setNewPuesto] = useState({ nombre: '', sector: '', ciiu: '', expuestos: '' });
    const [newSustancia, setNewSustancia] = useState({ 
        esop: '', nombreComercial: '', tipo: 'QUIMICO', uso: 'Materia Prima', cantidad: '', unidad: 'kg', puestoId: ''
    });
    const [searchEsop, setSearchEsop] = useState('');

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await createCancerigenoEvaluation(companyId, {
                year,
                responsables,
                puestos,
                sustancias,
                medidas: { diagnostico, planAccion }
            });
            setIsCreating(false);
            setStep(1);
            setDiagnostico('');
            setPlanAccion('');
            router.refresh();
        } catch (error) {
            alert('Error guardando la evaluación');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isCreating && presentaciones.length === 0) {
        return (
            <div className="space-y-8 animate-fade-in pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <ShieldAlert className="w-10 h-10 text-rose-600" />
                            Registro SVCC (Cancerígenos)
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">
                            Vigilancia de Agentes Críticos - Res. SRT 81/2019.
                        </p>
                    </div>
                    {!isClient && (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-3 shadow-xl shadow-rose-600/20 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> NUEVA PRESENTACIÓN ANUAL
                        </button>
                    )}
                </div>
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="w-full lg:w-80 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 flex-shrink-0">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">LEGISLACIÓN APLICABLE</h3>
                        <nav className="space-y-3">
                            <div className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-slate-50 text-slate-600 font-medium text-sm border border-slate-100/50">
                                <Shield className="w-5 h-5 text-rose-500 flex-shrink-0" />
                                <span className="leading-snug">Ley 24.557 de Riesgos del Trabajo.</span>
                            </div>
                            <div className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-slate-50 text-slate-600 font-medium text-sm border border-slate-100/50">
                                <Wind className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                <span className="leading-snug">Res. 295/03 CMP (Concentración Máxima).</span>
                            </div>
                        </nav>
                    </div>
                    <div className="flex-1 w-full space-y-6">
                        <div className="bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200 py-32 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <Microscope className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-black text-slate-700 mb-2">Sin Presentaciones Anuales</h3>
                            <p className="text-slate-400 font-medium max-w-md mx-auto">
                                La Res. 81/19 requiere el registro histórico de vigilancia de agentes críticos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!isCreating && presentaciones.length > 0) {
        return (
            <div className="space-y-8 animate-fade-in pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <ShieldAlert className="w-10 h-10 text-rose-600" />
                            Registro SVCC (Cancerígenos)
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">
                            Vigilancia de Agentes Críticos - Res. SRT 81/2019.
                        </p>
                    </div>
                    {!isClient && (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-3 shadow-xl shadow-rose-600/20 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" /> NUEVA PRESENTACIÓN ANUAL
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {presentaciones.map((p: any) => (
                        <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center font-black">
                                        {p.year}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">Presentación {p.year}</h3>
                                        <p className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-full border border-green-200">Enviado</span>
                            </div>
                            <div className="space-y-2 mt-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Puestos Afectados:</span>
                                    <span className="font-bold text-slate-700">{(p.puestos || []).length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Agentes Declarados:</span>
                                    <span className="font-bold text-slate-700">{(p.sustancias || []).length}</span>
                                </div>
                            </div>
                            <button onClick={() => generateCancerigenosReportPDF(p, companyName)} className="mt-6 w-full py-3 bg-slate-50 hover:bg-rose-600 hover:text-white transition-colors rounded-xl text-xs font-black uppercase tracking-widest text-rose-700 flex items-center justify-center gap-2">
                                <Download className="w-4 h-4" /> PDF Oficial
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-rose-600" />
                        Nueva Presentación SVCC
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Año a declarar: <span className="font-bold">{year}</span></p>
                </div>
                <button 
                    onClick={() => setIsCreating(false)}
                    className="p-3 bg-white border border-slate-200 text-slate-500 rounded-full hover:bg-slate-50"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center flex-1 relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                            step === s ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30' : 
                            step > s ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                            {step > s ? <Check className="w-5 h-5" /> : s}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider mt-3 ${step === s ? 'text-slate-800' : 'text-slate-400'}`}>
                            {s === 1 ? 'Responsables' : s === 2 ? 'Puestos' : 'Agentes'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                {step === 1 && (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-slate-400" /> Responsable de Registro
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">CUIL / CUIT</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                        value={responsables.datos.cuil}
                                        onChange={e => setResponsables({...responsables, datos: {...responsables.datos, cuil: e.target.value}})}
                                        placeholder="Ej: 20-12345678-9"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Cargo en la Empresa</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                        value={responsables.datos.cargo}
                                        onChange={e => setResponsables({...responsables, datos: {...responsables.datos, cargo: e.target.value}})}
                                        placeholder="Ej: Gerente RRHH"
                                    />
                                </div>
                            </div>
                        </div>
                        <hr className="border-slate-100" />
                        <div>
                            <h3 className="text-xl font-bold text-slate-800 mb-6">Servicio de Higiene y Seguridad</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">CUIL Profesional</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                        value={responsables.hys.cuil}
                                        onChange={e => setResponsables({...responsables, hys: {...responsables.hys, cuil: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Matrícula</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                        value={responsables.hys.matricula}
                                        onChange={e => setResponsables({...responsables, hys: {...responsables.hys, matricula: e.target.value}})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Horas Asignadas</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                        value={responsables.hys.horas}
                                        onChange={e => setResponsables({...responsables, hys: {...responsables.hys, horas: e.target.value}})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-slate-400" /> Puestos Afectados
                            </h3>
                        </div>

                        {puestos.map((p, i) => (
                            <div key={i} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-slate-800">{p.nombre}</p>
                                    <p className="text-sm text-slate-500">Sector: {p.sector} • {p.expuestos} trabajadores expuestos</p>
                                </div>
                                <button onClick={() => setPuestos(puestos.filter((_, idx) => idx !== i))} className="text-rose-500 hover:bg-rose-50 p-2 rounded-xl">Eliminar</button>
                            </div>
                        ))}

                        <div className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-3xl">
                            <h4 className="font-bold text-slate-700 mb-4">Agregar Puesto</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input 
                                    type="text" placeholder="Nombre del Puesto (ej: Operador de Caldera)"
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                    value={newPuesto.nombre} onChange={e => setNewPuesto({...newPuesto, nombre: e.target.value})}
                                />
                                <input 
                                    type="text" placeholder="Sector (ej: Mantenimiento)"
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                    value={newPuesto.sector} onChange={e => setNewPuesto({...newPuesto, sector: e.target.value})}
                                />
                                <input 
                                    type="number" placeholder="Cantidad Expuestos"
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                    value={newPuesto.expuestos} onChange={e => setNewPuesto({...newPuesto, expuestos: e.target.value})}
                                />
                                <input 
                                    type="text" placeholder="Código CIIU"
                                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                    value={newPuesto.ciiu} onChange={e => setNewPuesto({...newPuesto, ciiu: e.target.value})}
                                />
                            </div>
                            <button 
                                onClick={() => {
                                    if(newPuesto.nombre) {
                                        setPuestos([...puestos, { ...newPuesto, id: Date.now().toString() }]);
                                        setNewPuesto({ nombre: '', sector: '', ciiu: '', expuestos: '' });
                                    }
                                }}
                                className="w-full bg-slate-900 text-white font-bold rounded-xl py-3"
                            >
                                + AÑADIR PUESTO
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <Microscope className="w-6 h-6 text-slate-400" /> Sustancias y Agentes
                            </h3>
                        </div>
                        
                        {puestos.length === 0 ? (
                            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" />
                                Debe registrar al menos un puesto de trabajo en el paso anterior.
                            </div>
                        ) : (
                            <>
                                {sustancias.map((s, i) => (
                                    <div key={i} className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-800">{s.nombreEsop} <span className="text-xs bg-slate-200 px-2 py-1 rounded text-slate-600 ml-2">ESOP: {s.esop}</span></p>
                                            <p className="text-sm text-slate-500">Puesto ID: {puestos.find(p=>p.id===s.puestoId)?.nombre || ''} • Cantidad: {s.cantidad} {s.unidad}</p>
                                        </div>
                                        <button onClick={() => setSustancias(sustancias.filter((_, idx) => idx !== i))} className="text-rose-500 hover:bg-rose-100 p-2 rounded-xl">Eliminar</button>
                                    </div>
                                ))}

                                <div className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-3xl space-y-4">
                                    <h4 className="font-bold text-slate-700 mb-2">Declarar Nueva Sustancia</h4>
                                    
                                    <div className="relative">
                                        <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Buscar agente por nombre o código ESOP..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50 font-medium"
                                            value={searchEsop}
                                            onChange={e => setSearchEsop(e.target.value)}
                                        />
                                        {searchEsop && (
                                            <div className="absolute top-14 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-50">
                                                {ESOP_AGENTS.filter(a => a.name.toLowerCase().includes(searchEsop.toLowerCase()) || a.code.includes(searchEsop)).map(a => (
                                                    <div 
                                                        key={a.code} 
                                                        className="p-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                                                        onClick={() => {
                                                            setNewSustancia({...newSustancia, esop: a.code, nombreComercial: a.name});
                                                            setSearchEsop('');
                                                        }}
                                                    >
                                                        <span className="font-bold text-slate-700 mr-3">{a.code}</span>
                                                        <span className="text-slate-600">{a.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {newSustancia.esop && (
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                            <div className="mb-4">
                                                <span className="text-xs font-bold uppercase text-slate-400 block mb-1">Agente Seleccionado</span>
                                                <p className="font-bold text-rose-600">{newSustancia.esop} - {newSustancia.nombreComercial}</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1">Asignar al Puesto</label>
                                                    <select 
                                                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50"
                                                        value={newSustancia.puestoId}
                                                        onChange={e => setNewSustancia({...newSustancia, puestoId: e.target.value})}
                                                    >
                                                        <option value="">Seleccione Puesto...</option>
                                                        {puestos.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.sector})</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1">Cantidad Anual Consumida</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="number" 
                                                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 outline-none"
                                                            value={newSustancia.cantidad}
                                                            onChange={e => setNewSustancia({...newSustancia, cantidad: e.target.value})}
                                                            placeholder="Ej: 500"
                                                        />
                                                        <select 
                                                            className="w-24 bg-white border border-slate-200 rounded-xl px-2 outline-none"
                                                            value={newSustancia.unidad}
                                                            onChange={e => setNewSustancia({...newSustancia, unidad: e.target.value})}
                                                        >
                                                            <option value="kg">kg</option>
                                                            <option value="lt">lt</option>
                                                            <option value="ton">ton</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    if(newSustancia.puestoId && newSustancia.cantidad) {
                                                        setSustancias([...sustancias, { ...newSustancia, nombreEsop: ESOP_AGENTS.find(a=>a.code===newSustancia.esop)?.name }]);
                                                        setNewSustancia({ esop: '', nombreComercial: '', tipo: 'QUIMICO', uso: 'Materia Prima', cantidad: '', unidad: 'kg', puestoId: '' });
                                                    } else {
                                                        alert("Complete el puesto y la cantidad");
                                                    }
                                                }}
                                                className="w-full mt-4 bg-slate-900 text-white font-bold rounded-xl py-3"
                                            >
                                                + REGISTRAR AGENTE
                                            </button>
                                        </div>
                                    )}

                                    <div className="space-y-4 border-t border-slate-100 pt-6 mt-6">
                                        <h4 className="font-bold text-slate-700">Conclusiones y Diagnóstico</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Diagnóstico General</label>
                                                <textarea rows={3} value={diagnostico} onChange={e => setDiagnostico(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold focus:border-rose-500 outline-none transition-colors custom-scrollbar resize-none" placeholder="Conclusiones sobre los agentes críticos declarados..." />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Plan de Acción (si aplica)</label>
                                                <textarea rows={3} value={planAccion} onChange={e => setPlanAccion(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold focus:border-rose-500 outline-none transition-colors custom-scrollbar resize-none" placeholder="Medidas de control a implementar..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between pt-6">
                <button 
                    onClick={() => setStep(step - 1)}
                    disabled={step === 1}
                    className={`px-6 py-4 rounded-2xl font-bold flex items-center gap-2 ${step === 1 ? 'opacity-0 pointer-events-none' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <ArrowLeft className="w-5 h-5" /> Anterior
                </button>

                {step < 3 ? (
                    <button 
                        onClick={() => setStep(step + 1)}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95"
                    >
                        Siguiente <ArrowRight className="w-5 h-5" />
                    </button>
                ) : (
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || puestos.length === 0 || sustancias.length === 0}
                        className="bg-green-500 text-white px-8 py-4 rounded-2xl font-black tracking-wider uppercase text-sm flex items-center gap-3 hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-green-500/20"
                    >
                        {isSaving ? 'Guardando...' : <><Save className="w-5 h-5" /> GUARDAR PRESENTACIÓN</>}
                    </button>
                )}
            </div>
        </div>
    );
}
