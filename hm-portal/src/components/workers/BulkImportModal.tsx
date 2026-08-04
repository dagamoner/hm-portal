"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Upload, X, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { bulkImportWorkers } from "@/app/actions/personal";
import { motion, AnimatePresence } from "framer-motion";
import * as xlsx from "xlsx";

interface BulkImportModalProps {
  companyId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function BulkImportModal({ companyId, isOpen, onClose }: BulkImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; count?: number; skippedCount?: number; skippedDetails?: string[]; error?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const ws = xlsx.utils.json_to_sheet([
      {
        Nombre: "Juan",
        Apellido: "Pérez",
        DNI: "20123456789", // CUIL o DNI
        Puesto: "Operario General",
      }
    ]);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Personal");
    
    // Set column widths for better UX
    ws["!cols"] = [{ wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 25 }];
    
    xlsx.writeFile(wb, "plantilla_personal.xlsx");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await bulkImportWorkers(companyId, formData);
    
    if (res.success) {
      setResult({
        success: true,
        count: res.count,
        skippedCount: res.skippedCount,
        skippedDetails: res.skippedDetails
      });
      setFile(null); // Clear file on success
    } else {
      setResult({ success: false, error: res.error });
    }
    
    setIsUploading(false);
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="text-indigo-600" />
            Carga Masiva de Personal
          </h2>
          <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!result?.success ? (
            <>
              {/* Step 1: Template */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                <h3 className="font-semibold text-indigo-900 mb-2 text-sm">Paso 1: Preparar archivo</h3>
                <p className="text-sm text-indigo-700/80 mb-3">
                  Descarga la plantilla Excel, completa los datos de tus empleados y guárdala. (DNI es obligatorio).
                </p>
                <Button onClick={handleDownloadTemplate} variant="outline" className="w-full bg-white border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  <FileSpreadsheet size={16} className="mr-2" />
                  Descargar Plantilla
                </Button>
              </div>

              {/* Step 2: Upload */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-2 text-sm">Paso 2: Subir archivo completado</h3>
                <input 
                  type="file" 
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={handleFileChange}
                />
                
                {!file ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors group"
                  >
                    <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">Click para seleccionar archivo</p>
                    <p className="text-xs text-slate-500">Solo archivos Excel (.xlsx)</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileSpreadsheet className="text-emerald-500 shrink-0" size={24} />
                      <div className="truncate">
                        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setFile(null)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                      title="Eliminar archivo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {result?.error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <p>{result.error}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">¡Importación Exitosa!</h3>
              
              <div className="bg-slate-50 rounded-xl p-4 text-left mt-4 space-y-2">
                <p className="text-sm text-slate-700">
                  <span className="font-bold text-emerald-600">{result.count}</span> empleados nuevos agregados correctamente.
                </p>
                
                {(result.skippedCount ?? 0) > 0 && (
                  <>
                    <p className="text-sm text-slate-700 pt-2 border-t border-slate-200">
                      <span className="font-bold text-amber-600">{result.skippedCount}</span> empleados fueron omitidos porque su DNI ya estaba registrado.
                    </p>
                    <div className="mt-2 text-xs text-slate-500 max-h-32 overflow-y-auto bg-white p-2 rounded border border-slate-100">
                      <ul className="list-disc pl-4 space-y-1">
                        {result.skippedDetails?.map((d, i) => (
                          <li key={i}>{d}</li>
                        ))}
                        {(result.skippedCount ?? 0) > 10 && (
                          <li className="italic">...y {(result.skippedCount ?? 0) - 10} más.</li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            {result?.success ? "Cerrar" : "Cancelar"}
          </Button>
          {!result?.success && (
            <Button onClick={handleSubmit} disabled={!file || isUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Importando...
                </>
              ) : (
                "Importar Datos"
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
