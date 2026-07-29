"use client";

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle, ChevronRight, ChevronLeft, BarChart2 } from 'lucide-react';

interface EstadisticoData {
  ubicacionSector: string;
  horaTurno: string;
  agenteMaterial: string;
  parteCuerpo: string;
  perfilTrabajador: string;
  analisisPareto: string;
  correlacionTemporal: string;
  desviacionTendencia: string;
  factoresCriticos: string;
  proyeccionRiesgo: string;
  intervencionFocalizada: string;
  modificacionIndicadores: string;
  seguimientoKPI: string;
}

const DEFAULT_DATA: EstadisticoData = {
  ubicacionSector: '',
  horaTurno: '',
  agenteMaterial: '',
  parteCuerpo: '',
  perfilTrabajador: '',
  analisisPareto: '',
  correlacionTemporal: '',
  desviacionTendencia: '',
  factoresCriticos: '',
  proyeccionRiesgo: '',
  intervencionFocalizada: '',
  modificacionIndicadores: '',
  seguimientoKPI: ''
};

export default function EstadisticoWizard({
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
  const [formData, setFormData] = useState<EstadisticoData>(
    initialData && Object.keys(initialData).length > 0 ? initialData : DEFAULT_DATA
  );

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field: keyof EstadisticoData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-600" /> 1. Recopilación e Ingesta de Datos
              </h4>
              <p className="text-xs text-slate-500 mb-4">Registro cuantificable de variables categóricas del accidente para integración con la base histórica.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Ubicación / Sector</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  placeholder="Ej. Planta, línea de montaje, área operativa..."
                  value={formData.ubicacionSector}
                  onChange={e => handleChange('ubicacionSector', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Hora / Turno</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  placeholder="Ej. Horario exacto, inicio de turno, horas acumuladas..."
                  value={formData.horaTurno}
                  onChange={e => handleChange('horaTurno', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Agente Material</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  placeholder="Ej. Maquinaria, herramienta, sustancia..."
                  value={formData.agenteMaterial}
                  onChange={e => handleChange('agenteMaterial', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Parte del Cuerpo Afectada</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  placeholder="Ej. Extremidades, ojos, zona lumbar..."
                  value={formData.parteCuerpo}
                  onChange={e => handleChange('parteCuerpo', e.target.value)}
                  disabled={isCompleted}
                />
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-2">Perfil del Trabajador</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm"
                  placeholder="Ej. Antigüedad, capacitación previa, contratista vs personal..."
                  value={formData.perfilTrabajador}
                  onChange={e => handleChange('perfilTrabajador', e.target.value)}
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
              <h4 className="text-sm font-bold text-slate-800 mb-1">2. Procesamiento: Identificación de Patrones</h4>
              <p className="text-xs text-slate-500 mb-4">Análisis de picos, frecuencias y desviaciones operativas.</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Análisis de Pareto (Regla 80/20)</label>
                <p className="text-[10px] text-slate-500 mb-2">Priorización del 20% de las causas/sectores que concentran el 80% de accidentes.</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.analisisPareto}
                  onChange={e => handleChange('analisisPareto', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Correlación Temporal y Operativa</label>
                <p className="text-[10px] text-slate-500 mb-2">Evaluación de concentración en ciertos días, meses de alta producción o perfiles.</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.correlacionTemporal}
                  onChange={e => handleChange('correlacionTemporal', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Análisis de Desviación de Tendencia</label>
                <p className="text-[10px] text-slate-500 mb-2">Comparación de probabilidad teórica esperada vs tasa real observada.</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.desviacionTendencia}
                  onChange={e => handleChange('desviacionTendencia', e.target.value)}
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
              <h4 className="text-sm font-bold text-slate-800 mb-1">3. Diagnóstico: Modelos Predictivos e Hipótesis</h4>
              <p className="text-xs text-slate-500 mb-4">Causa raíz basada en frecuencia, impacto y análisis probabilístico histórico.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Determinación de Factores Críticos</label>
                <p className="text-[10px] text-slate-500 mb-2">¿El evento responde a un pico estacional o a una anomalía puntual?</p>
                <textarea
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.factoresCriticos}
                  onChange={e => handleChange('factoresCriticos', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Proyección de Riesgo</label>
                <p className="text-[10px] text-slate-500 mb-2">¿La probabilidad de recurrencia en el área supera el umbral tolerable?</p>
                <textarea
                  rows={6}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.proyeccionRiesgo}
                  onChange={e => handleChange('proyeccionRiesgo', e.target.value)}
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
              <h4 className="text-sm font-bold text-slate-800 mb-1">4. Plan de Acción: Medidas Cuantitativas</h4>
              <p className="text-xs text-slate-500 mb-4">Control sistemático enfocado en la variabilidad y redefinición de KPIs.</p>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Intervención Focalizada (Pareto)</label>
                <p className="text-[10px] text-slate-500 mb-2">Rediseño en las áreas que concentran el mayor peso estadístico de siniestros.</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.intervencionFocalizada}
                  onChange={e => handleChange('intervencionFocalizada', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Modificación de Indicadores de Gestión</label>
                <p className="text-[10px] text-slate-500 mb-2">Redefinición de Planes de Capacitación (PAC) o frecuencias de inspección.</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.modificacionIndicadores}
                  onChange={e => handleChange('modificacionIndicadores', e.target.value)}
                  disabled={isCompleted}
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-2">Seguimiento por KPI (Leading & Lagging)</label>
                <p className="text-[10px] text-slate-500 mb-2">Definición de indicadores cuantitativos de control para medir efectividad a lo largo de los trimestres.</p>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500/50 text-sm resize-none"
                  value={formData.seguimientoKPI}
                  onChange={e => handleChange('seguimientoKPI', e.target.value)}
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
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className={step === 1 ? 'text-cyan-600' : ''}>1. Ingesta</span>
          <span className="text-slate-300">/</span>
          <span className={step === 2 ? 'text-cyan-600' : ''}>2. Procesamiento</span>
          <span className="text-slate-300">/</span>
          <span className={step === 3 ? 'text-cyan-600' : ''}>3. Diagnóstico</span>
          <span className="text-slate-300">/</span>
          <span className={step === 4 ? 'text-cyan-600' : ''}>4. Plan (KPIs)</span>
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
                  cause: formData.factoresCriticos, 
                  actionPlan: `${formData.intervencionFocalizada}\n${formData.modificacionIndicadores}\nKPIs: ${formData.seguimientoKPI}`, 
                  methodology: 'estadistico' 
                }, false)}
                disabled={isSaving}
                className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
              
              {step < 4 ? (
                <button
                  onClick={nextStep}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (confirm('Al completar la investigación, se generará un documento legal y no podrá ser editada. ¿Desea continuar?')) {
                      onSave({ 
                        ...formData, 
                        cause: formData.factoresCriticos, 
                        actionPlan: `${formData.intervencionFocalizada}\n${formData.modificacionIndicadores}\nKPIs: ${formData.seguimientoKPI}`, 
                        methodology: 'estadistico' 
                      }, true);
                    }
                  }}
                  disabled={isSaving || !formData.ubicacionSector || !formData.intervencionFocalizada}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-50"
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
