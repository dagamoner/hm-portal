"use client";

import { useState } from "react";
import { Download, CheckCircle, FileText, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { TrainingTopic } from "@/app/actions/programa-anual";
import { createDocument } from "@/app/actions/documents";
import { useRouter } from "next/navigation";

interface Props {
  companyId: string;
  companyName: string;
  topics: TrainingTopic[];
}

export default function ProgramaAnualClient({ companyId, companyName, topics }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const generateAndUploadPDF = async () => {
    setIsGenerating(true);
    setSuccess(false);

    try {
      // 1. Create PDF Document
      const doc = new jsPDF();
      
      // Constants
      const startY = 30;
      const pageWidth = doc.internal.pageSize.width;
      const margin = 14;

      // Add Title
      doc.setFontSize(16);
      doc.setTextColor(30, 58, 138); // Indigo 900
      const currentYear = new Date().getFullYear();
      doc.text(`Plan Anual de Capacitación ${currentYear}`, pageWidth / 2, startY, { align: 'center' });
      
      // Add Company Name subtitle
      doc.setFontSize(12);
      doc.setTextColor(100, 116, 139); // Slate 500
      doc.text(`Empresa: ${companyName}`, pageWidth / 2, startY + 8, { align: 'center' });

      // Add Text content
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text("Información general del procedimiento", margin, startY + 20);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("OBJETIVO", margin, startY + 28);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      const objectiveText = "El siguiente plan de capacitaciones tiene como objetivo formar mejores trabajadores además de capacitar a los colaboradores de la empresa en sistemas de gestión de la seguridad y salud en el trabajo para con ello disminuir la cantidad de incidentes que se puedan llegar a presentar dentro de la Empresa.";
      const splitObjective = doc.splitTextToSize(objectiveText, pageWidth - margin * 2);
      doc.text(splitObjective, margin, startY + 34);

      let nextY = startY + 34 + (splitObjective.length * 5);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("ALCANCE", margin, nextY + 6);
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      const scopeText = "El presente plan de capacitaciones va dirigido para todos los trabajadores de la empresa que se desempeñan en la producción además de quienes hacen parte de la administración de ésta.";
      const splitScope = doc.splitTextToSize(scopeText, pageWidth - margin * 2);
      doc.text(splitScope, margin, nextY + 12);

      nextY = nextY + 12 + (splitScope.length * 5);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("FLUJOGRAMA DE CAPACITACIÓN", margin, nextY + 8);
      
      doc.setTextColor(0, 0, 0);
      const flowchartText = "1. Alta dirección: Cronograma de capacitaciones -> 2. Contacto con personal capacitado -> 3. Ejecución de las capacitaciones -> 4. Evaluación de la efectividad.";
      doc.text(doc.splitTextToSize(flowchartText, pageWidth - margin * 2), margin, nextY + 14);

      nextY = nextY + 24;

      // First table (Descripción)
      doc.addPage();
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text("Descripción", margin, 20);

      autoTable(doc, {
        startY: 25,
        head: [['N actividad', 'Descripción', 'Responsable', 'Documentación', 'Medio almacenamiento']],
        body: [
          ['1', 'La alta dirección realizara el cronograma de capacitaciones que se llevaran a cabo en el año', 'Gerente general', 'Cronograma de capacitaciones', 'Electrónico'],
          ['2', 'Se contactará con personal capacitado para realizar las capacitaciones', 'Gerente general', '', ''],
          ['3', 'Ejecución de las capacitaciones', 'Jefe del SG-SST', '', ''],
          ['4', 'Evaluar la efectividad de las capacitaciones dada a los trabajadores', 'Jefe del SG-SST', 'Evaluación de capacitaciones', 'Electrónico']
        ],
        theme: 'grid',
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], lineColor: [203, 213, 225], lineWidth: 0.1 },
        styles: { fontSize: 9, cellPadding: 3, lineColor: [203, 213, 225], lineWidth: 0.1, textColor: [51, 65, 85] }
      });

      // Main Training Table
      const finalY = (doc as any).lastAutoTable.finalY + 15;
      
      doc.setFontSize(12);
      doc.setTextColor(30, 58, 138);
      doc.text(`PROGRAMA DE CAPACITACION ANUAL ${currentYear}`, pageWidth / 2, finalY, { align: 'center' });

      const tableBody = topics.map(t => [
        t.month,
        t.theme,
        t.target,
        t.typeInternal ? 'X' : '',
        t.typeExternal ? 'X' : ''
      ]);

      autoTable(doc, {
        startY: finalY + 8,
        head: [
          [
            { content: 'MES', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            { content: 'TEMA', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            { content: 'DIRIGIDO A NIVEL', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            { content: 'TIPO DE CAPACITACIÓN', colSpan: 2, styles: { halign: 'center' } }
          ],
          ['INTERNA / ONLINE', 'EXTERNA']
        ],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], lineColor: [203, 213, 225], lineWidth: 0.1 },
        styles: { fontSize: 8, cellPadding: 3, lineColor: [203, 213, 225], lineWidth: 0.1, textColor: [51, 65, 85], halign: 'center', valign: 'middle' },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 60, halign: 'left' },
          2: { cellWidth: 35 },
          3: { cellWidth: 35 },
          4: { cellWidth: 25 }
        }
      });

      // Add signature at the end
      const sigY = (doc as any).lastAutoTable.finalY + 40;
      doc.line(pageWidth - 80, sigY, pageWidth - 20, sigY);
      doc.setFontSize(9);
      doc.text("Lic. Dante Gabriel Moner", pageWidth - 50, sigY + 5, { align: 'center' });
      doc.text("Higiene y Seguridad Laboral", pageWidth - 50, sigY + 10, { align: 'center' });
      doc.text("MAT. 10.117-A", pageWidth - 50, sigY + 15, { align: 'center' });

      // 2. Download locally
      const fileName = `Plan_Anual_Capacitacion_${currentYear}_${companyName.replace(/\\s+/g, '_')}.pdf`;
      doc.save(fileName);

      // 3. Convert to File and upload to Documentation module
      const pdfBlob = doc.output('blob');
      const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
      
      const formData = new FormData();
      formData.append("title", `Programa Anual de Capacitación ${currentYear}`);
      formData.append("category", "LEGAL");
      formData.append("companyId", companyId);
      
      // Calculate Expiration Date (1 year from now)
      const expiration = new Date();
      expiration.setFullYear(expiration.getFullYear() + 1);
      formData.append("expirationDate", expiration.toISOString());
      
      formData.append("file", file);

      const res = await createDocument(formData);
      if (res?.error) {
        throw new Error(res.error);
      }

      setSuccess(true);
      router.refresh();

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Hubo un error al generar y guardar el documento.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Programa Anual de Capacitación
          </h2>
          <p className="text-slate-500 mt-1">Generación automática del plan basado en los riesgos inherentes de la empresa.</p>
        </div>
        <button 
          onClick={generateAndUploadPDF}
          disabled={isGenerating || success}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-md ${success ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
        >
          {isGenerating ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Generando...</>
          ) : success ? (
            <><CheckCircle className="w-5 h-5" /> ¡Guardado en Documentación!</>
          ) : (
            <><Download className="w-5 h-5" /> Generar y Descargar PDF</>
          )}
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
        <h3 className="font-bold text-slate-700 mb-4 uppercase text-xs tracking-wider">Vista previa de Temario Recomendado</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-200/50 text-slate-500">
              <tr>
                <th className="p-3 rounded-tl-lg font-semibold">Mes</th>
                <th className="p-3 font-semibold">Tema</th>
                <th className="p-3 rounded-tr-lg font-semibold">Dirigido A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topics.map((t, idx) => (
                <tr key={idx} className="hover:bg-white transition-colors">
                  <td className="p-3 font-medium text-slate-700">{t.month}</td>
                  <td className="p-3 text-slate-600">{t.theme}</td>
                  <td className="p-3 text-slate-500">{t.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400 mt-4 text-center">
          * La tabla anterior muestra las capacitaciones seleccionadas según los peligros registrados en la matriz de riesgos de {companyName}.
        </p>
      </div>
    </div>
  );
}
