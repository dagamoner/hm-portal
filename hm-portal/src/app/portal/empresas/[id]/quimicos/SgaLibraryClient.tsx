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
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-slate-800 truncate" title={item.name}>{item.name}</h3>
            
            <div className="flex gap-2 mt-4">
              {item.fdsUrl && (
                <a href={item.fdsUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold text-center transition-colors">
                  FDS
                </a>
              )}
              {item.labelUrl && (
                <a href={item.labelUrl} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold text-center transition-colors border border-slate-200">
                  Etiqueta
                </a>
              )}
            </div>
            
            {item.pictograms && JSON.parse(item.pictograms).length > 0 && (
              <button 
                onClick={() => setSelectedItem(item)}
                className="w-full mt-2 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-xl text-xs font-bold text-center transition-colors border border-amber-200"
              >
                Ver Pictogramas
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedItem.name}</h3>
            <p className="text-sm text-slate-500 mb-8">Pictogramas de peligro (SGA)</p>
            
            <div className="flex flex-wrap justify-center gap-6">
              {JSON.parse(selectedItem.pictograms).map((code: string) => (
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
