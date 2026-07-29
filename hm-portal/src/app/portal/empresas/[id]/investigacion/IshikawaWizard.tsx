"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

interface IshikawaData {
  efecto: string;
  manoDeObra: string;
  maquinaria: string;
  metodos: string;
  materiales: string;
  medioAmbiente: string;
  medicion: string;
  cincoPorques: string;
  planAccion: string;
}

const DEFAULT_DATA: IshikawaData = {
  efecto: '',
  manoDeObra: '',
  maquinaria: '',
  metodos: '',
  materiales: '',
  medioAmbiente: '',
  medicion: '',
  cincoPorques: '',
  planAccion: ''
};

export default function IshikawaWizard({
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
  const [formData, setFormData] = useState<IshikawaData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : { ...DEFAULT_DATA, efecto: incident?.title || '' }
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    } else {
      setFormData({ ...DEFAULT_DATA, efecto: incident?.title || '' });
    }
  }, [initialData, incident]);

  const handleChange = (field: keyof IshikawaData, value: string) => {
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
              <h4 className="text-sm font-bold text-slate-800 mb-1">1. Definición del Efecto o Problema (Cabeza del Pescado)</h4>
              <p className="text-xs text-slate-500 mb-4">Defina de manera concisa y objetiva el accidente o incidente laboral sin juzgar culpabilidades preliminares.</p>
              <textarea
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm font-medium resize-none"
                placeholder="Ejemplo: Caída de operario desde plataforma a 3 metros de altura..."
                value={formData.efecto}
                onChange={e => handleChange('efecto', e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">2. Clasificación de Causas en las 6M (Espinas Principales)</h4>
              <p className="text-xs text-slate-500 mb-4">Desglose el evento respondiendo a las preguntas en cada dimensión.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mano de Obra */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Mano de Obra (Personal)</label>
                <p className="text-[10px] text-slate-500 mb-2">¿Estaba capacitado? ¿Había fatiga o estrés? ¿Se cumplieron las normas y el uso de EPP?</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                  value={formData.manoDeObra}
                  onChange={e => handleChange('manoDeObra', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              {/* Maquinaria */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Maquinaria y Equipos</label>
                <p className="text-[10px] text-slate-500 mb-2">¿En qué estado estaba el equipo? ¿Hubo fallas mecánicas o falta de mantenimiento preventivo?</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                  value={formData.maquinaria}
                  onChange={e => handleChange('maquinaria', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              {/* Métodos */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Métodos de Trabajo</label>
                <p className="text-[10px] text-slate-500 mb-2">¿Existía procedimiento seguro (PTS/ATS)? ¿Hubo fallas en la supervisión o permisos?</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                  value={formData.metodos}
                  onChange={e => handleChange('metodos', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              {/* Materiales */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Materiales e Insumos</label>
                <p className="text-[10px] text-slate-500 mb-2">¿Hubo insumos deteriorados o defectuosos? ¿Componentes no homologados?</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                  value={formData.materiales}
                  onChange={e => handleChange('materiales', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              {/* Medio Ambiente */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Medio Ambiente (Entorno Laboral)</label>
                <p className="text-[10px] text-slate-500 mb-2">¿Cómo era la iluminación, ruido, ventilación? ¿Había desorden o condiciones adversas?</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                  value={formData.medioAmbiente}
                  onChange={e => handleChange('medioAmbiente', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              {/* Medición */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Medición y Control</label>
                <p className="text-[10px] text-slate-500 mb-2">¿Faltaban inspecciones previas? ¿Instrumentos sin calibrar o falta de monitoreo?</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                  value={formData.medicion}
                  onChange={e => handleChange('medicion', e.target.value)}
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
              <h4 className="text-sm font-bold text-slate-800 mb-1">3. Profundización y Técnica de los 5 Porqués</h4>
              <p className="text-xs text-slate-500 mb-4">Con la información de las 6M recopilada, desglose las causas para llegar a la causa raíz.</p>
              <textarea
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm font-medium resize-none"
                placeholder="Ejemplo: ¿Por qué cayó el trabajador? -> Porque no usaba arnés. ¿Por qué no lo usaba? -> ..."
                value={formData.cincoPorques}
                onChange={e => handleChange('cincoPorques', e.target.value)}
                disabled={isCompleted}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">4. Plan de Acción Correctivo y Preventivo (CAPA)</h4>
              <p className="text-xs text-slate-500 mb-4">Describa las medidas de ingeniería, administrativas y de mitigación a aplicar.</p>
              <textarea
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm font-medium resize-none"
                placeholder="Medidas de ingeniería: ...&#10;Medidas administrativas: ...&#10;Trazabilidad y controles: ..."
                value={formData.planAccion}
                onChange={e => handleChange('planAccion', e.target.value)}
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
          <span className={step === 1 ? 'text-purple-600' : ''}>1. Efecto</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-purple-600' : ''}>2. 6M</span>
          <span className="text-slate-300">/</span>
          <span className={step === 3 ? 'text-purple-600' : ''}>3. 5 Porqués</span>
          <span className="text-slate-300">/</span>
          <span className={step === 4 ? 'text-purple-600' : ''}>4. Plan de Acción</span>
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
                onClick={() => onSave({ ...formData, cause: formData.cincoPorques, actionPlan: formData.planAccion, methodology: 'ishikawa' }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                      onSave({ ...formData, cause: formData.cincoPorques, actionPlan: formData.planAccion, methodology: 'ishikawa' }, true);
                    }
                  }}
                  disabled={isSaving || !formData.efecto || !formData.cincoPorques || !formData.planAccion}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all disabled:opacity-50"
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
