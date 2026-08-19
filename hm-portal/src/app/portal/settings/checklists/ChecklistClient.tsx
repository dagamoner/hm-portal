"use client";

import React, { useState, useTransition } from "react";
import { 
    ClipboardList, Plus, Trash2, Edit2, Save, X, GripVertical, CheckCircle2, ChevronRight, ChevronDown 
} from "lucide-react";
import { createChecklistTemplate, updateChecklistTemplate, deleteChecklistTemplate } from "@/app/actions/checklists";

type ChecklistItem = { id: string, question: string };
type ChecklistCategory = { id: string, name: string, items: ChecklistItem[] };
type TemplateData = { name: string, type: string, categories: ChecklistCategory[] };

export default function ChecklistClient({ initialTemplates }: { initialTemplates: any[] }) {
    const [templates, setTemplates] = useState(initialTemplates);
    const [isPending, startTransition] = useTransition();
    
    // UI states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const generateId = () => Math.random().toString(36).substring(2, 9);

    const [formData, setFormData] = useState<TemplateData>({
        name: "",
        type: "ESTABLECIMIENTO",
        categories: []
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            if (editingTemplate) {
                const res = await updateChecklistTemplate(editingTemplate.id, formData);
                if (res.success) {
                    setTemplates(templates.map(t => t.id === editingTemplate.id ? res.template : t));
                }
            } else {
                const res = await createChecklistTemplate(formData);
                if (res.success) {
                    setTemplates([res.template, ...templates]);
                }
            }
            setIsModalOpen(false);
        });
    };

    const confirmDelete = (id: string) => {
        if(confirm("¿Eliminar esta plantilla? Las inspecciones previas no se verán afectadas.")) {
            startTransition(async () => {
                const res = await deleteChecklistTemplate(id);
                if (res.success) {
                    setTemplates(templates.filter(t => t.id !== id));
                }
            });
        }
    };

    const toggleCategory = (catId: string) => {
        const newSet = new Set(expandedCategories);
        if (newSet.has(catId)) newSet.delete(catId);
        else newSet.add(catId);
        setExpandedCategories(newSet);
    };

    const addCategory = () => {
        const newCat = { id: generateId(), name: "Nueva Categoría", items: [] };
        setFormData({ ...formData, categories: [...formData.categories, newCat] });
        setExpandedCategories(new Set([...expandedCategories, newCat.id]));
    };

    const removeCategory = (catId: string) => {
        setFormData({
            ...formData,
            categories: formData.categories.filter(c => c.id !== catId)
        });
    };

    const updateCategoryName = (catId: string, name: string) => {
        setFormData({
            ...formData,
            categories: formData.categories.map(c => c.id === catId ? { ...c, name } : c)
        });
    };

    const addItem = (catId: string) => {
        setFormData({
            ...formData,
            categories: formData.categories.map(c => 
                c.id === catId 
                    ? { ...c, items: [...c.items, { id: generateId(), question: "", type: "boolean" }] } 
                    : c
            )
        });
    };

    const updateItem = (catId: string, itemId: string, field: string, value: string) => {
        setFormData({
            ...formData,
            categories: formData.categories.map(c => 
                c.id === catId 
                    ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) } 
                    : c
            )
        });
    };

    const removeItem = (catId: string, itemId: string) => {
        setFormData({
            ...formData,
            categories: formData.categories.map(c => 
                c.id === catId 
                    ? { ...c, items: c.items.filter(i => i.id !== itemId) } 
                    : c
            )
        });
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex justify-between items-center bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        <ClipboardList className="w-8 h-8 text-indigo-600" />
                        Constructor de Plantillas (Checklists)
                    </h2>
                    <p className="text-slate-500 mt-1">Crea y administra los formularios dinámicos que usarán los inspectores en campo.</p>
                </div>
                <button 
                    onClick={() => { 
                        setFormData({ name: "", type: "ESTABLECIMIENTO", categories: [] }); 
                        setEditingTemplate(null); 
                        setIsModalOpen(true); 
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Nueva Plantilla
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template: any) => (
                    <div key={template.id} className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-full border border-indigo-200 mb-3 inline-block">
                            {template.type}
                        </span>
                        <h3 className="text-lg font-bold text-slate-800">{template.name}</h3>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            {template.categories?.length || 0} Categorías
                        </p>
                        <p className="text-sm text-slate-500 mt-0.5 flex items-center gap-1.5">
                            <ClipboardList className="w-4 h-4 text-amber-500" />
                            {template.categories?.reduce((acc: number, c: any) => acc + (c.items?.length || 0), 0)} Preguntas en total
                        </p>
                        
                        <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
                            <button 
                                onClick={() => {
                                    setEditingTemplate(template);
                                    setFormData({ name: template.name, type: template.type, categories: template.categories || [] });
                                    setIsModalOpen(true);
                                }}
                                className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all border border-transparent hover:border-indigo-100"
                                title="Editar Plantilla"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={() => confirmDelete(template.id)}
                                disabled={isPending}
                                className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 disabled:opacity-50"
                                title="Eliminar Plantilla"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {templates.length === 0 && (
                    <div className="col-span-full py-16 text-center text-slate-500 bg-white/40 rounded-3xl border border-dashed border-slate-300">
                        <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                        <h4 className="text-lg font-bold text-slate-800">No hay plantillas creadas</h4>
                        <p className="text-sm mt-1">Crea tu primer checklist interactivo para empezar.</p>
                    </div>
                )}
            </div>

            {/* Modal Constructor */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white border border-slate-100 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30">
                                    <ClipboardList className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">
                                    {editingTemplate ? 'Editar Plantilla' : 'Constructor de Plantilla'}
                                </h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-slate-50/50">
                            <form id="template-form" onSubmit={handleSave} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Nombre de la Plantilla *</label>
                                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 font-bold" placeholder="Ej: Checklist Dec. 911" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tipo de Inspección</label>
                                        <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500">
                                            <option value="ESTABLECIMIENTO">Establecimiento Fijo / Planta</option>
                                            <option value="OBRA">Obra en Construcción</option>
                                            <option value="EQUIPOS">Equipos / Herramientas</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold text-slate-800 uppercase tracking-wider text-sm flex items-center gap-2">
                                            Estructura del Formulario
                                        </h4>
                                        <button type="button" onClick={addCategory} className="px-4 py-2 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                            <Plus className="w-4 h-4" /> Agregar Categoría
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.categories.map((category, catIndex) => (
                                            <div key={category.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all">
                                                <div className="flex items-center gap-3 p-4 bg-slate-50 border-b border-slate-100">
                                                    <button type="button" onClick={() => toggleCategory(category.id)} className="p-1 hover:bg-slate-200 rounded text-slate-500">
                                                        {expandedCategories.has(category.id) ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                                                    </button>
                                                    <div className="font-black text-slate-300 w-6 text-right">{catIndex + 1}.</div>
                                                    <input 
                                                        type="text" 
                                                        value={category.name} 
                                                        onChange={(e) => updateCategoryName(category.id, e.target.value)}
                                                        className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-slate-800 text-lg px-0 py-1"
                                                        placeholder="Nombre de la categoría..."
                                                    />
                                                    <button type="button" onClick={() => removeCategory(category.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                {expandedCategories.has(category.id) && (
                                                    <div className="p-4 bg-white">
                                                        <div className="space-y-2 mb-4">
                                                            {category.items.map((item, itemIndex) => (
                                                                <div key={item.id} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl group">
                                                                    <GripVertical className="w-5 h-5 text-slate-300 mt-2.5 cursor-grab" />
                                                                    <div className="text-xs font-bold text-slate-400 mt-3 w-6">{catIndex + 1}.{itemIndex + 1}</div>
                                                                    <div className="flex-1">
                                                                        <textarea 
                                                                            rows={1}
                                                                            value={item.question}
                                                                            onChange={(e) => updateItem(category.id, item.id, "question", e.target.value)}
                                                                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 resize-none min-h-[42px]"
                                                                            placeholder="Pregunta o ítem a verificar..."
                                                                        />
                                                                        <select
                                                                            value={item.type || "boolean"}
                                                                            onChange={(e) => updateItem(category.id, item.id, "type", e.target.value)}
                                                                            className="mt-2 w-48 px-3 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        >
                                                                            <option value="boolean">Sí / No / N.A.</option>
                                                                            <option value="checkbox">Checkbox (Tildable)</option>
                                                                            <option value="text">Texto Libre</option>
                                                                        </select>
                                                                    </div>
                                                                    <button type="button" onClick={() => removeItem(category.id, item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg mt-1 transition-colors opacity-0 group-hover:opacity-100">
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {category.items.length === 0 && (
                                                                <p className="text-center text-sm text-slate-400 py-4 italic">No hay preguntas en esta categoría.</p>
                                                            )}
                                                        </div>
                                                        <button type="button" onClick={() => addItem(category.id)} className="w-full py-3 border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                                            <Plus className="w-4 h-4" /> Añadir Pregunta
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {formData.categories.length === 0 && (
                                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                                                <p className="text-slate-500 font-medium">No has agregado ninguna categoría aún.</p>
                                                <button type="button" onClick={addCategory} className="mt-3 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-bold inline-flex items-center gap-2">
                                                    <Plus className="w-4 h-4" /> Agregar la primera categoría
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 border-t border-slate-200 bg-white flex justify-end gap-3 z-10 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" form="template-form" disabled={isPending || formData.name.trim() === ""} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50">
                                <Save className="w-4 h-4" />
                                {isPending ? 'Guardando...' : 'Guardar Plantilla'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
