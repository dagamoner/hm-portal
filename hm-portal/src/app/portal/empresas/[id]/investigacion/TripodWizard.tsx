"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft, Plus, Trash2 } from 'lucide-react';

interface BarrierAnalysis {
  id: string;
  nombre: string;
  estado: string;
  causaInmediata: string;
  precondicion: string;
  causaLatente: string;
  gft: string;
}

interface TripodData {
  peligro: string;
  objeto: string;
  evento: string;
  barreras: BarrierAnalysis[];
  medidasCorrectivas: string;
}

const DEFAULT_DATA: TripodData = {
  peligro: '',
  objeto: '',
  evento: '',
  barreras: [],
  medidasCorrectivas: ''
};

const GFT_OPTIONS = [
  "Diseño (Design)",
  "Equipos/Hardware",
  "Mantenimiento",
  "Procedimientos",
  "Incentivos de Error",
  "Orden y Limpieza (Housekeeping)",
  "Metas Incompatibles",
  "Comunicación",
  "Organización",
  "Capacitación (Training)",
  "Sistemas de Defensa"
];

const ESTADOS_BARRERA = [
  "Funcionó",
  "Falló",
  "Inadecuada",
  "Ausente"
];

export default function TripodWizard({
  incident,
  initialData,
  isCompleted,
  isSaving,
  onSave
}: {
  incident: any;
  initialData?: any;
  isCompleted: boolean;
  isSaving: boolean;
  onSave: (data: any, complete: boolean) => void;
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TripodData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : { ...DEFAULT_DATA, evento: incident?.title || '' }
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({ ...DEFAULT_DATA, evento: incident?.title || '' });
    }
  }, [initialData, incident]);

  const handleChange = (field: keyof TripodData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddBarrier = () => {
    setFormData(prev => ({
      ...prev,
      barreras: [
        ...prev.barreras,
        {
          id: Math.random().toString(36).substr(2, 9),
          nombre: '',
          estado: '',
          causaInmediata: '',
          precondicion: '',
          causaLatente: '',
          gft: ''
        }
      ]
    }));
  };

  const handleRemoveBarrier = (id: string) => {
    setFormData(prev => ({
      ...prev,
      barreras: prev.barreras.filter(b => b.id !== id)
    }));
  };

  const handleBarrierChange = (id: string, field: keyof BarrierAnalysis, value: string) => {
    setFormData(prev => ({
      ...prev,
      barreras: prev.barreras.map(b => b.id === id ? { ...b, [field]: value } : b)
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">1. El Trío del Evento</h4>
              <p className="text-xs text-slate-500 mb-4">Interacción no deseada entre la fuente de energía y el objeto o persona afectada.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Peligro (Hazard)</label>
                <p className="text-[10px] text-slate-500 mb-2">La fuente de energía imprevista (ej. energía eléctrica, alta presión, químico).</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                  value={formData.peligro}
                  onChange={e => handleChange('peligro', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Objeto (Target)</label>
                <p className="text-[10px] text-slate-500 mb-2">El elemento, persona o sistema expuesto a la energía que sufre el daño.</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                  value={formData.objeto}
                  onChange={e => handleChange('objeto', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Evento (Event)</label>
                <p className="text-[10px] text-slate-500 mb-2">La interacción no deseada entre el peligro y el objeto (ej. descarga eléctrica).</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                  value={formData.evento}
                  onChange={e => handleChange('evento', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">2. Análisis de Barreras y Ruta Causal</h4>
                <p className="text-xs text-slate-500">Examine los controles y reconstruya la línea de tiempo para las barreras fallidas o ausentes.</p>
              </div>
              {!isCompleted && (
                <button
                  onClick={handleAddBarrier}
                  className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Agregar Barrera
                </button>
              )}
            </div>

            {formData.barreras.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-500 text-sm">No hay barreras registradas.</p>
                {!isCompleted && (
                  <button onClick={handleAddBarrier} className="mt-3 text-indigo-600 text-sm font-bold hover:underline">
                    Agregar la primera barrera
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {formData.barreras.map((barrera, index) => (
                  <div key={barrera.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative">
                    {!isCompleted && (
                      <button 
                        onClick={() => handleRemoveBarrier(barrera.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <h5 className="font-bold text-sm text-slate-700 mb-3">Barrera #{index + 1}</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Nombre / Descripción de la Barrera</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                          placeholder="Ej. Uso de candado LOTO, Guarda de seguridad..."
                          value={barrera.nombre}
                          onChange={e => handleBarrierChange(barrera.id, 'nombre', e.target.value)}
                          disabled={isCompleted}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Estado de la Barrera</label>
                        <select
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                          value={barrera.estado}
                          onChange={e => handleBarrierChange(barrera.id, 'estado', e.target.value)}
                          disabled={isCompleted}
                        >
                          <option value="">Seleccionar estado...</option>
                          {ESTADOS_BARRERA.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                    </div>

                    {(barrera.estado === 'Falló' || barrera.estado === 'Ausente' || barrera.estado === 'Inadecuada') && (
                      <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 space-y-4 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-indigo-900 mb-1">Causa Inmediata</label>
                            <p className="text-[10px] text-indigo-700/70 mb-2">El acto inseguro o condición física directa que afectó la barrera.</p>
                            <textarea
                              rows={2}
                              className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                              value={barrera.causaInmediata}
                              onChange={e => handleBarrierChange(barrera.id, 'causaInmediata', e.target.value)}
                              disabled={isCompleted}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-indigo-900 mb-1">Precondición</label>
                            <p className="text-[10px] text-indigo-700/70 mb-2">Estado ambiental, mental o físico del trabajador o del entorno.</p>
                            <textarea
                              rows={2}
                              className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                              value={barrera.precondicion}
                              onChange={e => handleBarrierChange(barrera.id, 'precondicion', e.target.value)}
                              disabled={isCompleted}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-indigo-900 mb-1">Causa Latente Organizacional</label>
                            <p className="text-[10px] text-indigo-700/70 mb-2">La deficiencia en los sistemas de gestión o políticas de la empresa.</p>
                            <textarea
                              rows={2}
                              className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm resize-none"
                              value={barrera.causaLatente}
                              onChange={e => handleBarrierChange(barrera.id, 'causaLatente', e.target.value)}
                              disabled={isCompleted}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-indigo-900 mb-1">Categoría GFT (General Failure Type)</label>
                            <p className="text-[10px] text-indigo-700/70 mb-2">Clasificación del fallo organizacional.</p>
                            <select
                              className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm h-[58px]"
                              value={barrera.gft}
                              onChange={e => handleBarrierChange(barrera.id, 'gft', e.target.value)}
                              disabled={isCompleted}
                            >
                              <option value="">Seleccionar categoría GFT...</option>
                              {GFT_OPTIONS.map(gft => <option key={gft} value={gft}>{gft}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">3. Definición de Medidas Correctivas</h4>
              <p className="text-xs text-slate-500 mb-4">Acciones orientadas a reparar las causas organizacionales latentes (GFTs) y reforzar/rediseñar las barreras dañadas.</p>
              <textarea
                rows={8}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium resize-none"
                placeholder="Ejemplo: Rediseñar el sistema de bloqueo LOTO e incluirlo en la capacitación obligatoria anual..."
                value={formData.medidasCorrectivas}
                onChange={e => handleChange('medidasCorrectivas', e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className={step === 1 ? 'text-indigo-600' : ''}>1. Trío del Evento</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-indigo-600' : ''}>2. Barreras</span>
          <span className="text-slate-300">/</span>
          <span className={step === 3 ? 'text-indigo-600' : ''}>3. Medidas Correctivas</span>
        </div>
        <div className="text-xs text-slate-400 font-medium">Paso {step} de 3</div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        {renderStepContent()}
      </div>

      <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={step === 1}
          className="px-4 py-2 text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-200/50 rounded-lg transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Anterior
        </button>

        <div className="flex items-center gap-3">
          {isCompleted ? (
            <div className="bg-green-50 text-green-700 px-6 py-2 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Completada
            </div>
          ) : (
            <>
              <button
                onClick={() => onSave({ 
                  ...formData, 
                  cause: 'Fallo en barreras de seguridad (Ver análisis detallado)', 
                  actionPlan: formData.medidasCorrectivas, 
                  methodology: 'tripod' 
                }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                      onSave({ 
                        ...formData, 
                        cause: 'Fallo en barreras de seguridad (Ver análisis detallado)', 
                        actionPlan: formData.medidasCorrectivas, 
                        methodology: 'tripod' 
                      }, true);
                    }
                  }}
                  disabled={isSaving || !formData.peligro || !formData.medidasCorrectivas}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" /> Completar
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
