"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { 
    Search, Plus, Download, Sun, Zap, X, Save,
    Activity, Volume2, Calculator, MapPin, Calendar, Mic2, Info, ChevronDown
} from 'lucide-react';
import { generateMeasurementReportPDF } from '@/lib/pdfGenerator';
import { createMeasurement, deleteMeasurement } from '@/app/actions/measurements';

export type MeasurementRecord = {
    id: string;
    type: string;
    area: string;
    value: number;
    unit: string;
    instrument: string;
    date: Date;
    status: string;
    companyId: string;
    details: any;
};

export default function MeasurementsClient({ 
    measurements, 
    companyId,
    companyName
}: { 
    measurements: MeasurementRecord[], 
    companyId: string,
    companyName: string
}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [meaType, setMeaType] = useState<'Iluminación' | 'Ruido' | 'Puesta a Tierra'>('Iluminación');
    const [formData, setFormData] = useState({
        area: '', instrument: '', roomLength: 0, roomWidth: 0, mountingHeight: 0, diagnostico: '', planAccion: ''
    });

    const [lightingPoints, setLightingPoints] = useState<any[]>([]);
    const [noisePoints, setNoisePoints] = useState<any[]>([]);
    const [earthingPoints, setEarthingPoints] = useState<any[]>([]);

    const calculatedK = useMemo(() => {
        const { roomLength, roomWidth, mountingHeight } = formData;
        if (roomLength && roomWidth && mountingHeight && mountingHeight > 0) {
            return (roomLength * roomWidth) / (mountingHeight * (roomLength + roomWidth));
        }
        return 0;
    }, [formData.roomLength, formData.roomWidth, formData.mountingHeight]);

    const calculatedN = useMemo(() => {
        if (calculatedK <= 0) return 0;
        if (calculatedK <= 1) return 9;
        if (calculatedK <= 2) return 16;
        if (calculatedK <= 3) return 25;
        return 36;
    }, [calculatedK]);

    useEffect(() => {
        if (meaType === 'Iluminación' && calculatedN > 0 && lightingPoints.length !== calculatedN) {
            setLightingPoints(Array.from({ length: calculatedN }, (_, i) => ({
                id: (i + 1).toString(), measuredValue: 0, requiredValue: 200, isCompliant: false
            })));
        }
    }, [calculatedN, meaType]);

    const handleAddPoint = () => {
        if (meaType === 'Ruido') {
            setNoisePoints([...noisePoints, { id: Date.now().toString(), sector: formData.area || '', type: 'Continuo', lAeq: 0, noiseDose: 0, isCompliant: false }]);
        } else if (meaType === 'Puesta a Tierra') {
            setEarthingPoints([...earthingPoints, { id: Date.now().toString(), position: `Jabalina ${earthingPoints.length + 1}`, resistanceValue: 0, hasContinuity: true, tripTime: 0, isCompliant: false }]);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        
        const details = {
            roomLength: formData.roomLength,
            roomWidth: formData.roomWidth,
            mountingHeight: formData.mountingHeight,
            calculatedK,
            calculatedN,
            lightingPoints: meaType === 'Iluminación' ? lightingPoints : undefined,
            noisePoints: meaType === 'Ruido' ? noisePoints : undefined,
            earthingPoints: meaType === 'Puesta a Tierra' ? earthingPoints : undefined,
            diagnostico: formData.diagnostico,
            planAccion: formData.planAccion
        };

        try {
            await createMeasurement(companyId, {
                type: meaType,
                area: formData.area,
                instrument: formData.instrument,
                details
            });
            setIsModalOpen(false);
            setFormData({ area: '', instrument: '', roomLength: 0, roomWidth: 0, mountingHeight: 0, diagnostico: '', planAccion: '' });
            setLightingPoints([]);
            setNoisePoints([]);
            setEarthingPoints([]);
        } catch (error) {
            alert("Error al guardar la medición");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = (mea: MeasurementRecord) => {
        generateMeasurementReportPDF(mea, companyName);
    };

    const filtered = measurements.filter(m => m.area.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="w-10 h-10 text-indigo-600" />
                        Mediciones Técnicas SRT
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Gestión de protocolos oficiales 84/12, 85/12 y 900/15.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-3 shadow-2xl transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Nuevo Protocolo Oficial
                </button>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" placeholder="Buscar por área o sector..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(mea => (
                    <div key={mea.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col">
                        <div className="p-7 flex-1">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3.5 bg-slate-50 rounded-2xl">
                                        {mea.type === 'Ruido' ? <Volume2 className="text-rose-500" /> : mea.type === 'Iluminación' ? <Sun className="text-amber-500" /> : <Zap className="text-blue-500" />}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 text-lg leading-none mb-1">{mea.type}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{mea.area}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(mea.date).toLocaleDateString()}</div>
                                <div className="text-indigo-500 font-mono tracking-tighter">PROTOCOLO SRT</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDownload(mea)}
                            className="w-full py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                        >
                            <Download className="w-3.5 h-3.5" /> Descargar PDF Oficial
                        </button>
                    </div>
                ))}
                
                {filtered.length === 0 && (
                    <div className="col-span-full py-20 text-center flex flex-col items-center">
                        <Activity className="w-16 h-16 text-slate-200 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400 mb-2">No hay protocolos registrados</h3>
                        <p className="text-slate-500 max-w-md mx-auto">Comienza cargando un nuevo protocolo oficial haciendo clic en el botón morado superior.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-fade-in" onClick={() => !isSaving && setIsModalOpen(false)}></div>
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col animate-fade-in-up">
                        <div className="p-8 border-b bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <select value={meaType} onChange={e => setMeaType(e.target.value as any)} className={`appearance-none bg-white border-2 px-6 py-2 pr-10 rounded-xl font-black outline-none shadow-lg transition-colors ${meaType === 'Iluminación' ? 'border-amber-500 text-amber-600' : meaType === 'Ruido' ? 'border-rose-500 text-rose-600' : 'border-blue-500 text-blue-600'}`}>
                                        <option value="Iluminación">Iluminación</option>
                                        <option value="Ruido">Ruido</option>
                                        <option value="Puesta a Tierra">Puesta a Tierra</option>
                                    </select>
                                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${meaType === 'Iluminación' ? 'text-amber-500' : meaType === 'Ruido' ? 'text-rose-500' : 'text-blue-500'}`} />
                                </div>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Nueva Medición Técnica de Campo</p>
                            </div>
                            <button onClick={() => !isSaving && setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-400"><X className="w-6 h-6" /></button>
                        </div>
                        
                        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="col-span-2 space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Área / Sector / Establecimiento</label>
                                    <input required type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-colors" placeholder="Ej: Nave de Estampado / Oficina Central" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Instrumento / Modelo</label>
                                    <input required type="text" value={formData.instrument} onChange={e => setFormData({...formData, instrument: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-colors" placeholder="Ej: Sonómetro TSI Edge 5" />
                                </div>
                            </div>

                            {meaType === 'Iluminación' && (
                                <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-200 space-y-6">
                                    <h4 className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-2"><Calculator className="w-4 h-4" /> Metodología Cuadrícula (Res 84/12)</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Largo (m)</label>
                                            <input type="number" min="0" step="0.1" value={formData.roomLength || ''} onChange={e => setFormData({...formData, roomLength: +e.target.value})} className="w-full px-4 py-2 rounded-xl border border-amber-200/50 font-bold focus:border-amber-400 outline-none transition-colors" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Ancho (m)</label>
                                            <input type="number" min="0" step="0.1" value={formData.roomWidth || ''} onChange={e => setFormData({...formData, roomWidth: +e.target.value})} className="w-full px-4 py-2 rounded-xl border border-amber-200/50 font-bold focus:border-amber-400 outline-none transition-colors" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-bold text-slate-500 uppercase ml-1">Alt. Montaje (m)</label>
                                            <input type="number" min="0" step="0.1" value={formData.mountingHeight || ''} onChange={e => setFormData({...formData, mountingHeight: +e.target.value})} className="w-full px-4 py-2 rounded-xl border border-amber-200/50 font-bold focus:border-amber-400 outline-none transition-colors" />
                                        </div>
                                        <div className="bg-white px-4 py-2 rounded-xl text-center font-black text-amber-700 flex flex-col justify-center border border-amber-300 shadow-sm">
                                            <span className="text-[8px] uppercase tracking-wider text-amber-500 mb-1">Puntos Mínimos</span>
                                            <span className="text-xl">N: {calculatedN}</span>
                                        </div>
                                    </div>
                                    
                                    {calculatedN > 0 && (
                                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 overflow-x-auto">
                                            <table className="w-full text-xs text-left min-w-[500px]">
                                                <thead>
                                                    <tr className="text-slate-400 font-black uppercase text-[9px] tracking-wider">
                                                        <th className="pb-3 px-2">Punto</th>
                                                        <th className="pb-3 px-2 text-center">Lux Medido</th>
                                                        <th className="pb-3 px-2 text-center">Requerido (Lux)</th>
                                                        <th className="pb-3 px-2 text-center">Estado del Punto</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50">
                                                    {lightingPoints.map((p, i) => {
                                                        const isOk = p.measuredValue >= p.requiredValue;
                                                        return (
                                                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                                                <td className="py-3 px-2 font-black text-slate-500">Pto {i+1}</td>
                                                                <td className="py-2 px-2 text-center">
                                                                    <input type="number" min="0" value={p.measuredValue || ''} onChange={e => setLightingPoints(prev => prev.map((item, idx) => idx === i ? {...item, measuredValue: +e.target.value, isCompliant: +e.target.value >= item.requiredValue} : item))} className="w-24 text-center border border-slate-200 bg-white rounded-lg px-3 py-1.5 font-black text-amber-600 focus:border-amber-400 outline-none transition-colors" />
                                                                </td>
                                                                <td className="py-2 px-2 text-center">
                                                                    <input type="number" min="0" value={p.requiredValue || ''} onChange={e => setLightingPoints(prev => prev.map((item, idx) => idx === i ? {...item, requiredValue: +e.target.value, isCompliant: item.measuredValue >= +e.target.value} : item))} className="w-24 text-center border border-slate-200 bg-white rounded-lg px-3 py-1.5 font-bold text-slate-600 focus:border-amber-400 outline-none transition-colors" />
                                                                </td>
                                                                <td className="py-2 px-2 text-center">
                                                                    <span className={`inline-block w-24 text-[10px] font-black text-center py-1.5 rounded-lg border ${isOk ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                                                        {isOk ? 'CUMPLE' : 'NO CUMPLE'}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            
                                            {/* Resultados Globales */}
                                            {lightingPoints.length > 0 && (
                                                <div className="mt-6 pt-6 border-t border-amber-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {(() => {
                                                        const eMedia = lightingPoints.reduce((acc, p) => acc + (Number(p.measuredValue) || 0), 0) / lightingPoints.length;
                                                        const eMinima = Math.min(...lightingPoints.map(p => Number(p.measuredValue) || 0));
                                                        const req = lightingPoints[0]?.requiredValue || 0;
                                                        const cumpleMedia = eMedia >= req;
                                                        const cumpleUniformidad = eMinima >= (eMedia / 2);
                                                        
                                                        return (
                                                            <>
                                                                <div className={`p-4 rounded-xl border ${cumpleMedia ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                                                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">E Media vs Requerido</p>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-black text-lg">{eMedia.toFixed(2)} Lux</span>
                                                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${cumpleMedia ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                            {cumpleMedia ? 'CUMPLE' : 'NO CUMPLE'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className={`p-4 rounded-xl border ${cumpleUniformidad ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                                                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Uniformidad (E Min ≥ E Media / 2)</p>
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="font-black text-lg">{eMinima} ≥ {(eMedia / 2).toFixed(2)}</span>
                                                                        <span className={`text-[10px] font-black px-2 py-1 rounded-md ${cumpleUniformidad ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                                            {cumpleUniformidad ? 'CUMPLE' : 'NO CUMPLE'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {meaType === 'Ruido' && (
                                <div className="bg-rose-50/50 p-8 rounded-3xl border border-rose-200 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-2"><Mic2 className="w-4 h-4" /> Relevamiento de Sonometría (Res 85/12)</h4>
                                        <button type="button" onClick={handleAddPoint} className="bg-rose-600 text-white p-2.5 rounded-xl shadow-md hover:bg-rose-700 hover:shadow-lg active:scale-95 transition-all"><Plus className="w-5 h-5" /></button>
                                    </div>
                                    <div className="space-y-4">
                                        {noisePoints.map((p) => {
                                            const isExceeded = p.lAeq > 85;
                                            return (
                                                <div key={p.id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-rose-100 relative group">
                                                    <button type="button" onClick={() => setNoisePoints(prev => prev.filter(item => item.id !== p.id))} className="absolute -top-2 -right-2 bg-slate-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"><X className="w-3 h-3" /></button>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Puesto/Tarea</label>
                                                        <input placeholder="Ej: Soldadura" value={p.sector} onChange={e => setNoisePoints(prev => prev.map(item => item.id === p.id ? {...item, sector: e.target.value} : item))} className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-rose-400 outline-none transition-colors rounded-xl" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">LAeq (dBA)</label>
                                                        <input type="number" step="0.1" value={p.lAeq || ''} onChange={e => setNoisePoints(prev => prev.map(item => item.id === p.id ? {...item, lAeq: +e.target.value} : item))} className={`w-full px-3 py-2 text-xs font-black border ${isExceeded ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-700 border-slate-200'} focus:border-rose-400 outline-none transition-colors rounded-xl`} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Dosis %</label>
                                                        <input type="number" step="0.1" value={p.noiseDose || ''} onChange={e => setNoisePoints(prev => prev.map(item => item.id === p.id ? {...item, noiseDose: +e.target.value} : item))} className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-rose-400 outline-none transition-colors rounded-xl" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Tipo</label>
                                                        <div className="relative">
                                                            <select value={p.type} onChange={e => setNoisePoints(prev => prev.map(item => item.id === p.id ? {...item, type: e.target.value} : item))} className="w-full px-3 py-2 pr-8 text-xs font-bold border border-slate-200 focus:border-rose-400 outline-none transition-colors rounded-xl appearance-none bg-white">
                                                                <option>Continuo</option>
                                                                <option>Intermitente</option>
                                                                <option>Impulso</option>
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-end pb-0.5">
                                                        <span className={`w-full text-[10px] font-black text-center py-2.5 rounded-xl border transition-colors ${isExceeded ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                                            {isExceeded ? 'EXCEDIDO' : 'NORMAL'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {noisePoints.length === 0 && (
                                            <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-rose-200 text-rose-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-rose-50 transition-colors" onClick={handleAddPoint}>
                                                Clic en el + para agregar mediciones
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {meaType === 'Puesta a Tierra' && (
                                <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-200 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-black text-blue-700 uppercase tracking-widest flex items-center gap-2"><Zap className="w-4 h-4" /> Verificación Protocolo Res 900/15</h4>
                                        <button type="button" onClick={() => setEarthingPoints([...earthingPoints, { id: Date.now().toString(), position: `Jabalina ${earthingPoints.length + 1}`, condition: 'Seco', use: 'Seguridad de Masas', scheme: 'TT', protection: 'DD', resistanceValue: 0, hasContinuity: true, tripTime: 0, isCompliant: false }])} className="bg-blue-600 text-white p-2.5 rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all"><Plus className="w-5 h-5" /></button>
                                    </div>
                                    <div className="space-y-4">
                                        {earthingPoints.map((p) => {
                                            const isOk = p.resistanceValue <= 40 && p.hasContinuity && p.tripTime <= 300;
                                            return (
                                                <div key={p.id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 bg-white p-5 rounded-2xl shadow-sm border border-blue-100 relative group">
                                                    <button type="button" onClick={() => setEarthingPoints(prev => prev.filter(item => item.id !== p.id))} className="absolute -top-2 -right-2 bg-slate-800 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 z-10"><X className="w-3 h-3" /></button>
                                                    <div className="space-y-1.5 xl:col-span-2">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Ubicación</label>
                                                        <input placeholder="Ej: Tablero Principal" value={p.position} onChange={e => setEarthingPoints(prev => prev.map(item => item.id === p.id ? {...item, position: e.target.value} : item))} className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-blue-400 outline-none transition-colors rounded-xl" />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Condición</label>
                                                        <div className="relative">
                                                            <select value={p.condition || 'Seco'} onChange={e => setEarthingPoints(prev => prev.map(item => item.id === p.id ? {...item, condition: e.target.value} : item))} className="w-full px-3 py-2 pr-8 text-xs font-bold border border-slate-200 focus:border-blue-400 outline-none transition-colors rounded-xl appearance-none bg-white">
                                                                <option>Seco</option>
                                                                <option>Húmedo</option>
                                                                <option>Lluvias</option>
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Esquema</label>
                                                        <div className="relative">
                                                            <select value={p.scheme || 'TT'} onChange={e => setEarthingPoints(prev => prev.map(item => item.id === p.id ? {...item, scheme: e.target.value} : item))} className="w-full px-3 py-2 pr-8 text-xs font-bold border border-slate-200 focus:border-blue-400 outline-none transition-colors rounded-xl appearance-none bg-white">
                                                                <option>TT</option>
                                                                <option>TN-S</option>
                                                                <option>IT</option>
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Protección</label>
                                                        <div className="relative">
                                                            <select value={p.protection || 'DD'} onChange={e => setEarthingPoints(prev => prev.map(item => item.id === p.id ? {...item, protection: e.target.value} : item))} className="w-full px-3 py-2 pr-8 text-xs font-bold border border-slate-200 focus:border-blue-400 outline-none transition-colors rounded-xl appearance-none bg-white">
                                                                <option value="DD">Diferencial (DD)</option>
                                                                <option value="IA">Termomag. (IA)</option>
                                                                <option value="Fusible">Fusible</option>
                                                            </select>
                                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">R (Ω) &lt; 40Ω</label>
                                                        <input type="number" step="0.1" value={p.resistanceValue || ''} onChange={e => setEarthingPoints(prev => prev.map(item => item.id === p.id ? {...item, resistanceValue: +e.target.value} : item))} className={`w-full px-3 py-2 text-xs font-black border ${p.resistanceValue > 40 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-white text-slate-700 border-slate-200'} focus:border-blue-400 outline-none transition-colors rounded-xl`} />
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <label className="text-[9px] font-black text-slate-400 uppercase ml-1">Disparo (ms)</label>
                                                        <input type="number" value={p.tripTime || ''} onChange={e => setEarthingPoints(prev => prev.map(item => item.id === p.id ? {...item, tripTime: +e.target.value} : item))} className="w-full px-3 py-2 text-xs font-bold border border-slate-200 focus:border-blue-400 outline-none transition-colors rounded-xl" />
                                                    </div>
                                                    <div className="flex items-center justify-center pt-5">
                                                        <label className="flex items-center gap-1.5 cursor-pointer">
                                                            <input type="checkbox" checked={p.hasContinuity} onChange={e => setEarthingPoints(prev => prev.map(item => item.id === p.id ? {...item, hasContinuity: e.target.checked} : item))} className="w-4 h-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500" />
                                                            <span className="text-[10px] font-black text-slate-500 uppercase leading-none mt-1">Masas</span>
                                                        </label>
                                                    </div>
                                                    <div className="flex items-end pb-0.5 xl:col-span-8">
                                                        <span className={`w-full text-[10px] font-black text-center py-2.5 rounded-xl border transition-colors ${isOk ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'}`}>
                                                            {isOk ? 'EL PUNTO CUMPLE CON RES 900/15' : 'NO CUMPLE'}
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {earthingPoints.length === 0 && (
                                            <div className="text-center py-6 bg-white rounded-2xl border border-dashed border-blue-200 text-blue-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setEarthingPoints([{ id: Date.now().toString(), position: 'Jabalina 1', condition: 'Seco', use: 'Seguridad de Masas', scheme: 'TT', protection: 'DD', resistanceValue: 0, hasContinuity: true, tripTime: 0, isCompliant: false }])}>
                                                Clic en el + para agregar puntos a verificar
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-200">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Diagnóstico</label>
                                    <textarea rows={3} value={formData.diagnostico} onChange={e => setFormData({...formData, diagnostico: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-colors custom-scrollbar resize-none" placeholder="Conclusiones sobre los resultados obtenidos..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Plan de Acción (si aplica)</label>
                                    <textarea rows={3} value={formData.planAccion} onChange={e => setFormData({...formData, planAccion: e.target.value})} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-bold focus:border-indigo-500 outline-none transition-colors custom-scrollbar resize-none" placeholder="Medidas correctivas a tomar..." />
                                </div>
                            </div>

                            <button type="submit" disabled={isSaving} className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70">
                                {isSaving ? 'Guardando...' : <><Save className="w-5 h-5" /> Finalizar y Guardar Protocolo SRT</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
