import { useState } from "react";
import { X } from "lucide-react";
import { createEmergencyDrill } from "@/app/actions/emergencias";

interface DrillModalProps {
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DrillModal({ companyId, isOpen, onClose }: DrillModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Parcial");
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEmergencyDrill(companyId, { 
        title, 
        type, 
        date, 
        status: "Programado" 
      });
      onClose();
      setTitle("");
      setDate("");
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800">Programar Simulacro</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Título del Simulacro</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
              placeholder="Ej. Evacuación por Incendio Sector B"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none bg-white"
              >
                <option value="Parcial">Parcial</option>
                <option value="General">General</option>
                <option value="Gabinete">Gabinete</option>
                <option value="Campo">Campo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Fecha Programada</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Programar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
