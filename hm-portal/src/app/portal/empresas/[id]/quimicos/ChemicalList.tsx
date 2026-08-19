"use client";
import { useState } from "react";

import { Trash2, FileText, Download, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { deleteChemicalProduct } from "@/app/actions/chemicals";
import { useAuth } from "@/components/providers/AuthProvider";
import toast from "react-hot-toast";

import { SgaPictogram } from "@/components/ui/SgaPictograms";

export function ChemicalList({ companyId, products, setProducts, sgaLibrary = [] }: any) {
  const { isClient } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // For modal

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
        ) : products.map((item: any) => {
          const libraryItem = sgaLibrary.find((l: any) => l.name.toLowerCase() === item.name.toLowerCase());
          const rawPictograms = libraryItem?.pictograms;
          const pictograms = Array.isArray(rawPictograms) 
            ? rawPictograms 
            : (typeof rawPictograms === 'string' ? JSON.parse(rawPictograms) : []);

          return (
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

            <div className="flex flex-col gap-2 mt-auto pt-2 border-t border-slate-100">
              <div className="flex gap-2">
                {libraryItem?.fdsUrl ? (
                  <a href={libraryItem.fdsUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-lg transition-colors">
                    <FileText size={14} />
                    Ver FDS
                  </a>
                ) : (
                  <span className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">
                    <AlertTriangle size={14} />
                    Sin FDS
                  </span>
                )}
                {libraryItem?.labelUrl ? (
                  <a href={libraryItem.labelUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors">
                    <Download size={14} />
                    Etiqueta
                  </a>
                ) : (
                  <span className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-2 rounded-lg">
                    <AlertTriangle size={14} />
                    Sin Etiqueta
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedProduct({ item, pictograms })}
                  disabled={pictograms.length === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 px-3 py-2 rounded-lg transition-colors"
                >
                  <Info size={14} />
                  Mostrar Pictograma
                </button>
                {!isClient && (
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Pictogram Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedProduct.item.name}</h3>
            <p className="text-sm text-slate-500 mb-8">Pictogramas de peligro (SGA)</p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {selectedProduct.pictograms.map((code: string) => (
                <SgaPictogram key={code} code={code} size="lg" />
              ))}
            </div>
            
            <button 
              onClick={() => setSelectedProduct(null)}
              className="mt-10 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
