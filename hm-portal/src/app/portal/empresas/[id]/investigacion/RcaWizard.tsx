"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface RcaData {
  hechoInicial: string;
  porque1: string;
  porque2: string;
  porque3: string;
  porque4: string;
  porque5: string;
  causasInmediatas: string;
  causasSubyacentes: string;
  causasRaiz: string;
  accionesInmediatas: string;
  accionesPreventivas: string;
}

const DEFAULT_DATA: RcaData = {
  hechoInicial: '',
  porque1: '',
  porque2: '',
  porque3: '',
  porque4: '',
  porque5: '',
  causasInmediatas: '',
  causasSubyacentes: '',
  causasRaiz: '',
  accionesInmediatas: '',
  accionesPreventivas: ''
};

export default function RcaWizard({
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
  const [formData, setFormData] = useState<RcaData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : { ...DEFAULT_DATA, hechoInicial: incident?.title || '' }
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({ ...DEFAULT_DATA, hechoInicial: incident?.title || '' });
    }
  }, [initialData, incident]);

  const handleChange = (field: keyof RcaData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">1. Definición del Hecho Inicial (Efecto)</h4>
              <p className="text-xs text-slate-500 mb-4">Punto de partida y hecho no deseado final.</p>
              <textarea
                rows={4}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm font-medium resize-none"
                placeholder='Ejemplo: "El operario sufrió una fractura por caída de altura desde una escalera provisional"'
                value={formData.hechoInicial}
                onChange={e => handleChange('hechoInicial', e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">2. Cadena Lógica Iterativa de los 5 Porqués</h4>
              <p className="text-xs text-slate-500 mb-4">Indagación iterativa para explorar la relación causa-efecto.</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">1</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Causa Inmediata / Directa</label>
                  <p className="text-[10px] text-slate-500 mb-2">¿Por qué ocurrió el hecho inicial?</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                    value={formData.porque1}
                    onChange={e => handleChange('porque1', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">2</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Condición / Acto Subestándar</label>
                  <p className="text-[10px] text-slate-500 mb-2">¿Por qué ocurrió el evento del Por qué #1?</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                    value={formData.porque2}
                    onChange={e => handleChange('porque2', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">3</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Falla en Procedimiento / Equipo</label>
                  <p className="text-[10px] text-slate-500 mb-2">¿Por qué ocurrió el evento del Por qué #2?</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                    value={formData.porque3}
                    onChange={e => handleChange('porque3', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">4</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deficiencia Operativa / Mantenimiento / Compra</label>
                  <p className="text-[10px] text-slate-500 mb-2">¿Por qué ocurrió el evento del Por qué #3?</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                    value={formData.porque4}
                    onChange={e => handleChange('porque4', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">5</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Causa Raíz Sistémica / Gestión</label>
                  <p className="text-[10px] text-slate-500 mb-2">¿Por qué ocurrió el evento del Por qué #4?</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                    value={formData.porque5}
                    onChange={e => handleChange('porque5', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">3. Categorización Causal</h4>
              <p className="text-xs text-slate-500 mb-4">Clasifique los hallazgos en los tres niveles jerárquicos.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Causas Inmediatas</label>
                <p className="text-[10px] text-slate-500 mb-2">Actos y condiciones inseguras observadas directamente en el lugar.</p>
                <textarea
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                  value={formData.causasInmediatas}
                  onChange={e => handleChange('causasInmediatas', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Causas Subyacentes / Básicas</label>
                <p className="text-[10px] text-slate-500 mb-2">Factores personales y del trabajo (falta de supervisión, desgaste).</p>
                <textarea
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                  value={formData.causasSubyacentes}
                  onChange={e => handleChange('causasSubyacentes', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Causas Raíz</label>
                <p className="text-[10px] text-slate-500 mb-2">Fallas en el Sistema de Gestión de SST.</p>
                <textarea
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                  value={formData.causasRaiz}
                  onChange={e => handleChange('causasRaiz', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">4. Formulación del Plan de Acción (CAPA)</h4>
              <p className="text-xs text-slate-500 mb-4">Registro de acciones con prioridad y responsables.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Acciones Correctivas Inmediatas</label>
                <p className="text-[10px] text-slate-500 mb-2">Mitigación del riesgo presente (retirar equipos, aislar área).</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                  value={formData.accionesInmediatas}
                  onChange={e => handleChange('accionesInmediatas', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Acciones Preventivas Permanentes</label>
                <p className="text-[10px] text-slate-500 mb-2">Modificación de procedimientos, capacitaciones, revisión de matriz IPERC.</p>
                <textarea
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm resize-none"
                  value={formData.accionesPreventivas}
                  onChange={e => handleChange('accionesPreventivas', e.target.value)}
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
          <span className={step === 1 ? 'text-emerald-600' : ''}>1. Hecho</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-emerald-600' : ''}>2. 5 Porqués</span>
          <span className="text-slate-300">/</span>
          <span className={step === 3 ? 'text-emerald-600' : ''}>3. Categorización</span>
          <span className="text-slate-300">/</span>
          <span className={step === 4 ? 'text-emerald-600' : ''}>4. CAPA</span>
        </div>
        <div className="text-xs text-slate-400 font-medium">Paso {step} de 4</div>
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
                  cause: formData.causasRaiz, 
                  actionPlan: `${formData.accionesInmediatas}\n\n${formData.accionesPreventivas}`, 
                  methodology: 'rca' 
                }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                      onSave({ 
                        ...formData, 
                        cause: formData.causasRaiz, 
                        actionPlan: `${formData.accionesInmediatas}\n\n${formData.accionesPreventivas}`, 
                        methodology: 'rca' 
                      }, true);
                    }
                  }}
                  disabled={isSaving || !formData.hechoInicial || !formData.porque1 || !formData.causasRaiz}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
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
