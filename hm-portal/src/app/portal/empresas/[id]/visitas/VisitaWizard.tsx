"use client";

import React, { useState, useEffect } from 'react';
import { createVisit } from '@/app/actions/visits';
import { ClipboardCheck, Building2, Save, AlertCircle, Plus, Trash2, ListChecks, CheckSquare, Square } from 'lucide-react';

interface ChecklistAnswer {
  status: 'SI' | 'NO' | 'N/A' | null;
  peligro: string;
}

export default function VisitaWizard({ 
  companyId, 
  establishments, 
  templates,
  onComplete 
}: { 
  companyId: string;
  establishments: any[];
  templates: any[];
  onComplete: (visit: any) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  
  // Basic info
  const [establishmentId, setEstablishmentId] = useState(establishments[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [visitNumber, setVisitNumber] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [observations, setObservations] = useState('');
  const [recommendedTrainings, setRecommendedTrainings] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates.length > 0 ? templates[0].id : '');

  // Checklist Data state
  const [template, setTemplate] = useState<{name: string, items: {id: string, text: string, type?: string}[]}[]>([]);
  const [answers, setAnswers] = useState<Record<string, ChecklistAnswer>>({});

  // Initialize template based on selected dynamic template
  useEffect(() => {
    if (!selectedTemplateId) {
        setTemplate([]);
        setAnswers({});
        return;
    }

    const selectedTpl = templates.find(t => t.id === selectedTemplateId);
    if (!selectedTpl || !selectedTpl.categories) {
        setTemplate([]);
        setAnswers({});
        return;
    }

    const editableTemplate = selectedTpl.categories.map((cat: any) => ({
      name: cat.name,
      items: cat.items.map((item: any, idx: number) => ({
        id: `item_${cat.name}_${idx}`, // simplify id generation since category might not have an id
        text: item.question,
        type: item.type || 'boolean'
      }))
    }));

    setTemplate(editableTemplate);
    setAnswers({});
  }, [selectedTemplateId, templates]);

  const handleAnswerChange = (itemId: string, field: 'status' | 'peligro', value: string | null) => {
    setAnswers(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId] || { status: null, peligro: '' },
        [field]: value
      }
    }));
  };

  const handleAddItem = (categoryIndex: number) => {
    const newItemId = `new_item_${Date.now()}`;
    const newTemplate = [...template];
    newTemplate[categoryIndex].items.push({ id: newItemId, text: 'Nuevo ítem de inspección...', type: 'boolean' });
    setTemplate(newTemplate);
  };

  const handleRemoveItem = (categoryIndex: number, itemId: string) => {
    const newTemplate = [...template];
    newTemplate[categoryIndex].items = newTemplate[categoryIndex].items.filter(item => item.id !== itemId);
    setTemplate(newTemplate);
    
    // Clean up answers
    const newAnswers = { ...answers };
    delete newAnswers[itemId];
    setAnswers(newAnswers);
  };

  const handleItemTextChange = (categoryIndex: number, itemId: string, newText: string) => {
    const newTemplate = [...template];
    const item = newTemplate[categoryIndex].items.find(i => i.id === itemId);
    if (item) item.text = newText;
    setTemplate(newTemplate);
  };

  const handleSave = async () => {
    if (!inspectorName || !establishmentId) {
      alert("Por favor complete al menos el nombre del inspector y seleccione un establecimiento.");
      return;
    }

    try {
      setIsSaving(true);
      
      // Auto-generate findings for 'NO' answers
      const findings = [];
      for (const category of template) {
        for (const item of category.items) {
          const ans = answers[item.id];
          if (ans?.status === 'NO') {
            findings.push({
              description: `Incumplimiento en ${category.name}: ${item.text}. ${ans.peligro ? `Observación: ${ans.peligro}` : ''}`,
              hazardLevel: 'Medio', // Default
            });
          }
        }
      }

      // Save checklist data with texts and template name
      const checklistData = {
        templateName: templates.find(t => t.id === selectedTemplateId)?.name || 'Acta de Visita',
        categories: template.map(category => ({
          category: category.name,
          items: category.items.map(item => ({
            text: item.text,
            type: item.type,
            answer: answers[item.id] || { status: null, peligro: '' }
          }))
        }))
      };

      const payload = {
        establishmentId,
        date,
        visitNumber,
        inspectorName,
        observations,
        recommendedTrainings,
        checklistData,
        findings
      };

      const newVisit = await createVisit(companyId, payload);
      onComplete(newVisit);

    } catch (e) {
      alert("Error al guardar el acta de visita.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-6">
        
        {/* Encabezado del Acta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Locación Inspeccionada</label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium appearance-none"
                value={establishmentId}
                onChange={e => setEstablishmentId(e.target.value)}
              >
                {establishments.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.name} {e.type ? `(${e.type})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fecha</label>
            <input
              type="date"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Plantilla de Inspección a Utilizar</label>
            <div className="relative">
              <ListChecks className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <select
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium appearance-none"
                value={selectedTemplateId}
                onChange={e => setSelectedTemplateId(e.target.value)}
              >
                <option value="">-- Seleccionar Plantilla --</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.type})
                  </option>
                ))}
              </select>
            </div>
            {templates.length === 0 && (
                <p className="text-[10px] font-bold text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> No hay plantillas creadas. Ve a Settings para crear una.
                </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Inspector / Profesional HyS</label>
            <input
              type="text"
              placeholder="Nombre del licenciado/técnico..."
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              value={inspectorName}
              onChange={e => setInspectorName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Número de Visita (Opcional)</label>
            <input
              type="number"
              placeholder="Ej. 7"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              value={visitNumber}
              onChange={e => setVisitNumber(e.target.value)}
            />
          </div>
        </div>

      </div>

      {/* Checklist Dinámico */}
      <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar bg-slate-50 space-y-6">
        <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-800 leading-relaxed">
            <strong>Instrucciones:</strong> Marque SI, NO o N/A para cada ítem. Los ítems marcados con <strong>NO</strong> generarán automáticamente un Desvío (No Conformidad) que deberá ser gestionado en el panel. Puede editar el texto de los ítems haciendo clic en ellos o agregar nuevos.
          </p>
        </div>

        {template.map((category, cIdx) => (
          <div key={category.name} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-100/50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700 text-sm">{category.name}</h3>
              <button 
                onClick={() => handleAddItem(cIdx)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md"
              >
                <Plus className="w-3 h-3" /> Agregar Ítem
              </button>
            </div>
            
            <div className="divide-y divide-slate-100">
              {category.items.map(item => {
                const ans = answers[item.id];
                const isNo = ans?.status === 'NO';

                return (
                  <div key={item.id} className={`p-4 flex flex-col md:flex-row gap-4 transition-colors ${isNo ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'}`}>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2">
                        <button 
                          onClick={() => handleRemoveItem(cIdx, item.id)}
                          className="mt-1 text-slate-300 hover:text-rose-500 transition-colors"
                          title="Eliminar ítem"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <textarea
                          rows={2}
                          className="w-full text-sm font-medium text-slate-700 bg-transparent border-none outline-none focus:ring-1 focus:ring-indigo-500/50 rounded-md p-1 resize-none"
                          value={item.text}
                          onChange={(e) => handleItemTextChange(cIdx, item.id, e.target.value)}
                        />
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Observaciones / Peligros específicos..."
                        className="w-full text-xs text-slate-600 border border-slate-200 rounded-md px-3 py-2 outline-none focus:border-indigo-400 bg-white"
                        value={ans?.peligro || ''}
                        onChange={(e) => handleAnswerChange(item.id, 'peligro', e.target.value)}
                      />
                    </div>
                    
                    <div className="flex items-start gap-1 flex-shrink-0 pt-2 w-full md:w-auto">
                      {item.type === 'checkbox' ? (
                        <button
                          onClick={() => handleAnswerChange(item.id, 'status', ans?.status === 'SI' ? 'NO' : 'SI')}
                          className={`w-[140px] py-1.5 text-xs font-black rounded border transition-colors flex items-center justify-center gap-2 ${ans?.status === 'SI' ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-500'}`}
                        >
                          {ans?.status === 'SI' ? <CheckSquare className="w-4 h-4"/> : <Square className="w-4 h-4"/>} 
                          {ans?.status === 'SI' ? 'REALIZADO' : 'PENDIENTE'}
                        </button>
                      ) : item.type === 'text' ? (
                        <input
                          type="text"
                          placeholder="Respuesta..."
                          className="w-[140px] text-xs text-slate-700 font-bold border border-slate-200 rounded-md px-3 py-1.5 outline-none focus:border-indigo-400 bg-white"
                          value={ans?.status && ans.status !== 'SI' && ans.status !== 'NO' && ans.status !== 'N/A' ? ans.status : ''}
                          onChange={(e) => handleAnswerChange(item.id, 'status', e.target.value)}
                        />
                      ) : (
                        <div className="flex gap-1 w-full md:w-[140px]">
                          <button
                            onClick={() => handleAnswerChange(item.id, 'status', 'SI')}
                            className={`flex-1 py-1.5 text-xs font-black rounded border transition-colors ${ans?.status === 'SI' ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-400 hover:border-emerald-200 hover:text-emerald-500'}`}
                          >
                            SI
                          </button>
                          <button
                            onClick={() => handleAnswerChange(item.id, 'status', 'NO')}
                            className={`flex-1 py-1.5 text-xs font-black rounded border transition-colors ${ans?.status === 'NO' ? 'bg-rose-100 border-rose-200 text-rose-700' : 'bg-white border-slate-200 text-slate-400 hover:border-rose-200 hover:text-rose-500'}`}
                          >
                            NO
                          </button>
                          <button
                            onClick={() => handleAnswerChange(item.id, 'status', 'N/A')}
                            className={`flex-1 py-1.5 text-xs font-black rounded border transition-colors ${ans?.status === 'N/A' ? 'bg-slate-200 border-slate-300 text-slate-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'}`}
                          >
                            N/A
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {template.length === 0 && (
            <div className="text-center text-slate-400 py-12">
                <ListChecks className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Selecciona una plantilla para comenzar la inspección.</p>
            </div>
        )}

        {/* Footer info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2">Observaciones Generales</label>
            <textarea
              rows={3}
              placeholder="Resumen del estado general..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 resize-none"
              value={observations}
              onChange={e => setObservations(e.target.value)}
            />
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-2">Próxima Capacitación Sugerida</label>
            <textarea
              rows={3}
              placeholder="Ej. Uso de amoladoras, trabajo en altura..."
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-400 resize-none"
              value={recommendedTrainings}
              onChange={e => setRecommendedTrainings(e.target.value)}
            />
          </div>
        </div>

      </div>

      <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving || template.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            'Guardando...'
          ) : (
            <>
              <Save className="w-4 h-4" /> Finalizar y Guardar Acta
            </>
          )}
        </button>
      </div>

    </div>
  );
}
