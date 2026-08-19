"use client";

import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Settings, Save, AlertTriangle, FileText } from 'lucide-react';
import { createChecklistTemplate, updateChecklistTemplate, deleteChecklistTemplate } from '@/app/actions/templates';

interface PlantillasClientProps {
  companyId: string;
  initialTemplates: any[];
  onBack: () => void;
}

export default function PlantillasClient({ companyId, initialTemplates, onBack }: PlantillasClientProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const DEFAULT_TYPES = [
    "ESTABLECIMIENTO", "OBRA", "MAQUINARIA", "VEHICULOS", 
    "HERRAMIENTAS_MANUALES", "HERRAMIENTAS_ELECTRICAS", "ESCALERAS", "CALIDAD",
    "EXTINTORES", "BOTIQUINES", "DEAS", "CAMILLAS", "COLLARINES", 
    "BIE_BOCA_DE_INCENDIO", "MANGUERA_INCENDIO"
  ];

  const [customType, setCustomType] = useState("");
  const [isAddingCustomType, setIsAddingCustomType] = useState(false);

  // Default structure for new templates
  const handleCreateNew = () => {
    setEditingTemplate({
      name: "",
      type: "ESTABLECIMIENTO",
      categories: [
        {
          name: "Nueva Categoría",
          items: [{ question: "Nueva Pregunta", type: "boolean" }]
        }
      ]
    });
    setIsAddingCustomType(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (editingTemplate.id) {
        // Update
        const updated = await updateChecklistTemplate(companyId, editingTemplate.id, editingTemplate);
        setTemplates(templates.map(t => t.id === updated.id ? updated : t));
      } else {
        // Create
        const created = await createChecklistTemplate(companyId, editingTemplate);
        setTemplates([created, ...templates]);
      }
      setEditingTemplate(null);
    } catch (error) {
      console.error(error);
      alert("Error al guardar la plantilla.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta plantilla?")) {
      await deleteChecklistTemplate(companyId, id);
      setTemplates(templates.filter(t => t.id !== id));
    }
  };

  // Builder Logic
  const addCategory = () => {
    setEditingTemplate({
      ...editingTemplate,
      categories: [...editingTemplate.categories, { name: "Nueva Categoría", items: [] }]
    });
  };

  const addItem = (categoryIndex: number) => {
    const newCategories = [...editingTemplate.categories];
    newCategories[categoryIndex].items.push({ question: "Nueva Pregunta", type: "boolean" });
    setEditingTemplate({ ...editingTemplate, categories: newCategories });
  };

  const updateCategoryName = (categoryIndex: number, newName: string) => {
    const newCategories = [...editingTemplate.categories];
    newCategories[categoryIndex].name = newName;
    setEditingTemplate({ ...editingTemplate, categories: newCategories });
  };

  const updateItem = (categoryIndex: number, itemIndex: number, field: string, value: string) => {
    const newCategories = [...editingTemplate.categories];
    newCategories[categoryIndex].items[itemIndex][field] = value;
    setEditingTemplate({ ...editingTemplate, categories: newCategories });
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const newCategories = [...editingTemplate.categories];
    newCategories[categoryIndex].items.splice(itemIndex, 1);
    setEditingTemplate({ ...editingTemplate, categories: newCategories });
  };

  const handleTypeChange = (newType: string) => {
    if (newType === "CUSTOM") {
      setIsAddingCustomType(true);
      setEditingTemplate({ ...editingTemplate, type: "" });
      return;
    }
    
    setIsAddingCustomType(false);
    
    // Auto-inject Location for specific types
    const typesRequiringLocation = ["EXTINTORES", "BOTIQUINES", "DEAS", "CAMILLAS", "COLLARINES", "BIE_BOCA_DE_INCENDIO", "MANGUERA_INCENDIO"];
    let newCategories = [...editingTemplate.categories];
    
    if (typesRequiringLocation.includes(newType)) {
      // Check if location already exists
      const hasLocation = newCategories.some(c => c.items.some((i:any) => i.question === "Ubicación exacta del equipo"));
      if (!hasLocation) {
        newCategories.unshift({
          name: "Datos de Identificación",
          items: [{ question: "Ubicación exacta del equipo", type: "text" }]
        });
      }
    }

    setEditingTemplate({ ...editingTemplate, type: newType, categories: newCategories });
  };

  const confirmCustomType = () => {
    if (customType.trim()) {
      setEditingTemplate({ ...editingTemplate, type: customType.trim().toUpperCase() });
      setIsAddingCustomType(false);
      setCustomType("");
    }
  };

  if (editingTemplate) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingTemplate.id ? "Editar Plantilla" : "Nueva Plantilla"}
            </h2>
            <p className="text-sm text-slate-500">Configura las categorías y preguntas del checklist</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditingTemplate(null)}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Guardando..." : "Guardar Plantilla"}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Plantilla</label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                placeholder="Ej. Inspección 5S"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Categoría General / Tipo</label>
              {!isAddingCustomType ? (
                <select
                  value={DEFAULT_TYPES.includes(editingTemplate.type) ? editingTemplate.type : (editingTemplate.type ? editingTemplate.type : "ESTABLECIMIENTO")}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none bg-white"
                >
                  <optgroup label="Generales">
                    <option value="ESTABLECIMIENTO">Establecimiento Genérico</option>
                    <option value="OBRA">Obra en Construcción</option>
                    <option value="MAQUINARIA">Maquinaria Pesada</option>
                    <option value="VEHICULOS">Vehículos y Flota</option>
                    <option value="HERRAMIENTAS_MANUALES">Herramientas Manuales</option>
                    <option value="HERRAMIENTAS_ELECTRICAS">Herramientas Eléctricas</option>
                    <option value="ESCALERAS">Escaleras / Altura</option>
                    <option value="CALIDAD">Auditoría de Calidad</option>
                  </optgroup>
                  <optgroup label="Equipos de Emergencia (Autocompletan Ubicación)">
                    <option value="EXTINTORES">Extintores</option>
                    <option value="BOTIQUINES">Botiquines de Primeros Auxilios</option>
                    <option value="DEAS">DEA's</option>
                    <option value="CAMILLAS">Camillas</option>
                    <option value="COLLARINES">Collarines</option>
                    <option value="BIE_BOCA_DE_INCENDIO">Boca de Incendio Equipada (BIE)</option>
                    <option value="MANGUERA_INCENDIO">Manguera de Incendio</option>
                  </optgroup>
                  {editingTemplate.type && !DEFAULT_TYPES.includes(editingTemplate.type) && (
                    <optgroup label="Personalizado">
                      <option value={editingTemplate.type}>{editingTemplate.type}</option>
                    </optgroup>
                  )}
                  <optgroup label="Otro">
                    <option value="CUSTOM">+ Crear nuevo tipo...</option>
                  </optgroup>
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                    placeholder="Ej. ANDAMIOS"
                    autoFocus
                  />
                  <button 
                    onClick={confirmCustomType}
                    className="bg-indigo-600 text-white px-4 rounded-xl font-bold hover:bg-indigo-700"
                  >
                    OK
                  </button>
                  <button 
                    onClick={() => setIsAddingCustomType(false)}
                    className="bg-slate-100 text-slate-600 px-4 rounded-xl font-bold hover:bg-slate-200"
                  >
                    X
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-slate-800">Estructura del Checklist</h3>
              <button
                onClick={addCategory}
                className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Agregar Categoría
              </button>
            </div>

            <div className="space-y-6">
              {editingTemplate.categories.map((category: any, cIdx: number) => (
                <div key={cIdx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex gap-4 items-center">
                    <GripVertical className="w-5 h-5 text-slate-400 cursor-move" />
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategoryName(cIdx, e.target.value)}
                      className="flex-1 bg-transparent font-bold text-slate-800 focus:outline-none border-b border-transparent focus:border-indigo-300 px-1 py-0.5"
                      placeholder="Nombre de la categoría"
                    />
                    <button 
                      onClick={() => {
                        const newCats = [...editingTemplate.categories];
                        newCats.splice(cIdx, 1);
                        setEditingTemplate({ ...editingTemplate, categories: newCats });
                      }}
                      className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="p-4 space-y-3 bg-white">
                    {category.items.map((item: any, iIdx: number) => (
                      <div key={iIdx} className="flex gap-3 items-start group">
                        <input
                          type="text"
                          value={item.question}
                          onChange={(e) => updateItem(cIdx, iIdx, "question", e.target.value)}
                          className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                          placeholder="Escribe la pregunta o chequeo..."
                        />
                        <select
                          value={item.type || "boolean"}
                          onChange={(e) => updateItem(cIdx, iIdx, "type", e.target.value)}
                          className="w-40 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 outline-none"
                        >
                          <option value="boolean">Sí / No / N.A.</option>
                          <option value="checkbox">Checkbox (Tildable)</option>
                          <option value="text">Texto Libre</option>
                        </select>
                        <button
                          onClick={() => removeItem(cIdx, iIdx)}
                          className="text-slate-400 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => addItem(cIdx)}
                      className="mt-2 text-slate-500 text-sm font-medium hover:text-indigo-600 flex items-center gap-1 px-2 py-1"
                    >
                      <Plus className="w-4 h-4" /> Agregar Ítem
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600">
              <Settings className="w-6 h-6" />
            </button>
            Gestor de Plantillas
          </h1>
          <p className="text-sm text-slate-500">Configura los checklists para las inspecciones en terreno</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva Plantilla
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {templates.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-slate-600 font-bold mb-2">No hay plantillas configuradas</h4>
            <p className="text-slate-500 text-sm">Crea tu primera plantilla de inspección para comenzar.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {templates.map(template => (
              <div key={template.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{template.name}</h4>
                  <p className="text-sm text-slate-500 mt-1">
                    Tipo: <span className="font-semibold text-slate-600">{template.type}</span> • {template.categories?.length || 0} Categorías
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setEditingTemplate(template)}
                    className="text-indigo-600 text-sm font-bold bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
