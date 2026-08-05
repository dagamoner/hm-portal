"use client";

import React, { useState, useTransition } from "react";
import { PieChart, Download, FileText, Calendar as CalendarIcon, Clock, HardHat, AlertTriangle, ShieldCheck } from "lucide-react";
import { generateReportData, saveManagementReport } from "@/app/actions/reports-book";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/components/providers/AuthProvider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ReportesClient({ companyId, companyName, initialReports }: { companyId: string, companyName: string, initialReports: any[] }) {
    const { user } = useAuth();
    const [isPending, startTransition] = useTransition();
    const [reports, setReports] = useState(initialReports);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [periodDate, setPeriodDate] = useState(new Date().toISOString().substring(0, 10));
    const [reportType, setReportType] = useState<'SEMANAL' | 'MENSUAL'>('MENSUAL');

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const data = await generateReportData(companyId, reportType, new Date(periodDate));
            if (!data) throw new Error("Error al consultar datos");
            
            const periodStr = reportType === 'MENSUAL' 
                ? format(new Date(periodDate), "MMMM yyyy", { locale: es }) 
                : `Semana del ${format(data.startDate, "dd/MM")} al ${format(data.endDate, "dd/MM")}`;

            // Save to DB
            const res = await saveManagementReport(companyId, {
                type: reportType,
                period: periodStr,
                workedHours: data.workedHours,
                incidentsCount: data.incidentsCount,
                inspectionsCount: data.inspectionsCount,
                trainedWorkers: data.trainedWorkers,
                generatedBy: user?.name || "Sistema"
            });

            if (res.success && res.report) {
                setReports([res.report, ...reports]);
            }

            // Generate PDF
            generatePDF(data, periodStr);

        } catch (error) {
            console.error(error);
            alert("Hubo un error al generar el reporte.");
        } finally {
            setIsGenerating(false);
        }
    };

    const generatePDF = (data: any, periodStr: string) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        
        // Colores y Configuración
        const primaryColor = [245, 158, 11]; // Amber-500 (Yellow)
        const darkColor = [30, 41, 59]; // Slate-800
        const lightColor = [248, 250, 252]; // Slate-50

        // --- ENCABEZADO ---
        doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("MH", 14, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Consultora Integral", 14, 32);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("REPORTE GERENCIAL HySL", pageWidth - 14, 22, { align: "right" });
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Empresa/Obra: ${companyName}`, pageWidth - 14, 30, { align: "right" });

        // --- DATOS DEL REPORTE ---
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(`Periodo: ${periodStr.toUpperCase()}`, 14, 55);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Generado por: ${user?.name || 'Sistema'}`, 14, 62);
        doc.text(`Fecha de Emisión: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 68);

        // --- TABLA DE MÉTRICAS ---
        autoTable(doc, {
            startY: 80,
            head: [['Métrica de Gestión', 'Valor Registrado']],
            body: [
                ['Total de Incidentes / Accidentes', data.incidentsCount.toString()],
                ['Inspecciones / Visitas Realizadas', data.inspectionsCount.toString()],
                ['Trabajadores Capacitados', data.trainedWorkers.toString()],
                ['Horas Trabajadas (Aprox)', data.workedHours.toString()]
            ],
            theme: 'striped',
            headStyles: { fillColor: primaryColor as any, textColor: [255, 255, 255] },
            styles: { fontSize: 11, cellPadding: 8 },
            alternateRowStyles: { fillColor: [254, 252, 232] } // Yellow-50
        });

        // --- GRÁFICO PLACEHOLDER O RESUMEN ---
        const finalY = (doc as any).lastAutoTable.finalY + 20;
        
        doc.setFillColor(254, 252, 232); // bg-yellow-50
        doc.setDrawColor(253, 230, 138); // border-yellow-200
        doc.roundedRect(14, finalY, pageWidth - 28, 40, 3, 3, 'FD');
        
        doc.setTextColor(146, 64, 14); // text-yellow-800
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Conclusión del Periodo", 20, finalY + 12);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const conclusionText = data.incidentsCount === 0 
            ? "Excelente desempeño en seguridad. Se mantiene el objetivo de Cero Accidentes. Se sugiere continuar con los planes de capacitación programados." 
            : `Atención: Se han registrado ${data.incidentsCount} incidentes en este periodo. Es prioritario reforzar las inspecciones preventivas en campo y las capacitaciones de refuerzo.`;
        
        const splitTitle = doc.splitTextToSize(conclusionText, pageWidth - 40);
        doc.text(splitTitle, 20, finalY + 22);

        // --- PIE DE PÁGINA ---
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text("Este documento es de uso interno y confidencial. Generado automáticamente por MH Consultora Portal.", pageWidth / 2, 280, { align: "center" });

        // Save
        doc.save(`MH_Reporte_${reportType}_${companyName.replace(/\s+/g, '_')}_${format(new Date(), "yyyyMMdd")}.pdf`);
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div className="p-4 bg-yellow-100 text-yellow-600 rounded-2xl">
                    <PieChart className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Informes Gerenciales / Oficiales</h2>
                    <p className="text-slate-500 font-medium">Generación automática de PDF con métricas del periodo e historial de descargas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* PANEL DE GENERACIÓN */}
                <div className="md:col-span-1 bg-white border-2 border-yellow-200 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-yellow-50 p-6 border-b border-yellow-100">
                        <h3 className="font-bold text-yellow-800 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Nuevo Informe
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Tipo de Informe</label>
                            <select value={reportType} onChange={e => setReportType(e.target.value as any)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500">
                                <option value="MENSUAL">Reporte Mensual</option>
                                <option value="SEMANAL">Reporte Semanal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Periodo Base</label>
                            <input type="date" value={periodDate} onChange={e => setPeriodDate(e.target.value)} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500" />
                            <p className="text-[10px] text-slate-500 mt-1 text-center">El sistema calculará las métricas tomando la semana o mes completo de esta fecha.</p>
                        </div>

                        <button 
                            onClick={handleGenerate} 
                            disabled={isGenerating}
                            className="w-full py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-colors flex justify-center items-center gap-2 shadow-lg shadow-yellow-500/20"
                        >
                            <Download className="w-5 h-5" />
                            {isGenerating ? "Generando..." : "Generar y Descargar PDF"}
                        </button>
                    </div>
                </div>

                {/* HISTORIAL */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="font-bold text-slate-800 px-2 flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-500" /> Historial de Informes Generados
                    </h3>
                    
                    {reports.length === 0 && (
                        <div className="text-center py-12 bg-white/60 border border-slate-200 rounded-3xl">
                            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-500">No hay informes generados.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4">
                        {reports.map((report: any) => (
                            <div key={report.id} className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:shadow-md transition-shadow">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-slate-800">{report.type === 'MENSUAL' ? 'Informe Mensual' : 'Informe Semanal'}</h4>
                                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase rounded-lg border border-yellow-200">{report.period}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                                        <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-rose-400" /> {report.incidentsCount} Incidentes</span>
                                        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-400" /> {report.inspectionsCount} Inspecciones</span>
                                        <span className="flex items-center gap-1"><HardHat className="w-3 h-3 text-indigo-400" /> {report.trainedWorkers} Capacitados</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{format(new Date(report.createdAt), "dd/MM/yyyy HH:mm")}</p>
                                    <p className="text-[10px] text-slate-400">Por {report.generatedBy}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

// Icono History temporal
function History(props: any) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
    )
}
