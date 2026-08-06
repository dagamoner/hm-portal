"use client";

import { Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { deleteCapa, updateCapa } from "@/app/actions/capa";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

const RISK_COLORS: Record<string, string> = {
  CRITICAL: "bg-red-100 text-red-800",
  MAJOR: "bg-amber-100 text-amber-800",
  MINOR: "bg-blue-100 text-blue-800",
};

const STATUS_COLORS: Record<string, string> = {
  ABIERTO: "bg-rose-100 text-rose-800 border-rose-200",
  VERIFICANDO: "bg-amber-100 text-amber-800 border-amber-200",
  CERRADO: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function CapaList({ companyId, capas, setCapas }: any) {
  const { isClient } = useAuth();
  
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este caso CAPA permanentemente?")) return;
    const res = await deleteCapa(companyId, id);
    if (res.success) {
      toast.success("Caso CAPA eliminado");
      setCapas(capas.filter((c: any) => c.id !== id));
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await updateCapa(companyId, id, { status: newStatus });
    if (res.success) {
      toast.success(`Estado actualizado a ${newStatus}`);
      setCapas(capas.map((c: any) => c.id === id ? { ...c, status: newStatus } : c));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {capas.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-500 border border-dashed border-slate-300 rounded-2xl">
            No hay casos CAPA registrados.
          </div>
        ) : capas.map((item: any) => (
          <div key={item.id} className={`bg-white border-2 rounded-2xl p-5 shadow-sm flex flex-col gap-4 transition-all ${
            item.status === "CERRADO" ? "border-emerald-200 opacity-80" : 
            item.status === "VERIFICANDO" ? "border-amber-200" : "border-slate-200"
          }`}>
            <div className="flex justify-between items-start">
              <div className="pr-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md mb-2 inline-block ${RISK_COLORS[item.riskLevel] || "bg-slate-100 text-slate-600"}`}>
                  Riesgo {item.riskLevel}
                </span>
                <h3 className="font-black text-slate-800 text-base leading-tight">{item.deviationType}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{new Date(item.reportDate).toLocaleDateString()} • Área: {item.area}</p>
              </div>
              <select 
                value={item.status} 
                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                disabled={isClient}
                className={`text-xs font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed ${STATUS_COLORS[item.status]}`}
              >
                <option value="ABIERTO">ABIERTO</option>
                <option value="VERIFICANDO">VERIFICANDO</option>
                <option value="CERRADO">CERRADO</option>
              </select>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700">
              <span className="font-bold text-slate-800 block mb-1">Causa Raíz:</span>
              <p className="line-clamp-2">{item.rootCause || "Pendiente de investigación"}</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 space-y-2">
              <span className="font-bold text-slate-800 block">Plan de Acción:</span>
              {(!item.actionPlan || item.actionPlan.length === 0) ? (
                <p className="text-slate-500 italic">No hay acciones registradas.</p>
              ) : (
                <ul className="space-y-2">
                  {item.actionPlan.map((action: any, idx: number) => (
                    <li key={idx} className="flex gap-2 items-start">
                      {action.status === "COMPLETADA" ? <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" /> : <Clock size={14} className="text-amber-500 shrink-0 mt-0.5" />}
                      <div>
                        <p className="font-medium">[{action.type}] {action.description}</p>
                        <p className="text-[10px] text-slate-500">Resp: {action.responsible} | Vence: {new Date(action.deadline).toLocaleDateString()}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {item.sopUpdated && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    ✓ POE Actualizado
                  </span>
                )}
                {item.status === "CERRADO" && item.closedAt && (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    Cerrado el {new Date(item.closedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              {!isClient && (
                <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
