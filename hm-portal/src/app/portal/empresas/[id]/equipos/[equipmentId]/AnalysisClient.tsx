"use client";

import { useState } from "react";
import { Download, FileDown, Wrench, AlertCircle, Calendar, Plus, Clock, Cpu, HeartPulse } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { createIntervention } from "@/app/actions/equipos";
import { useRouter } from "next/navigation";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalysisClient({ equipment, analysis, companyId }: { equipment: any, analysis: any, companyId: string }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'Preventivo',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await createIntervention(equipment.id, {
      ...formData,
      date: new Date(formData.date)
    });

    if (res.success) {
      setIsModalOpen(false);
      setFormData({ type: 'Preventivo', date: new Date().toISOString().split('T')[0], description: '' });
      router.refresh();
    }
    setLoading(false);
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify({ equipment, analysis }, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagnostico_${equipment.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text(`Informe Diagnóstico Predictivo`, 14, 20);
    doc.setFontSize(14);
    doc.text(`${equipment.name} (${equipment.category})`, 14, 28);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 34);
    
    autoTable(doc, {
      startY: 40,
      head: [['Métrica', 'Valor']],
      body: [
        ['Salud Operativa', `${analysis.health}%`],
        ['Riesgo de Falla Inminente', `${analysis.risk}%`],
        ['Ventana Crítica Estimada', analysis.window],
        ['Componente Crítico', analysis.component],
        ['Intervención Sugerida', analysis.suggestion]
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }
    });

    const currentY = (doc as any).lastAutoTable.finalY + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Historial de Intervenciones Recientes", 14, currentY);
    
    const interventionsTable = equipment.interventions.slice(0, 10).map((i: any) => [
      new Date(i.date).toLocaleDateString(),
      i.type,
      i.description
    ]);

    if (interventionsTable.length > 0) {
      autoTable(doc, {
        startY: currentY + 5,
        head: [['Fecha', 'Tipo', 'Descripción']],
        body: interventionsTable,
        theme: 'striped',
        headStyles: { fillColor: [100, 116, 139] }
      });
    }

    doc.save(`diagnostico_${equipment.id}.pdf`);
  };

  const healthColor = analysis.health >= 80 ? 'text-emerald-500' : analysis.health >= 50 ? 'text-amber-500' : 'text-red-500';
  
  // Gauge Data
  const gaugeData = {
    labels: ['Salud', 'Riesgo'],
    datasets: [{
      data: [analysis.health, 100 - analysis.health],
      backgroundColor: [analysis.health >= 80 ? '#10b981' : analysis.health >= 50 ? '#f59e0b' : '#ef4444', '#e2e8f0'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }]
  };

  // Historial Chart Data
  const preventivas = equipment.interventions.filter((i:any) => i.type === 'Preventivo').length;
  const correctivas = equipment.interventions.filter((i:any) => i.type === 'Correctivo').length;
  const predictivas = equipment.interventions.filter((i:any) => i.type === 'Predictivo').length;

  const barData = {
    labels: ['Preventivo', 'Correctivo', 'Predictivo'],
    datasets: [{
      label: 'Cantidad de Intervenciones',
      data: [preventivas, correctivas, predictivas],
      backgroundColor: ['#3b82f6', '#ef4444', '#8b5cf6'],
    }]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-3 mb-6">
        <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          <span>Registrar Intervención</span>
        </button>
        <button onClick={handleExportJSON} className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
          <FileDown className="w-4 h-4" />
          <span>Exportar JSON</span>
        </button>
        <button onClick={handleExportPDF} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Download className="w-4 h-4" />
          <span>Informe PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* HEALTH GAUGE */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Salud Operativa</h3>
          <div className="w-48 h-48 -mb-16">
            <Doughnut data={gaugeData} options={{ cutout: '75%', plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
          </div>
          <div className="absolute bottom-6 flex flex-col items-center">
            <span className={`text-4xl font-black ${healthColor}`}>{analysis.health}%</span>
          </div>
        </div>

        {/* ANÁLISIS PREDICTIVO */}
        <div className="md:col-span-2 bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-slate-100">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2 mb-6">
            <Cpu className="w-5 h-5 text-indigo-400" />
            <span>Motor Predictivo iA</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Riesgo de Falla Inminente</p>
              <div className="flex items-center space-x-2">
                <AlertCircle className={`w-5 h-5 ${analysis.risk > 50 ? 'text-red-400' : 'text-emerald-400'}`} />
                <span className="text-2xl font-bold">{analysis.risk}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Ventana Crítica</p>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-lg font-bold text-amber-50">{analysis.window}</span>
              </div>
            </div>

            <div className="col-span-2 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <div className="mb-3">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Componente Crítico Detectado</p>
                <p className="font-semibold text-white">{analysis.component}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Intervención Sugerida</p>
                <p className="text-sm text-indigo-200">{analysis.suggestion}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GRAFICO INTERVENCIONES */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Frecuencia de Intervenciones</h3>
          <div className="h-64">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* HISTORIAL BITACORA */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-slate-500" />
            <span>Bitácora Técnica</span>
          </h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 max-h-64">
            {equipment.interventions.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No hay intervenciones registradas.</p>
            ) : (
              equipment.interventions.map((i: any) => (
                <div key={i.id} className="flex flex-col border-l-2 pl-4 pb-2 border-slate-200 relative">
                  <div className={`absolute -left-1.5 top-1 w-3 h-3 rounded-full ${
                    i.type === 'Preventivo' ? 'bg-blue-500' :
                    i.type === 'Correctivo' ? 'bg-red-500' : 'bg-purple-500'
                  }`} />
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-bold text-slate-800">{i.type}</span>
                    <span className="text-xs text-slate-500">{new Date(i.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{i.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* MODAL NUEVA INTERVENCION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">Registrar Intervención</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Intervención</label>
                <select 
                  value={formData.type} 
                  onChange={e => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option>Preventivo</option>
                  <option>Correctivo</option>
                  <option>Predictivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción / Trabajo Realizado</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required 
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none" 
                  placeholder="Ej. Cambio de rodamientos principales y lubricación de pluma..."
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancelar</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2">
                  {loading ? 'Guardando...' : <><Wrench className="w-4 h-4" /><span>Registrar</span></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
