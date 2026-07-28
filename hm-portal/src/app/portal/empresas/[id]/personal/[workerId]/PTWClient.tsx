"use client";

import { useState } from "react";
import { Download, FileSignature, AlertTriangle, ShieldCheck, CheckCircle, Clock } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { issuePTW, getPTWSuggestions } from "@/app/actions/personal";
import { useRouter } from "next/navigation";

export default function PTWClient({ companyId, worker }: { companyId: string, worker: any }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [taskDescription, setTaskDescription] = useState('');
  const [ast, setAst] = useState<any>(null);
  
  const handleAnalyzeTask = async () => {
    setLoading(true);
    const res = await getPTWSuggestions(taskDescription);
    if (res.success) {
      setAst(res.suggestions);
    }
    setLoading(false);
  };

  const handleIssuePTW = async () => {
    setLoading(true);
    // Vencimiento por defecto 12 horas desde ahora
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 12);
    
    const res = await issuePTW(worker.id, companyId, {
      taskDescription,
      hazards: ast.hazards,
      ppe: ast.ppe,
      preventions: ast.preventions,
      expirationDate
    });

    if (res.success) {
      setIsModalOpen(false);
      setTaskDescription('');
      setAst(null);
      router.refresh();
    }
    setLoading(false);
  };

  const handleExportPDF = (ptw: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175); // Blue-800
    doc.text(`PERMISO DE TRABAJO SEGURO (PTW)`, 14, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`ID del Permiso: ${ptw.id.split('-')[0].toUpperCase()}`, 14, 28);
    
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.text(`Sello: ${ptw.signatureId}`, 14, 34);
    
    autoTable(doc, {
      startY: 40,
      head: [['Datos del Ejecutante', 'Detalles']],
      body: [
        ['Nombre Completo', `${worker.firstName} ${worker.lastName}`],
        ['DNI', worker.documentId],
        ['Puesto/Función', (worker.laborData as any)?.position || 'N/A'],
        ['Safety Score', `${worker.safetyScore}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [71, 85, 105] }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("1. Descripción de la Tarea", 14, currentY);
    doc.setFontSize(10);
    doc.text(ptw.taskDescription, 14, currentY + 6);
    
    currentY += 15;

    autoTable(doc, {
      startY: currentY,
      head: [['2. Peligros Identificados (AST)']],
      body: ptw.hazards.map((h: string) => [h]),
      theme: 'grid',
      headStyles: { fillColor: [220, 38, 38] } // Red
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: currentY,
      head: [['3. Elementos de Protección Personal (EPP)']],
      body: ptw.ppe.map((p: string) => [p]),
      theme: 'grid',
      headStyles: { fillColor: [37, 99, 235] } // Blue
    });

    currentY = (doc as any).lastAutoTable.finalY + 10;

    autoTable(doc, {
      startY: currentY,
      head: [['4. Medidas Preventivas Obligatorias']],
      body: ptw.preventions.map((p: string) => [p]),
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] } // Emerald
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;

    doc.setFontSize(10);
    doc.text(`Emisión: ${new Date(ptw.issueDate).toLocaleString()}`, 14, currentY);
    doc.text(`Vencimiento: ${new Date(ptw.expirationDate).toLocaleString()}`, 100, currentY);
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Este documento es intransferible y debe permanecer en el área de trabajo hasta la finalización de la tarea.", 14, currentY + 15);

    doc.save(`PTW_${worker.documentId}_${ptw.id.split('-')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
          <FileSignature className="w-5 h-5 text-slate-500" />
          <span>Historial de Permisos (PTW)</span>
        </h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center space-x-2 shadow-sm shadow-red-200"
        >
          <FileSignature className="w-4 h-4" />
          <span>Emitir Nuevo PTW</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {worker.permits.map((ptw: any) => (
          <div key={ptw.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded flex items-center space-x-1 ${
                  new Date(ptw.expirationDate) > new Date() ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {new Date(ptw.expirationDate) > new Date() ? <><ShieldCheck className="w-3 h-3" /><span>Vigente</span></> : 'Vencido'}
                </span>
                <span className="text-xs text-slate-400 font-mono">{ptw.signatureId}</span>
              </div>
              <h3 className="text-base font-semibold text-slate-800">{ptw.taskDescription}</h3>
              <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Emisión: {new Date(ptw.issueDate).toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Vence: {new Date(ptw.expirationDate).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => handleExportPDF(ptw)}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-sm font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar Oficial</span>
            </button>
          </div>
        ))}
        {worker.permits.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
            <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">El trabajador no posee permisos de trabajo emitidos.</p>
          </div>
        )}
      </div>

      {/* MODAL EMISION PTW */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-red-50 text-red-900">
              <h2 className="text-xl font-bold flex items-center space-x-2">
                <FileSignature className="w-5 h-5" />
                <span>Emisión de PTW</span>
              </h2>
              <button onClick={() => { setIsModalOpen(false); setAst(null); setTaskDescription(''); }} className="text-red-400 hover:text-red-700">
                &times;
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción de la Tarea Crítica</label>
                <textarea 
                  value={taskDescription} 
                  onChange={e => setTaskDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="Ej. Reparación de válvula de presión a 4 metros de altura usando soldadura..."
                />
                
                {!ast && (
                  <button 
                    onClick={handleAnalyzeTask}
                    disabled={loading || taskDescription.length < 5}
                    className="mt-3 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 disabled:opacity-50 flex items-center space-x-2"
                  >
                    {loading ? 'Analizando...' : <><AlertTriangle className="w-4 h-4" /><span>Analizar Riesgos (AST)</span></>}
                  </button>
                )}
              </div>

              {ast && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-800 mb-2 flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" /> <span>Peligros Latentes Identificados</span>
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                      {ast.hazards.map((h:string, idx:number) => <li key={idx}>{h}</li>)}
                    </ul>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2 flex items-center space-x-1">
                      <ShieldCheck className="w-4 h-4" /> <span>EPP Obligatorios</span>
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
                      {ast.ppe.map((p:string, idx:number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>

                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2 flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" /> <span>Medidas de Prevención</span>
                    </h4>
                    <ul className="list-disc pl-5 text-sm text-emerald-700 space-y-1">
                      {ast.preventions.map((p:string, idx:number) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>

                  <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Validez del Permiso</p>
                      <p className="text-xs text-amber-700">Por normativa, el PTW se emitirá con una vigencia máxima de 12 horas desde este momento.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {ast && (
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
                <button type="button" onClick={() => { setIsModalOpen(false); setAst(null); }} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">
                  Cancelar
                </button>
                <button 
                  onClick={handleIssuePTW}
                  disabled={loading} 
                  className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                >
                  {loading ? 'Emitiendo...' : <><FileSignature className="w-4 h-4" /><span>Emitir con Sello Digital</span></>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
