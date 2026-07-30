import { useState } from "react";
import { X } from "lucide-react";
import { createEmergencyEquipment } from "@/app/actions/emergencias";

interface EquipmentModalProps {
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function EquipmentModal({ companyId, isOpen, onClose }: EquipmentModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("Extintor ABC");
  const [location, setLocation] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEmergencyEquipment(companyId, { 
        name, 
        type, 
        location,
        expirationDate: expirationDate || undefined,
        status: "Operativo"
      });
      onClose();
      setName("");
      setLocation("");
      setExpirationDate("");
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
          <h2 className="text-xl font-bold text-slate-800">Agregar Equipamiento</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Nombre / Código</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                placeholder="Ej. EXT-01"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Equipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none bg-white"
              >
                <option value="Extintor ABC">Extintor ABC</option>
                <option value="Extintor CO2">Extintor CO2</option>
                <option value="Botiquín">Botiquín</option>
                <option value="Red de Incendio">Red de Incendio</option>
                <option value="DEA">DEA</option>
                <option value="Alarma">Alarma Sonora</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Ubicación</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
              placeholder="Ej. Pasillo Central"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Fecha de Vencimiento / Recarga</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
            />
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
              {isSubmitting ? "Guardando..." : "Agregar Equipo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
