"use client";

import { Download, FileDown, ShieldCheck, Wrench, AlertCircle, FileText, CheckSquare } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function DiagnosisClient({ vehicle, diagnosis, companyId }: { vehicle: any, diagnosis: any, companyId: string }) {

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ vehicle, diagnosis }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ficha_tecnica_${vehicle.plate}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(20);
    doc.text(`Ficha Técnica: ${vehicle.plate}`, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Vehicle Data
    autoTable(doc, {
      startY: 35,
      head: [['Dato', 'Valor']],
      body: [
        ['Tipo', vehicle.type],
        ['Marca y Modelo', `${vehicle.brand} ${vehicle.model}`],
        ['Año de Fabricación', vehicle.year.toString()],
        ['Uso Acumulado', vehicle.mileage ? `${vehicle.mileage} km` : `${vehicle.hours} horas`],
        ['Estado Operativo', vehicle.status],
        ['Aptitud Global Técnica', `${diagnosis.score}%`]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;

    // Priority Maintenance
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Atención Prioritaria Recomendada", 14, currentY);
    currentY += 8;
    
    diagnosis.priority.forEach((p: string) => {
      doc.setFontSize(10);
      doc.setTextColor(80);
      const splitText = doc.splitTextToSize(`• ${p}`, pageWidth - 28);
      doc.text(splitText, 14, currentY);
      currentY += (splitText.length * 5) + 2;
    });

    currentY += 10;
    if (currentY > 250) { doc.addPage(); currentY = 20; }

    // Operator Reqs
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Requisitos Legales del Operador", 14, currentY);
    currentY += 8;
    
    diagnosis.reqs.forEach((r: string) => {
      doc.setFontSize(10);
      doc.setTextColor(80);
      const splitText = doc.splitTextToSize(`• ${r}`, pageWidth - 28);
      doc.text(splitText, 14, currentY);
      currentY += (splitText.length * 5) + 2;
    });

    doc.save(`ficha_tecnica_${vehicle.plate}.pdf`);
  };

  const scoreColor = diagnosis.score >= 80 ? 'text-emerald-500' : diagnosis.score >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = diagnosis.score >= 80 ? 'bg-emerald-50' : diagnosis.score >= 50 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-3 mb-6">
        <button onClick={handleExportJSON} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          <FileDown className="w-4 h-4" />
          <span>Exportar JSON</span>
        </button>
        <button onClick={handleExportPDF} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4" />
          <span>Ficha Oficial PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* SCORE CARD */}
        <div className={`md:col-span-1 p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center ${scoreBg}`}>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">Aptitud Global</p>
            <h2 className={`text-6xl font-black ${scoreColor}`}>{diagnosis.score}%</h2>
            <p className="text-slate-500 text-sm mt-4">Basado en análisis de desgaste, tipo y año.</p>
          </div>
        </div>

        {/* ATENCIÓN PRIORITARIA */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 mb-4">
            <Wrench className="w-5 h-5 text-amber-500" />
            <span>Atención Prioritaria</span>
          </h3>
          <ul className="space-y-3">
            {diagnosis.priority.map((p: string, idx: number) => (
              <li key={idx} className="flex items-start space-x-3 text-slate-700 bg-slate-50 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CHECKLIST PREDICTIVO */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 mb-4">
            <CheckSquare className="w-5 h-5 text-blue-500" />
            <span>Checklist Predictivo Diario (Pre-Uso)</span>
          </h3>
          <div className="space-y-4">
            {diagnosis.checklist.map((c: any, idx: number) => (
              <div key={idx} className="flex flex-col border-b border-slate-100 pb-3 last:border-0">
                <span className="font-semibold text-slate-700 text-sm">{c.item}</span>
                <span className="text-xs text-slate-500 mt-1">Motivo: {c.reason}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* REQUISITOS OPERADOR */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-purple-500" />
              <span>Requisitos del Operador</span>
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
              {diagnosis.reqs.map((r: string, idx: number) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>

          {/* PROTOCOLOS Y ERGONOMIA */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Protocolo de Seguridad y Ergonomía</span>
            </h3>
            <ul className="space-y-3">
              {[...diagnosis.rules, ...diagnosis.ergonomics].map((r: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
