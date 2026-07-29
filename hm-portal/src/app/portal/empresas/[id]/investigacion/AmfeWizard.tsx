"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft, Plus, Trash2, Calculator } from 'lucide-react';

interface FailureMode {
  id: string;
  componente: string;
  modoFalla: string;
  efecto: string;
  causaRaiz: string;
  severidad: number;
  ocurrencia: number;
  deteccion: number;
  npr: number;
  medidasCorrectivas: string;
}

interface AmfeData {
  modosFalla: FailureMode[];
}

const DEFAULT_DATA: AmfeData = {
  modosFalla: []
};

export default function AmfeWizard({
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
  const [formData, setFormData] = useState<AmfeData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : DEFAULT_DATA
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleAddFalla = () => {
    setFormData(prev => ({
      ...prev,
      modosFalla: [
        ...prev.modosFalla,
        {
          id: Math.random().toString(36).substr(2, 9),
          componente: '',
          modoFalla: '',
          efecto: '',
          causaRaiz: '',
          severidad: 1,
          ocurrencia: 1,
          deteccion: 1,
          npr: 1,
          medidasCorrectivas: ''
        }
      ]
    }));
  };

  const handleRemoveFalla = (id: string) => {
    setFormData(prev => ({
      ...prev,
      modosFalla: prev.modosFalla.filter(f => f.id !== id)
    }));
  };

  const handleFallaChange = (id: string, field: keyof FailureMode, value: any) => {
    setFormData(prev => ({
      ...prev,
      modosFalla: prev.modosFalla.map(f => {
        if (f.id === id) {
          const updatedFalla = { ...f, [field]: value };
          // Recalculate NPR if S, O, or D change
          if (field === 'severidad' || field === 'ocurrencia' || field === 'deteccion') {
            updatedFalla.npr = updatedFalla.severidad * updatedFalla.ocurrencia * updatedFalla.deteccion;
          }
          return updatedFalla;
        }
        return f;
      })
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 2));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const getNprColor = (npr: number) => {
    if (npr >= 500) return 'text-red-600 bg-red-100';
    if (npr >= 250) return 'text-orange-600 bg-orange-100';
    if (npr >= 100) return 'text-amber-600 bg-amber-100';
    return 'text-emerald-600 bg-emerald-100';
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">1. Identificación de Modos de Falla</h4>
                <p className="text-xs text-slate-500">Descomponga el sistema e identifique qué falló, sus efectos y su causa raíz.</p>
              </div>
              {!isCompleted && (
                <button
                  onClick={handleAddFalla}
                  className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Agregar Falla
                </button>
              )}
            </div>

            {formData.modosFalla.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-500 text-sm">No hay modos de falla registrados.</p>
                {!isCompleted && (
                  <button onClick={handleAddFalla} className="mt-3 text-purple-600 text-sm font-bold hover:underline">
                    Comenzar análisis AMFE
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {formData.modosFalla.map((falla, index) => (
                  <div key={falla.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative">
                    {!isCompleted && (
                      <button 
                        onClick={() => handleRemoveFalla(falla.id)}
                        className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    
                    <h5 className="font-bold text-sm text-slate-700 mb-3 text-purple-700">Falla #{index + 1}</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Componente / Tarea (Proceso)</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                          placeholder="Ej. Sistema hidráulico, Bloqueo LOTO..."
                          value={falla.componente}
                          onChange={e => handleFallaChange(falla.id, 'componente', e.target.value)}
                          disabled={isCompleted}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Modo de Falla Específico</label>
                        <input
                          type="text"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
                          placeholder="Ej. Ruptura de manguera a presión..."
                          value={falla.modoFalla}
                          onChange={e => handleFallaChange(falla.id, 'modoFalla', e.target.value)}
                          disabled={isCompleted}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Análisis de los Efectos</label>
                        <textarea
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                          placeholder="Consecuencias sobre el trabajador o equipo..."
                          value={falla.efecto}
                          onChange={e => handleFallaChange(falla.id, 'efecto', e.target.value)}
                          disabled={isCompleted}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Causa Raíz / Mecanismo de Falla</label>
                        <textarea
                          rows={2}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                          placeholder="Razón técnica, organizativa o humana..."
                          value={falla.causaRaiz}
                          onChange={e => handleFallaChange(falla.id, 'causaRaiz', e.target.value)}
                          disabled={isCompleted}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">2. Cuantificación y Control (NPR)</h4>
              <p className="text-xs text-slate-500 mb-4">Evalúe el Número de Prioridad de Riesgo y defina el plan de acción (CAPA).</p>
            </div>
            
            {formData.modosFalla.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                <p className="text-slate-500 text-sm">Vuelva al paso 1 para agregar Modos de Falla.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {formData.modosFalla.map((falla, index) => (
                  <div key={falla.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative">
                    <h5 className="font-bold text-sm text-slate-700 mb-3 text-purple-700">Evaluación de Falla #{index + 1}: {falla.modoFalla || '(Sin definir)'}</h5>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-4">
                      <div>
                        <label className="block text-xs font-bold text-purple-900 mb-1">Severidad (S)</label>
                        <p className="text-[10px] text-purple-700/70 mb-2">1 (Mínima) - 10 (Fatalidad)</p>
                        <input
                          type="number"
                          min="1" max="10"
                          className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm font-bold text-center"
                          value={falla.severidad}
                          onChange={e => handleFallaChange(falla.id, 'severidad', parseInt(e.target.value) || 1)}
                          disabled={isCompleted}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-purple-900 mb-1">Ocurrencia (O)</label>
                        <p className="text-[10px] text-purple-700/70 mb-2">1 (Improbable) - 10 (Frecuente)</p>
                        <input
                          type="number"
                          min="1" max="10"
                          className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm font-bold text-center"
                          value={falla.ocurrencia}
                          onChange={e => handleFallaChange(falla.id, 'ocurrencia', parseInt(e.target.value) || 1)}
                          disabled={isCompleted}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-purple-900 mb-1">Detección (D)</label>
                        <p className="text-[10px] text-purple-700/70 mb-2">1 (Seguro) - 10 (Indetectable)</p>
                        <input
                          type="number"
                          min="1" max="10"
                          className="w-full bg-white border border-purple-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm font-bold text-center"
                          value={falla.deteccion}
                          onChange={e => handleFallaChange(falla.id, 'deteccion', parseInt(e.target.value) || 1)}
                          disabled={isCompleted}
                        />
                      </div>
                      <div className="flex flex-col items-center justify-center pt-2">
                        <label className="block text-xs font-black text-slate-800 mb-1 uppercase tracking-wider flex items-center gap-1">
                          <Calculator className="w-3 h-3" /> NPR Total
                        </label>
                        <div className={`px-4 py-2 rounded-xl text-lg font-black ${getNprColor(falla.npr)} border border-current`}>
                          {falla.npr}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Planes de Acción Reductores de Riesgo</label>
                      <p className="text-[10px] text-slate-500 mb-2">Acciones correctivas ingenieriles o de gestión para reducir S, O, o D.</p>
                      <textarea
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500/50 text-sm resize-none"
                        placeholder="Ej. Instalar válvula de corte automático..."
                        value={falla.medidasCorrectivas}
                        onChange={e => handleFallaChange(falla.id, 'medidasCorrectivas', e.target.value)}
                        disabled={isCompleted}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className={step === 1 ? 'text-purple-600' : ''}>1. Modos de Falla</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-purple-600' : ''}>2. Evaluación NPR y CAPA</span>
        </div>
        <div className="text-xs text-slate-400 font-medium">Paso {step} de 2</div>
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
                  cause: 'Fallas sistémicas identificadas en análisis AMFE', 
                  actionPlan: 'Medidas detalladas en el análisis NPR', 
                  methodology: 'amfe' 
                }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 2 ? (
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
                      onSave({ 
                        ...formData, 
                        cause: 'Fallas sistémicas identificadas en análisis AMFE', 
                        actionPlan: 'Medidas detalladas en el análisis NPR', 
                        methodology: 'amfe' 
                      }, true);
                    }
                  }}
                  disabled={isSaving || formData.modosFalla.length === 0}
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
