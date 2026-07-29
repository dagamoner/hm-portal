"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface ArbolCausasData {
  hechoFinal: string;
  condicionesInseguras: string;
  actosInseguros: string;
  factoresPersonales: string;
  factoresTrabajo: string;
  causaRaiz: string;
  medidasInmediatas: string;
  medidasLargoPlazo: string;
}

const DEFAULT_DATA: ArbolCausasData = {
  hechoFinal: '',
  condicionesInseguras: '',
  actosInseguros: '',
  factoresPersonales: '',
  factoresTrabajo: '',
  causaRaiz: '',
  medidasInmediatas: '',
  medidasLargoPlazo: ''
};

export default function ArbolCausasWizard({
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
  const [formData, setFormData] = useState<ArbolCausasData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : { ...DEFAULT_DATA, hechoFinal: incident?.title || '' }
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({ ...DEFAULT_DATA, hechoFinal: incident?.title || '' });
    }
  }, [initialData, incident]);

  const handleChange = (field: keyof ArbolCausasData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">1. Hecho Final / Lesión (Cúspide del Árbol)</h4>
              <p className="text-xs text-slate-500 mb-4">Identificación del daño o evento indeseado.</p>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium resize-none"
                placeholder='Ejemplo: "Traumatismo por caída de altura desde andamio no asegurado"'
                value={formData.hechoFinal}
                onChange={e => handleChange('hechoFinal', e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">2. Causas Inmediatas (Ramas Superiores)</h4>
              <p className="text-xs text-slate-500 mb-4">Eventos o circunstancias directas que desencadenaron el hecho final.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Condiciones Inseguras</label>
                <p className="text-[10px] text-slate-500 mb-2">Estado de equipos, herramientas o del entorno de trabajo.</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                  placeholder='Ej: "Andamio sin trabas de seguridad y plataforma desatada"'
                  value={formData.condicionesInseguras}
                  onChange={e => handleChange('condicionesInseguras', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Actos Inseguros / Desviaciones</label>
                <p className="text-[10px] text-slate-500 mb-2">Acciones u omisiones operativas.</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                  placeholder='Ej: "Trabajador operó sin enganchar el arnés a la línea de vida"'
                  value={formData.actosInseguros}
                  onChange={e => handleChange('actosInseguros', e.target.value)}
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
              <h4 className="text-sm font-bold text-slate-800 mb-1">3. Causas Básicas o Subyacentes (Ramas Intermedias)</h4>
              <p className="text-xs text-slate-500 mb-4">Razones por las que ocurrieron las causas inmediatas (el "por qué" de los actos y condiciones).</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Factores Personales</label>
                <p className="text-[10px] text-slate-500 mb-2">Falta de capacitación, fatiga, problemas fisiológicos o psicológicos, falta de percepción del riesgo.</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                  value={formData.factoresPersonales}
                  onChange={e => handleChange('factoresPersonales', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Factores del Trabajo / Entorno</label>
                <p className="text-[10px] text-slate-500 mb-2">Falta de mantenimiento preventivo, diseño inadecuado, desgaste normal, presión por tiempos de entrega.</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
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
              <h4 className="text-sm font-bold text-slate-800 mb-1">4. Causa Raíz Principal (Raíz del Sistema de Gestión)</h4>
              <p className="text-xs text-slate-500 mb-4">Falla fundamental en la organización, supervisión o en el Sistema de Gestión de Higiene y Seguridad que originó todas las demás causas.</p>
              <textarea
                rows={5}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium resize-none"
                placeholder='Ej: "Ausencia de procedimiento estandarizado para habilitación de andamios y falta de auditoría del uso de EPP en trabajos en altura"'
                value={formData.causaRaiz}
                onChange={e => handleChange('causaRaiz', e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">5. Plan de Acción Correctivo y Preventivo (CAPA)</h4>
              <p className="text-xs text-slate-500 mb-4">Desarrolle las acciones necesarias con priorización y responsables para evitar la repetición del evento.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Medidas Correctivas Inmediatas</label>
                <p className="text-[10px] text-slate-500 mb-2">Eliminación del peligro inminente o paralización de la condición insegura.</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                  value={formData.medidasInmediatas}
                  onChange={e => handleChange('medidasInmediatas', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Medidas Preventivas a Largo Plazo</label>
                <p className="text-[10px] text-slate-500 mb-2">Modificación de procedimientos, programas de capacitación, reemplazo de equipos o rediseño del puesto.</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 text-sm resize-none"
                  value={formData.medidasLargoPlazo}
                  onChange={e => handleChange('medidasLargoPlazo', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
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
          <span className={step === 1 ? 'text-blue-600' : ''}>1. Hecho</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-blue-600' : ''}>2. Causas Inm.</span>
          <span className="text-slate-300">/</span>
          <span className={step === 3 ? 'text-blue-600' : ''}>3. Causas Básicas</span>
          <span className="text-slate-300">/</span>
          <span className={step === 4 ? 'text-blue-600' : ''}>4. Causa Raíz</span>
          <span className="text-slate-300">/</span>
          <span className={step === 5 ? 'text-blue-600' : ''}>5. Plan</span>
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
                  cause: formData.causaRaiz, 
                  actionPlan: `${formData.medidasInmediatas}\n\n${formData.medidasLargoPlazo}`, 
                  methodology: 'arbol' 
                }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 5 ? (
                <button
                  onClick={nextStep}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                      onSave({ 
                        ...formData, 
                        cause: formData.causaRaiz, 
                        actionPlan: `${formData.medidasInmediatas}\n\n${formData.medidasLargoPlazo}`, 
                        methodology: 'arbol' 
                      }, true);
                    }
                  }}
                  disabled={isSaving || !formData.hechoFinal || !formData.causaRaiz || (!formData.medidasInmediatas && !formData.medidasLargoPlazo)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
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
