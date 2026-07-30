"use client";

import React, { useState, useMemo } from 'react';
import { Search, Plus, AlertTriangle, X, Eye, FileText, Calendar, MapPin, Activity, CheckCircle, ShieldAlert, Edit, Trash2 } from 'lucide-react';
import { createIncident, updateIncidentStatus, updateIncident, deleteIncident } from '@/app/actions/incidents';
import { useRouter } from 'next/navigation';

export default function IncidentsClient({
    incidents,
    companyId
}: {
    incidents: any[],
    companyId: string
}) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIncident, setSelectedIncident] = useState<any | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // New Incident State
    const [title, setTitle] = useState('');
    const [dateStr, setDateStr] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [severity, setSeverity] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');
    
    // Extra details
    const [incidentType, setIncidentType] = useState('');
    const [bodyPart, setBodyPart] = useState('');
    const [machinery, setMachinery] = useState('');
    const [witnesses, setWitnesses] = useState('');
    
    const [isSaving, setIsSaving] = useState(false);

    // Filter incidents
    const filteredIncidents = useMemo(() => {
        return incidents.filter((inc) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                inc.title.toLowerCase().includes(searchLower) ||
                inc.location.toLowerCase().includes(searchLower) ||
                inc.id.toLowerCase().includes(searchLower)
            );
        });
    }, [incidents, searchTerm]);

    // Check for critical alerts
    const criticalAlert = useMemo(() => {
        const now = new Date();
        const inactive = incidents.find(inc => {
            if (inc.status === 'Cerrado') return false;
            const diffHours = (now.getTime() - new Date(inc.date).getTime()) / (1000 * 60 * 60);
            return diffHours > 72;
        });
        return inactive;
    }, [incidents]);

    const handleCreate = async () => {
        if (!title || !location || !description || !dateStr) return;
        setIsSaving(true);
        try {
            const dateObj = new Date(dateStr);
            const details = {
                incidentType,
                bodyPart,
                machinery,
                witnesses
            };

            await createIncident(companyId, { 
                title, 
                location, 
                description, 
                severity,
                date: dateObj,
                details
            });
            setIsCreating(false);
            
            // Reset form
            setTitle('');
            setDateStr('');
            setLocation('');
            setDescription('');
            setSeverity('LOW');
            setIncidentType('');
            setBodyPart('');
            setMachinery('');
            setWitnesses('');
            
            router.refresh();
        } catch (error) {
            alert('Error al crear el incidente');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async () => {
        if (!title || !location || !description || !dateStr || !selectedIncident) return;
        setIsSaving(true);
        try {
            const dateObj = new Date(dateStr);
            const details = { incidentType, bodyPart, machinery, witnesses };

            await updateIncident(selectedIncident.id, companyId, { 
                title, location, description, severity, date: dateObj, details
            });
            setIsEditing(false);
            setSelectedIncident({...selectedIncident, title, location, description, severity, date: dateObj, details});
            router.refresh();
        } catch (error) {
            alert('Error al actualizar el incidente');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedIncident) return;
        if (!confirm('¿Está seguro de eliminar este incidente? Esta acción no se puede deshacer.')) return;
        
        try {
            await deleteIncident(selectedIncident.id, companyId);
            setSelectedIncident(null);
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            alert('Error al eliminar el incidente');
        }
    };

    const startEdit = () => {
        if(!selectedIncident) return;
        setTitle(selectedIncident.title);
        // format date for datetime-local: YYYY-MM-DDThh:mm
        const d = new Date(selectedIncident.date);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(d.getTime() - tzOffset)).toISOString().slice(0, 16);
        setDateStr(localISOTime);
        setLocation(selectedIncident.location);
        setDescription(selectedIncident.description);
        setSeverity(selectedIncident.severity);
        setIncidentType(selectedIncident.details?.incidentType || '');
        setBodyPart(selectedIncident.details?.bodyPart || '');
        setMachinery(selectedIncident.details?.machinery || '');
        setWitnesses(selectedIncident.details?.witnesses || '');
        setIsEditing(true);
        setIsCreating(false);
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await updateIncidentStatus(id, companyId, newStatus);
            if (selectedIncident && selectedIncident.id === id) {
                setSelectedIncident({ ...selectedIncident, status: newStatus });
            }
            router.refresh();
        } catch (error) {
            alert('Error al actualizar el estado');
        }
    };

    const getSeverityBadge = (level: string) => {
        switch (level) {
            case 'LOW': return <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 font-bold text-[10px] rounded-full tracking-widest uppercase">BAJO</span>;
            case 'MEDIUM': return <span className="px-3 py-1 bg-orange-50 text-orange-600 border border-orange-200 font-bold text-[10px] rounded-full tracking-widest uppercase">MEDIO</span>;
            case 'HIGH': return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 font-bold text-[10px] rounded-full tracking-widest uppercase">ALTO</span>;
            case 'CRITICAL': return <span className="px-3 py-1 bg-rose-100 text-rose-700 border border-rose-300 font-black text-[10px] rounded-full tracking-widest uppercase animate-pulse">CRÍTICO</span>;
            default: return null;
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Banner Alerta Crítica */}
            {criticalAlert && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span className="text-amber-800 font-bold text-sm">CRÍTICO: La investigación del incidente "{criticalAlert.title}" (ID: {criticalAlert.id.substring(0, 8)}) ha superado las 72 horas sin actividad.</span>
                    </div>
                    <button className="text-amber-500 hover:text-amber-700">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Registro de Eventos</h2>
                    <p className="text-slate-500 font-medium mt-1">Gestiona y analiza incidentes laborales con IA.</p>
                </div>
                <button 
                    onClick={() => { 
                        setIsCreating(true); 
                        setIsEditing(false);
                        setSelectedIncident(null); 
                        setTitle(''); setDateStr(''); setLocation(''); setDescription(''); setSeverity('LOW'); setIncidentType(''); setBodyPart(''); setMachinery(''); setWitnesses('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold tracking-widest uppercase text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" /> Nuevo Reporte
                </button>
            </div>

            {/* Barra de Búsqueda */}
            <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Buscar por ID, título o ubicación..."
                    className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 h-[750px]">
                {/* Columna Izquierda: Lista de Incidentes */}
                <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-4 h-full">
                    {filteredIncidents.length === 0 ? (
                        <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-8 text-center">
                            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No se encontraron incidentes.</p>
                        </div>
                    ) : (
                        filteredIncidents.map((inc) => (
                            <div 
                                key={inc.id}
                                onClick={() => { setSelectedIncident(inc); setIsCreating(false); setIsEditing(false); }}
                                className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedIncident?.id === inc.id ? 'bg-blue-50 border-blue-200 shadow-md shadow-blue-500/10' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h4 className="font-bold text-slate-800 line-clamp-1 flex-1 pr-2">{inc.title}</h4>
                                    {getSeverityBadge(inc.severity)}
                                </div>
                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> INC-{inc.id.substring(0, 4).toUpperCase()}</span>
                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(inc.date).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1 line-clamp-1"><MapPin className="w-3.5 h-3.5" /> {inc.location}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${inc.status === 'Cerrado' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                        <span className="text-xs font-bold text-slate-600">{inc.status}</span>
                                    </div>
                                    <div className="text-slate-300">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Columna Derecha: Detalles o Formulario */}
                <div className="w-full lg:w-2/3 bg-white border border-slate-200 rounded-[2rem] shadow-sm flex flex-col overflow-hidden h-full">
                    {isCreating || isEditing ? (
                        <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
                            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                                    {isEditing ? <Edit className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
                                    {isEditing ? 'Editar Incidente' : 'Nuevo Reporte de Incidente'}
                                </h3>
                                <button onClick={() => { setIsCreating(false); setIsEditing(false); }} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="space-y-6 flex-1 pb-10">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Título del Incidente *</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                                        placeholder="Ej: Caída a distinto nivel en andamio"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Fecha y Hora Exacta *</label>
                                        <input 
                                            type="datetime-local" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                                            value={dateStr}
                                            onChange={e => setDateStr(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Ubicación / Sector *</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                                            placeholder="Ej: Sector Producción - Línea 2"
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Accidente</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                                            placeholder="Ej: Caída, Corte, Atrapamiento..."
                                            value={incidentType}
                                            onChange={e => setIncidentType(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Nivel de Severidad *</label>
                                        <select 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-bold text-slate-700"
                                            value={severity}
                                            onChange={e => setSeverity(e.target.value as any)}
                                        >
                                            <option value="LOW">BAJO - Primeros Auxilios</option>
                                            <option value="MEDIUM">MEDIO - Tratamiento Médico</option>
                                            <option value="HIGH">ALTO - Días Perdidos</option>
                                            <option value="CRITICAL">CRÍTICO - Fatalidad / Catástrofe</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Parte del Cuerpo Afectada</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                                            placeholder="Ej: Mano derecha, Ojo, Espalda"
                                            value={bodyPart}
                                            onChange={e => setBodyPart(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Maquinaria / Herramienta Involucrada</label>
                                        <input 
                                            type="text" 
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                                            placeholder="Ej: Amoladora, Cinta transportadora"
                                            value={machinery}
                                            onChange={e => setMachinery(e.target.value)}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Testigos</label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium"
                                        placeholder="Nombres de las personas que presenciaron el hecho..."
                                        value={witnesses}
                                        onChange={e => setWitnesses(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Descripción Detallada del Evento *</label>
                                    <textarea 
                                        rows={5}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 outline-none focus:ring-2 focus:ring-blue-500/50 font-medium resize-none custom-scrollbar"
                                        placeholder="Describa cómo, cuándo y por qué ocurrió el evento de manera secuencial..."
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-6 border-t border-slate-100 mt-auto flex justify-end gap-3">
                                {isEditing && (
                                    <button 
                                        onClick={() => setIsEditing(false)}
                                        className="text-slate-500 font-bold px-6 py-4 rounded-2xl hover:bg-slate-50 transition-colors uppercase text-xs tracking-widest"
                                    >
                                        Cancelar
                                    </button>
                                )}
                                <button 
                                    onClick={isEditing ? handleUpdate : handleCreate}
                                    disabled={isSaving || !title || !location || !description || !dateStr}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs flex items-center gap-2 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {isSaving ? 'Guardando...' : (isEditing ? 'Actualizar Incidente' : 'Registrar Incidente')}
                                </button>
                            </div>
                        </div>
                    ) : selectedIncident ? (
                        <div className="p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
                            <div className="flex items-start justify-between mb-8 pb-6 border-b border-slate-100">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-500 font-bold text-xs rounded-full">INC-{selectedIncident.id.substring(0, 8).toUpperCase()}</span>
                                        {getSeverityBadge(selectedIncident.severity)}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">{selectedIncident.title}</h3>
                                </div>
                                <button onClick={() => setSelectedIncident(null)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Fecha y Hora</span>
                                    <span className="font-bold text-slate-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> {new Date(selectedIncident.date).toLocaleString()}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Ubicación</span>
                                    <span className="font-bold text-slate-800 flex items-center gap-2"><MapPin className="w-4 h-4 text-blue-500" /> {selectedIncident.location}</span>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Estado Actual</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={`w-2.5 h-2.5 rounded-full ${selectedIncident.status === 'Cerrado' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                                        <span className="font-bold text-slate-800">{selectedIncident.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Acciones Rápidas</span>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <button 
                                            onClick={() => router.push(`/portal/empresas/${companyId}/investigacion?incidentId=${selectedIncident.id}`)}
                                            className="text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors border border-indigo-200 flex items-center gap-1"
                                        >
                                            <Activity className="w-3.5 h-3.5" /> Investigación
                                        </button>
                                        {selectedIncident.status !== 'Cerrado' ? (
                                            <button onClick={() => handleStatusChange(selectedIncident.id, 'Cerrado')} className="text-xs font-bold bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg transition-colors border border-green-200">
                                                Cerrar Incidente
                                            </button>
                                        ) : (
                                            <button onClick={() => handleStatusChange(selectedIncident.id, 'En Investigación')} className="text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 px-3 py-1.5 rounded-lg transition-colors border border-orange-200">
                                                Reabrir Incidente
                                            </button>
                                        )}
                                        <button onClick={startEdit} className="text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg transition-colors border border-blue-200 flex items-center gap-1">
                                            <Edit className="w-3.5 h-3.5" /> Editar
                                        </button>
                                        <button onClick={handleDelete} className="text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg transition-colors border border-rose-200 flex items-center gap-1">
                                            <Trash2 className="w-3.5 h-3.5" /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Panel de Detalles Técnicos */}
                            {(selectedIncident.details?.incidentType || selectedIncident.details?.bodyPart || selectedIncident.details?.machinery || selectedIncident.details?.witnesses) && (
                                <div className="mb-8 space-y-4">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2"><Activity className="w-5 h-5 text-slate-400" /> Detalles del Evento</h4>
                                    <div className="grid grid-cols-2 gap-4 bg-white border border-slate-200 rounded-2xl p-6">
                                        {selectedIncident.details?.incidentType && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Tipo de Accidente</span>
                                                <span className="font-bold text-slate-700">{selectedIncident.details.incidentType}</span>
                                            </div>
                                        )}
                                        {selectedIncident.details?.bodyPart && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Parte del Cuerpo</span>
                                                <span className="font-bold text-slate-700">{selectedIncident.details.bodyPart}</span>
                                            </div>
                                        )}
                                        {selectedIncident.details?.machinery && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Maquinaria</span>
                                                <span className="font-bold text-slate-700">{selectedIncident.details.machinery}</span>
                                            </div>
                                        )}
                                        {selectedIncident.details?.witnesses && (
                                            <div>
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Testigos</span>
                                                <span className="font-bold text-slate-700">{selectedIncident.details.witnesses}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-400" /> Descripción de los Hechos</h4>
                                <div className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-600 leading-relaxed font-medium">
                                    {selectedIncident.description}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
                            <Eye className="w-16 h-16 text-slate-300 mb-6" />
                            <h3 className="text-xl font-bold text-slate-400 mb-2">Seleccione un incidente</h3>
                            <p className="text-slate-400 font-medium max-w-sm">Haga clic en una de las tarjetas de la izquierda para ver los detalles y el análisis del incidente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
