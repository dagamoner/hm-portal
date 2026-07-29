"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface ScatData {
  perdida: string;
  contacto: string;
  actosSubestandar: string;
  condicionesSubestandar: string;
  factoresPersonales: string;
  factoresTrabajo: string;
  faltaControl: string;
  medidasCorrectivas: string;
}

const DEFAULT_DATA: ScatData = {
  perdida: '',
  contacto: '',
  actosSubestandar: '',
  condicionesSubestandar: '',
  factoresPersonales: '',
  factoresTrabajo: '',
  faltaControl: '',
  medidasCorrectivas: ''
};

export default function ScatWizard({
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
  const [formData, setFormData] = useState<ScatData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : { ...DEFAULT_DATA, perdida: incident?.title || '' }
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({ ...DEFAULT_DATA, perdida: incident?.title || '' });
    }
  }, [initialData, incident]);

  const handleChange = (field: keyof ScatData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">1. Pérdida y Contacto (El Evento)</h4>
              <p className="text-xs text-slate-500 mb-4">Reconstrucción inversa desde la pérdida hasta el contacto con la energía.</p>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Pérdida (Loss)</label>
                <p className="text-[10px] text-slate-500 mb-2">Resultado no deseado (ej. incapacidad del trabajador, daño a la maquinaria, derrame).</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
                  value={formData.perdida}
                  onChange={e => handleChange('perdida', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Incidente / Evento (Contact)</label>
                <p className="text-[10px] text-slate-500 mb-2">Momento preciso del contacto con una fuente de energía (térmica, eléctrica, mecánica, cinética, química).</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
                  value={formData.contacto}
                  onChange={e => handleChange('contacto', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">2. Causas Inmediatas (Síntomas)</h4>
              <p className="text-xs text-slate-500 mb-4">Comportamientos o deficiencias directas antes del evento.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Actos Subestándar</label>
                <p className="text-[10px] text-slate-500 mb-2">Comportamientos que se desvían de los procedimientos seguros (ej. operar a velocidad inadecuada, no usar EPP).</p>
                <textarea
                  rows={5}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
                  value={formData.actosSubestandar}
                  onChange={e => handleChange('actosSubestandar', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Condiciones Subestándar</label>
                <p className="text-[10px] text-slate-500 mb-2">Deficiencias físicas o ambientales en el entorno de trabajo (ej. ventilación deficiente, piso resbaladizo).</p>
                <textarea
                  rows={5}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
                  value={formData.condicionesSubestandar}
                  onChange={e => handleChange('condicionesSubestandar', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">3. Causas Básicas / Raíz</h4>
              <p className="text-xs text-slate-500 mb-4">Las razones fundamentales por las que ocurrieron los actos o existían las condiciones.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Factores Personales</label>
                <p className="text-[10px] text-slate-500 mb-2">Falta de capacitación, fatiga, estrés, falta de motivación o habilidad.</p>
                <textarea
                  rows={5}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
                  value={formData.factoresPersonales}
                  onChange={e => handleChange('factoresPersonales', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Factores del Trabajo</label>
                <p className="text-[10px] text-slate-500 mb-2">Diseño inadecuado, compras sin especificación técnica, mantenimiento diferido, falta de supervisión.</p>
                <textarea
                  rows={5}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm resize-none"
                  value={formData.factoresTrabajo}
                  onChange={e => handleChange('factoresTrabajo', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">4. Falta de Control del Sistema (Lack of Control)</h4>
              <p className="text-xs text-slate-500 mb-4">Origen administrativo o de liderazgo que permitió las causas básicas (Programas inadecuados, estándares deficientes o incumplimiento).</p>
              <textarea
                rows={7}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-medium resize-none"
                placeholder="Ejemplo: Ausencia de programa de Bloqueo y Etiquetado (LOTO)..."
                value={formData.faltaControl}
                onChange={e => handleChange('faltaControl', e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">5. Plan de Medidas Correctivas Directas</h4>
              <p className="text-xs text-slate-500 mb-4">Generación de recomendaciones enfáticas en función de la Falta de Control (actualizaciones de estándares, protocolos, mantenimiento, etc.).</p>
              <textarea
                rows={7}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-medium resize-none"
                placeholder="Ejemplo: Actualización del estándar de ingeniería de andamios..."
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
      {/* Progreso del Wizard */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className={step === 1 ? 'text-amber-600' : ''}>1. Pérdida/Contacto</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-amber-600' : ''}>2. Causas Inmediatas</span>
          <span className="text-slate-300">/</span>
          <span className={step === 3 ? 'text-amber-600' : ''}>3. Causas Básicas</span>
          <span className="text-slate-300">/</span>
          <span className={step === 4 ? 'text-amber-600' : ''}>4. Falta Control</span>
          <span className="text-slate-300">/</span>
          <span className={step === 5 ? 'text-amber-600' : ''}>5. Plan Acción</span>
        </div>
        <div className="text-xs text-slate-400 font-medium">Paso {step} de 5</div>
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
                  cause: formData.faltaControl, 
                  actionPlan: formData.medidasCorrectivas, 
                  methodology: 'scat' 
                }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                      onSave({ 
                        ...formData, 
                        cause: formData.faltaControl, 
                        actionPlan: formData.medidasCorrectivas, 
                        methodology: 'scat' 
                      }, true);
                    }
                  }}
                  disabled={isSaving || !formData.perdida || !formData.faltaControl || !formData.medidasCorrectivas}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/20 transition-all disabled:opacity-50"
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
