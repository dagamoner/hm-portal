"use client";

import { SgaPictogram, SgaCode } from "@/components/ui/SgaPictograms";
import { Download, Eye } from "lucide-react";
import { useState } from "react";

export function SgaLibraryClient({ items }: { items: any[] }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Biblioteca SGA Global</h2>
          <p className="text-sm text-slate-500">Catálogo maestro de compuestos químicos con FDS y Etiquetas.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const rawPictograms = item.pictograms;
          const pictograms = Array.isArray(rawPictograms) 
            ? rawPictograms 
            : (typeof rawPictograms === 'string' ? JSON.parse(rawPictograms) : []);

          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-black text-slate-800 text-lg leading-tight mb-2">{item.name}</h3>
                {item.casNumber && <p className="text-xs text-slate-500 mb-2">CAS: {item.casNumber}</p>}
                {item.warningWord && (
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold ${
                    item.warningWord === 'PELIGRO' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.warningWord}
                  </span>
                )}
              </div>
              
              <div className="mt-4 flex gap-2">
                <button 
                  onClick={() => setSelectedItem({ ...item, parsedPictograms: pictograms })}
                  disabled={pictograms.length === 0}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 px-3 py-2 rounded-lg transition-colors"
                >
                  <Eye size={14} />
                  Ver Detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedItem.name}</h3>
            {selectedItem.casNumber && <p className="text-sm text-slate-500 mb-4">CAS: {selectedItem.casNumber}</p>}
            
            <p className="text-sm text-slate-500 mb-4 border-b border-slate-100 pb-2">Pictogramas de peligro (SGA)</p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {selectedItem.parsedPictograms.map((code: string) => (
                <SgaPictogram key={code} code={code} size="lg" />
              ))}
            </div>
            
            <button 
              onClick={() => setSelectedItem(null)}
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
