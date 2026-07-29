"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface HeinrichData {
  ficha1Entorno: string;
  ficha2Defecto: string;
  ficha3ActoCondicion: string;
  ficha4Accidente: string;
  ficha5Lesion: string;
  puntoInterrupcion: string;
  analisisPiramide: string;
  medidasCorrectivas: string;
}

const DEFAULT_DATA: HeinrichData = {
  ficha1Entorno: '',
  ficha2Defecto: '',
  ficha3ActoCondicion: '',
  ficha4Accidente: '',
  ficha5Lesion: '',
  puntoInterrupcion: '',
  analisisPiramide: '',
  medidasCorrectivas: ''
};

export default function HeinrichWizard({
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
  const [formData, setFormData] = useState<HeinrichData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : { ...DEFAULT_DATA, ficha4Accidente: incident?.title || '' }
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({ ...DEFAULT_DATA, ficha4Accidente: incident?.title || '' });
    }
  }, [initialData, incident]);

  const handleChange = (field: keyof HeinrichData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">1. La Cadena Causal de 5 Fichas de Dominó</h4>
              <p className="text-xs text-slate-500 mb-4">Desglose explícito de los factores interrelacionados que desencadenaron el evento.</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">1</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ancestros y Entorno Social</label>
                  <p className="text-[10px] text-slate-500 mb-2">Hábitos, antecedentes, falta de entrenamiento o ambiente socio-laboral.</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm resize-none"
                    value={formData.ficha1Entorno}
                    onChange={e => handleChange('ficha1Entorno', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">2</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Falta Personal / Defecto de la Persona</label>
                  <p className="text-[10px] text-slate-500 mb-2">Rasgos o actitudes (desconocimiento, fatiga, temeridad, distracciones).</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm resize-none"
                    value={formData.ficha2Defecto}
                    onChange={e => handleChange('ficha2Defecto', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-rose-200 shadow-sm shadow-rose-100 flex gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                <div className="font-black text-rose-300 text-2xl">3</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-rose-800 mb-1">Acto Inseguro o Condición Insegura</label>
                  <p className="text-[10px] text-rose-600/70 mb-2">La causa inmediata directa (p. ej. operar sin EPP, falta de guarda de protección).</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm resize-none"
                    value={formData.ficha3ActoCondicion}
                    onChange={e => handleChange('ficha3ActoCondicion', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">4</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Accidente</label>
                  <p className="text-[10px] text-slate-500 mb-2">El evento físico imprevisto o contacto (caída, atrapamiento, proyección).</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm resize-none"
                    value={formData.ficha4Accidente}
                    onChange={e => handleChange('ficha4Accidente', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-4">
                <div className="font-black text-slate-300 text-2xl">5</div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lesión</label>
                  <p className="text-[10px] text-slate-500 mb-2">La consecuencia sobre la persona o la propiedad (fractura, corte, quemadura).</p>
                  <textarea
                    rows={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm resize-none"
                    value={formData.ficha5Lesion}
                    onChange={e => handleChange('ficha5Lesion', e.target.value)}
                    disabled={isCompleted}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">2. Análisis de Interrupción y Pirámide</h4>
              <p className="text-xs text-slate-500 mb-4">Evaluación de los puntos clave de interrupción y análisis estadístico.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Punto de Interrupción Sugerido</label>
                <p className="text-[10px] text-slate-500 mb-2">Identificación precisa de qué ficha específica debió o puede removerse para evitar la repetición (generalmente la Ficha 3).</p>
                <textarea
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm resize-none"
                  value={formData.puntoInterrupcion}
                  onChange={e => handleChange('puntoInterrupcion', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Análisis Estadístico bajo Pirámide (1:29:300)</label>
                <p className="text-[10px] text-slate-500 mb-2">Evaluación de si el evento representa la punta de un iceberg (indicador de múltiples near misses no reportados).</p>
                <textarea
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm resize-none"
                  value={formData.analisisPiramide}
                  onChange={e => handleChange('analisisPiramide', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">3. Planes de Acción Correctivos y Preventivos (CAPA)</h4>
              <p className="text-xs text-slate-500 mb-4">Medidas generadas con base en la ficha interruptora identificada para eliminar el acto/condición insegura.</p>
              <textarea
                rows={8}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500/50 text-sm font-medium resize-none"
                placeholder="Ejemplo: Instalar guardas fijas de policarbonato en la máquina y sancionar el retiro de protecciones..."
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
          <span className={step === 1 ? 'text-rose-600' : ''}>1. Fichas de Dominó</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-rose-600' : ''}>2. Interrupción y Análisis</span>
          <span className="text-slate-300">/</span>
          <span className={step === 3 ? 'text-rose-600' : ''}>3. CAPA</span>
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
                  cause: formData.ficha3ActoCondicion, 
                  actionPlan: formData.medidasCorrectivas, 
                  methodology: 'heinrich' 
                }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                      onSave({ 
                        ...formData, 
                        cause: formData.ficha3ActoCondicion, 
                        actionPlan: formData.medidasCorrectivas, 
                        methodology: 'heinrich' 
                      }, true);
                    }
                  }}
                  disabled={isSaving || !formData.ficha3ActoCondicion || !formData.medidasCorrectivas}
                  className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all disabled:opacity-50"
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
