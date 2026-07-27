"use client";

import { useState, useRef } from "react";
import { Download, TableProperties, LayoutDashboard, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import DashboardPanel from "./components/DashboardPanel";
import DataTablePanel from "./components/DataTablePanel";

// Utility to flatten the hierarchy into an array of rows
function flattenMatrix(company: any) {
    const rows: any[] = [];
    company.establishments?.forEach((est: any) => {
        est.sectors?.forEach((sec: any) => {
            sec.processes?.forEach((proc: any) => {
                proc.jobRoles?.forEach((role: any) => {
                    role.tasks?.forEach((task: any) => {
                        if (!task.hazards || task.hazards.length === 0) {
                            rows.push({
                                establishment: est.name,
                                sector: sec.name,
                                process: proc.name,
                                role: role.name,
                                task: task.name,
                                hazardName: '-',
                                hazardType: '-',
                                p: '-', s: '-', r: '-', level: '-',
                                control: '-', action: '-'
                            });
                        } else {
                            task.hazards.forEach((haz: any) => {
                                const ev = haz.evaluations?.[0];
                                let p = ev?.probability || 0;
                                let s = ev?.severity || 0;
                                let r = p * s;
                                let level = '-';
                                let color = 'text-slate-500';
                                
                                if (r > 0 && r <= 4) { level = 'Bajo'; color = 'text-emerald-600'; }
                                else if (r > 4 && r <= 8) { level = 'Medio'; color = 'text-yellow-600'; }
                                else if (r > 8 && r <= 16) { level = 'Alto'; color = 'text-orange-600'; }
                                else if (r > 16) { level = 'Crítico'; color = 'text-rose-600'; }

                                const action = ev?.improvementActions?.[0] ? ev.improvementActions[0].description : '-';
                                const actionStatus = ev?.improvementActions?.[0] ? ev.improvementActions[0].status : '-';

                                rows.push({
                                    id: haz.id,
                                    establishment: est.name,
                                    sector: sec.name,
                                    process: proc.name,
                                    role: role.name,
                                    task: task.name,
                                    hazardName: haz.name,
                                    hazardType: haz.type || 'Otro',
                                    p: p || '-',
                                    s: s || '-',
                                    r: r || '-',
                                    level,
                                    color,
                                    control: ev?.controlMeasures || '-',
                                    action,
                                    actionStatus
                                });
                            });
                        }
                    });
                });
            });
        });
    });
    return rows;
}

export default function MatrizClient({ company }: { company: any }) {
    const [view, setView] = useState<'dashboard' | 'table'>('dashboard');
    const [selectedEst, setSelectedEst] = useState<string>('all');
    const [isExporting, setIsExporting] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const allRows = flattenMatrix(company);
    const rows = selectedEst === 'all' ? allRows : allRows.filter(r => r.establishment === selectedEst);
    
    // Extraer lista de establecimientos únicos
    const uniqueEstablishments = Array.from(new Set(allRows.map(r => r.establishment))).filter(e => e !== '-');

    const handleExportPDF = () => {
        // Hacemos que toda la aplicación oculte lo innecesario al imprimir mediante una clase en el body
        document.body.classList.add('print-matriz');
        
        // Agregar estilos de impresión si no existen
        if (!document.getElementById('print-styles')) {
            const style = document.createElement('style');
            style.id = 'print-styles';
            style.innerHTML = `
                @media print {
                    body * { visibility: hidden; }
                    .print-matriz-content, .print-matriz-content * { visibility: visible; }
                    .print-matriz-content { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                    @page { size: landscape; margin: 10mm; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            window.print();
            document.body.classList.remove('print-matriz');
        }, 100);
    };

    return (
        <div className="space-y-6 max-w-full">
            {/* Encabezado Principal */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                        <TableProperties className="w-8 h-8 text-indigo-600" />
                        Matriz Global de Riesgos
                    </h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                        Consolidado de todas las evaluaciones de {company.fantasyName || company.businessName}.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <select
                        value={selectedEst}
                        onChange={(e) => setSelectedEst(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Todos los Establecimientos</option>
                        {uniqueEstablishments.map(est => (
                            <option key={est} value={est}>{est}</option>
                        ))}
                    </select>

                    <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1">
                        <button 
                            onClick={() => setView('dashboard')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'dashboard' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </button>
                        <button 
                            onClick={() => setView('table')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${view === 'table' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <TableProperties className="w-4 h-4" /> Tabla Completa
                        </button>
                    </div>
                    
                    <button 
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> 
                        {isExporting ? 'Generando PDF...' : 'Descargar PDF'}
                    </button>
                </div>
            </div>

            {/* Contenedor que será exportado a PDF */}
            <div ref={contentRef} className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 min-h-[600px] print-matriz-content">
                {/* Logo MH para el PDF - Solo visible en el canvas si le damos estilo inline o condicional, pero por ahora lo dejamos visible como un header interno */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-black text-xl">MH</span>
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800">Matriz IPERC</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase">{company.businessName}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Fecha de Emisión</p>
                        <p className="font-bold text-slate-700">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {view === 'dashboard' ? (
                    <DashboardPanel rows={rows} company={company} />
                ) : (
                    <DataTablePanel rows={rows} />
                )}
            </div>
        </div>
    );
}
