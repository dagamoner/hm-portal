import React from 'react';
import { ClipboardCheck, Download, AlertCircle, Eye, Building2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const formatDate = (dateString: string | Date) => {
  return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(dateString));
};

export default function VisitsList({ visits }: { visits: any[] }) {
  if (visits.length === 0) {
    return (
      <div className="text-center py-10">
        <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500 font-medium">No se han registrado visitas aún.</p>
      </div>
    );
  }

  const exportPdf = (visit: any) => {
    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('ACTA DE VISITA - HIGIENE Y SEGURIDAD', pageWidth / 2, 40, { align: 'center' });
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Fecha: ${formatDate(visit.date)}`, 40, 70);
      doc.text(`Inspector: ${visit.inspectorName}`, 40, 85);
      if (visit.visitNumber) {
        doc.text(`Visita N°: ${visit.visitNumber}`, pageWidth - 40, 70, { align: 'right' });
      }
      
      doc.text(`Establecimiento / Obra: ${visit.establishment?.name || 'N/A'}`, 40, 100);
      doc.text(`Dirección: ${visit.establishment?.address || 'N/A'}`, 40, 115);

      // Checklist data
      let currentY = 140;
      
      if (visit.checklistData && Array.isArray(visit.checklistData)) {
        visit.checklistData.forEach((category: any) => {
          const bodyData = category.items.map((item: any) => [
            item.text,
            item.answer?.status || 'N/A',
            item.answer?.peligro || ''
          ]);

          (doc as any).autoTable({
            startY: currentY,
            head: [[category.category, 'ESTADO', 'OBSERVACIONES / PELIGROS']],
            body: bodyData,
            theme: 'grid',
            headStyles: { fillColor: [79, 70, 229], fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
              0: { cellWidth: 280 },
              1: { cellWidth: 50, halign: 'center' },
              2: { cellWidth: 'auto' }
            },
            margin: { left: 40, right: 40 }
          });
          currentY = (doc as any).lastAutoTable.finalY + 15;
        });
      }

      // Generales
      if (visit.observations) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Observaciones Generales:', 40, currentY);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(visit.observations, pageWidth - 80);
        doc.text(splitText, 40, currentY + 15);
        currentY += 15 + (splitText.length * 12);
      }

      if (visit.recommendedTrainings) {
        currentY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Próxima Capacitación Sugerida:', 40, currentY);
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(visit.recommendedTrainings, pageWidth - 80);
        doc.text(splitText, 40, currentY + 15);
      }

      // Signatures
      currentY = Math.max(currentY + 60, (doc as any).lastAutoTable?.finalY + 60 || 600);
      if (currentY > doc.internal.pageSize.getHeight() - 100) {
        doc.addPage();
        currentY = 100;
      }

      doc.setDrawColor(150);
      doc.line(70, currentY, 230, currentY);
      doc.line(pageWidth - 230, currentY, pageWidth - 70, currentY);
      
      doc.setFontSize(9);
      doc.text('Firma Responsable Empresa', 150, currentY + 15, { align: 'center' });
      doc.text('Firma Profesional HyS', pageWidth - 150, currentY + 15, { align: 'center' });
      doc.text(visit.inspectorName, pageWidth - 150, currentY + 30, { align: 'center' });

      doc.save(`Acta_Visita_${visit.establishment?.name || 'Local'}_${visit.date.split('T')[0]}.pdf`);
    } catch (e) {
      console.error(e);
      alert('Hubo un error al generar el PDF');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="pb-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Fecha / Inspector</th>
            <th className="pb-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Establecimiento</th>
            <th className="pb-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider">Desvíos</th>
            <th className="pb-3 px-4 text-xs font-black text-slate-400 uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {visits.map((visit) => {
            const date = new Date(visit.date);
            const numDesvios = visit.findings?.length || 0;
            const activos = visit.findings?.filter((f: any) => f.status !== 'CERRADO').length || 0;
            
            return (
              <tr key={visit.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="py-4 px-4 align-top">
                  <div className="font-bold text-slate-800">
                    {formatDate(date)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {visit.inspectorName}
                  </div>
                  {visit.visitNumber && (
                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">
                      Visita #{visit.visitNumber}
                    </div>
                  )}
                </td>
                <td className="py-4 px-4 align-top">
                  <div className="font-bold text-slate-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {visit.establishment?.name || 'N/A'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[200px]" title={visit.establishment?.address}>
                    {visit.establishment?.address || 'Sin dirección'}
                  </div>
                </td>
                <td className="py-4 px-4 align-top">
                  {numDesvios > 0 ? (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-bold ${activos > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {numDesvios} Hallazgos
                      </span>
                      {activos > 0 && (
                        <span className="text-[10px] text-rose-600 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {activos} Activos
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Sin desvíos</span>
                  )}
                </td>
                <td className="py-4 px-4 align-top text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => alert("Vista de detalles de acta en desarrollo")}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Ver Detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => exportPdf(visit)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Exportar Acta PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
