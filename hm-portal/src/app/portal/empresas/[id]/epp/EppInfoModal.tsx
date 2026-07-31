"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";

export function EppInfoModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors border border-indigo-100"
      >
        <Info className="w-4 h-4" />
        Procedimiento
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                Procedimiento: Entrega de E.P.P. (Res 299/2011)
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <section>
                <h3 className="text-base font-bold text-slate-800 mb-2">1. Importancia y Obligatoriedad</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  La <strong>Resolución 299/2011</strong> de la SRT establece la obligación de los empleadores de proveer Elementos de Protección Personal (E.P.P.) y Ropa de Trabajo confiables a los trabajadores. El registro formal de esta entrega exime de responsabilidad ante accidentes si el trabajador no utilizó el elemento provisto, y es requerido obligatoriamente por la ART y autoridades de inspección.
                </p>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-800 mb-2">2. Proceso de Llenado en el Sistema</h3>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1.5 ml-2">
                  <li>Ingresar a la ficha del trabajador seleccionado.</li>
                  <li>Los datos de la empresa y del trabajador se autocompletarán con la información del sistema.</li>
                  <li>Agregar una fila por cada elemento entregado (ej. Zapatos de seguridad, Casco, Guantes).</li>
                  <li>Indicar si el elemento posee <strong>Certificación Obligatoria</strong> (Sello S).</li>
                  <li>Completar la fecha exacta de entrega de ese elemento.</li>
                  <li>Hacer clic en <strong>"Guardar Planilla"</strong>.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-bold text-slate-800 mb-2">3. Firma y Archivo Físico</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Aunque el sistema guarda el registro digital (afectando positivamente el <em>Safety Score</em> del trabajador), la Resolución requiere la <strong>firma autógrafa (física)</strong> del trabajador. El procedimiento es:
                </p>
                <ol className="list-decimal list-inside text-sm text-slate-600 space-y-2 mt-3 ml-2">
                  <li>Llenar toda la planilla en el sistema y guardarla.</li>
                  <li>Hacer clic en el botón <strong>"Imprimir Planilla"</strong> para generar el PDF legal.</li>
                  <li>Imprimir el documento generado.</li>
                  <li>Hacer firmar el documento al trabajador.</li>
                  <li>Marcar la casilla <strong>"Firmado"</strong> en el sistema para control interno.</li>
                  <li><strong>Archivar el documento físico</strong> en el Legajo del trabajador.</li>
                </ol>
              </section>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
