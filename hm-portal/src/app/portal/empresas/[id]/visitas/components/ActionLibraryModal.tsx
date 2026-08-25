import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, Save } from 'lucide-react';
import { getStandardActions, createStandardAction, updateStandardAction, deleteStandardAction } from '@/app/actions/standard-actions';

export default function ActionLibraryModal({ companyId, onClose }: { companyId: string, onClose: () => void }) {
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadActions();
  }, [companyId]);

  const loadActions = async () => {
    setLoading(true);
    const data = await getStandardActions(companyId);
    setActions(data);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title || !description) return alert('Por favor completa ambos campos.');
    
    if (editing?.id) {
      await updateStandardAction(editing.id, title, description);
    } else {
      await createStandardAction(companyId, title, description);
    }
    setTitle('');
    setDescription('');
    setEditing(null);
    loadActions();
  };

  const handleEdit = (a: any) => {
    setEditing(a);
    setTitle(a.title);
    setDescription(a.description);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este plan de acción de la biblioteca?')) {
      await deleteStandardAction(id);
      loadActions();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-800 text-lg">Biblioteca de Planes de Acción</h2>
            <p className="text-xs text-slate-500">Configura respuestas estándar para los desvíos frecuentes</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-slate-700 mb-3">{editing ? 'Editar Acción' : 'Nueva Acción Estándar'}</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Título (Ej: Capacitación en Extintores)"
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Descripción detallada del plan de acción o medida..."
                rows={3}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500 resize-none"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                {editing && (
                  <button onClick={() => { setEditing(null); setTitle(''); setDescription(''); }} className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg">
                    Cancelar
                  </button>
                )}
                <button onClick={handleSave} className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 flex items-center gap-1">
                  <Save className="w-3 h-3" /> Guardar
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-sm text-slate-500">Cargando...</p>
            ) : actions.length === 0 ? (
              <p className="text-center text-sm text-slate-500">No hay acciones guardadas.</p>
            ) : (
              actions.map(a => (
                <div key={a.id} className="border border-slate-200 rounded-xl p-4 bg-white flex justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-700 text-sm mb-1">{a.title}</h4>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{a.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(a)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg h-fit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg h-fit">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
