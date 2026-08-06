"use client";

import { Trash2, FileText, Download, AlertTriangle } from "lucide-react";
import { deleteChemicalProduct } from "@/app/actions/chemicals";
import toast from "react-hot-toast";

const PICTOGRAMS: Record<string, string> = {
  GHS01: "💣", // Explosivo
  GHS02: "🔥", // Inflamable
  GHS03: "⭕", // Comburente
  GHS04: "🗜️", // Gas a presión
  GHS05: "🧪", // Corrosivo
  GHS06: "☠️", // Toxicidad Aguda
  GHS07: "❗", // Irritación / Peligro
  GHS08: "👤", // Peligro Sistémico / Salud
  GHS09: "🐟", // Peligro Ambiente
  CLASS1: "💥", // Clase 1 Transporte
  CLASS2: "💨", // Clase 2 Transporte
  CLASS3: "⛽", // Clase 3 Transporte
  CLASS4: "🎇", // Clase 4 Transporte
  CLASS5: "☢️", // Clase 5 Transporte
  CLASS6: "☣️", // Clase 6 Transporte
  CLASS7: "☢", // Clase 7 Transporte
  CLASS8: "🧪", // Clase 8 Transporte
  CLASS9: "⚠️", // Clase 9 Transporte
};

export function ChemicalList({ companyId, products, setProducts }: any) {
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este producto químico del inventario?")) return;
    const res = await deleteChemicalProduct(companyId, id);
    if (res.success) {
      toast.success("Producto eliminado");
      setProducts(products.filter((p: any) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-8 text-slate-500 border border-dashed border-slate-300 rounded-2xl">
            No hay productos químicos registrados en el inventario.
          </div>
        ) : products.map((item: any) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-black text-slate-800 text-lg leading-tight">{item.name}</h3>
                {item.casNumber && <p className="text-xs text-slate-500 font-medium">CAS: {item.casNumber}</p>}
              </div>
              <div className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                item.warningWord === "PELIGRO" ? "bg-red-100 text-red-800" : 
                item.warningWord === "ATENCIÓN" ? "bg-amber-100 text-amber-800" : 
                "bg-slate-100 text-slate-600"
              }`}>
                {item.warningWord || "N/A"}
              </div>
            </div>

            {/* Pictogramas */}
            {item.pictograms && item.pictograms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.pictograms.map((pic: string) => (
                  <div key={pic} className="w-10 h-10 bg-white border-2 border-red-500 rounded-lg flex items-center justify-center text-xl shadow-sm rotate-45 transform origin-center scale-75">
                    <span className="-rotate-45 block">{PICTOGRAMS[pic] || "⚠️"}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 space-y-2">
              <div>
                <span className="font-bold text-slate-500 block mb-1">Uso:</span>
                {item.commonUse || "No especificado"}
              </div>
              <div>
                <span className="font-bold text-slate-500 block mb-1">Ubicación:</span>
                {item.storageLocation || "No especificada"}
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {item.fdsUrl ? (
                  <a href={item.fdsUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                    <FileText size={14} />
                    Ver FDS
                  </a>
                ) : (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg">
                    <AlertTriangle size={14} />
                    FDS Pendiente
                  </span>
                )}
                {item.fdsCompliant && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1.5 rounded-lg" title="Cumple SGA/IRAM">
                    ✓ SGA
                  </span>
                )}
              </div>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
