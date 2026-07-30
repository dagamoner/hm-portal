import { useState } from "react";
import { X } from "lucide-react";
import { createBrigadeMember } from "@/app/actions/emergencias";

interface BrigadeModalProps {
  companyId: string;
  availableWorkers: any[];
  isOpen: boolean;
  onClose: () => void;
}

export default function BrigadeModal({ companyId, availableWorkers, isOpen, onClose }: BrigadeModalProps) {
  const [workerId, setWorkerId] = useState("");
  const [role, setRole] = useState("Líder");
  const [area, setArea] = useState("");
  const [medicalAptitudeDate, setMedicalAptitudeDate] = useState("");
  const [medicalAptitudeStatus, setMedicalAptitudeStatus] = useState("Apto");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createBrigadeMember(companyId, { 
        workerId, 
        role, 
        area,
        medicalAptitudeDate: medicalAptitudeDate || undefined,
        medicalAptitudeStatus
      });
      onClose();
      setWorkerId("");
      setArea("");
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
          <h2 className="text-xl font-bold text-slate-800">Asignar Brigadista</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Seleccionar Personal</label>
            <select
              required
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none bg-white"
            >
              <option value="">Seleccione un trabajador...</option>
              {availableWorkers.map(w => (
                <option key={w.id} value={w.id}>
                  {w.lastName}, {w.firstName} (DNI: {w.documentId})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Rol en Brigada</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none bg-white"
              >
                <option value="Líder">Líder</option>
                <option value="Jefe Evacuación">Jefe Evacuación</option>
                <option value="Primeros Auxilios">Primeros Auxilios</option>
                <option value="Extinción">Extinción</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Área / Sector</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                placeholder="Ej. Planta Baja"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Vencimiento Apto Médico</label>
              <input
                type="date"
                value={medicalAptitudeDate}
                onChange={(e) => setMedicalAptitudeDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Estado Médico</label>
              <select
                value={medicalAptitudeStatus}
                onChange={(e) => setMedicalAptitudeStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none bg-white"
              >
                <option value="Apto">Apto</option>
                <option value="Restringido">Restringido</option>
                <option value="Vencido">Vencido</option>
              </select>
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
              {isSubmitting ? "Guardando..." : "Asignar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
