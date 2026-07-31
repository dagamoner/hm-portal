"use client";

import React from 'react';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut, Chart } from 'react-chartjs-2';
import { 
  AlertTriangle, CheckCircle, Clock, ShieldAlert, 
  Activity, Users, FileText, CheckSquare
} from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement
);

interface DashboardClientProps {
  data: any; // We'll pass the complex object here
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const { kpis, monthlyTrend, riskByEstArray, paretoData, agingData, eventsByShift, companyName } = data;

  // --- CHART OPTIONS & DATA CONVERSIONS ---

  // 1. Tendencia Mensual (IF e IG)
  const lineChartData = {
    labels: monthlyTrend?.map((m: any) => m.month) || [],
    datasets: [
      {
        label: 'Índice de Frecuencia',
        data: monthlyTrend?.map((m: any) => m.IF) || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Índice de Gravedad',
        data: monthlyTrend?.map((m: any) => m.IG) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
    ]
  };

  // 2. Riesgos por Establecimiento (Stacked Bar)
  const riskStackedData = {
    labels: riskByEstArray?.map((r: any) => r.name) || [],
    datasets: [
      { label: 'Bajo', data: riskByEstArray?.map((r: any) => r.low) || [], backgroundColor: '#22c55e' },
      { label: 'Medio', data: riskByEstArray?.map((r: any) => r.medium) || [], backgroundColor: '#eab308' },
      { label: 'Alto', data: riskByEstArray?.map((r: any) => r.high) || [], backgroundColor: '#f97316' },
      { label: 'Extremo', data: riskByEstArray?.map((r: any) => r.critical) || [], backgroundColor: '#ef4444' },
    ]
  };

  const stackedOptions = {
    responsive: true,
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };

  // 3. Pareto (Barras + Línea Acumulada)
  const paretoChartData = {
    labels: paretoData?.map((p: any) => p.cause) || [],
    datasets: [
      {
        type: 'line' as const,
        label: '% Acumulado',
        data: paretoData?.map((p: any) => p.cumulativePct) || [],
        borderColor: '#8b5cf6',
        backgroundColor: '#8b5cf6',
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: 'Cantidad',
        data: paretoData?.map((p: any) => p.count) || [],
        backgroundColor: '#3b82f6',
        yAxisID: 'y',
      }
    ]
  };

  const paretoOptions = {
    responsive: true,
    scales: {
      y: { type: 'linear' as const, display: true, position: 'left' as const },
      y1: { type: 'linear' as const, display: true, position: 'right' as const, grid: { drawOnChartArea: false }, max: 100 }
    }
  };

  // 4. Aging de Acciones (Barras)
  const agingChartData = {
    labels: agingData?.map((a: any) => a.category) || [],
    datasets: [{
      label: 'Acciones Pendientes',
      data: agingData?.map((a: any) => a.count) || [],
      backgroundColor: ['#22c55e', '#eab308', '#ef4444'],
    }]
  };

  // 5. Eventos por Turno (Doughnut)
  const shiftChartData = {
    labels: eventsByShift?.map((e: any) => e.name) || [],
    datasets: [{
      data: eventsByShift?.map((e: any) => e.count) || [],
      backgroundColor: ['#3b82f6', '#f59e0b', '#1e293b'],
    }]
  };

  // 6. Gauge (Tacómetro) Helper
  const createGaugeData = (value: number, color: string) => ({
    datasets: [{
      data: [value, 100 - value],
      backgroundColor: [color, '#e2e8f0'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }]
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {companyName ? `Tablero de Control: ${companyName}` : 'Tablero Ejecutivo Global'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Métricas alineadas a Res. SRT 905/2015 e ISO 45004</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-500">
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Datos en tiempo real</span>
        </div>
      </div>

      {/* FILA 1: TARJETAS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Índice de Frecuencia" value={kpis?.frequencyRate} subtitle="Accidentes x 1M hs" icon={<Activity className="text-red-500" />} />
        <KpiCard title="Índice de Gravedad" value={kpis?.severityRate} subtitle="Días perdidos x 1M hs" icon={<Clock className="text-blue-500" />} />
        <KpiCard title="Días Perdidos Totales" value={kpis?.lostDays} subtitle="Últimos 12 meses" icon={<FileText className="text-slate-500" />} />
        <KpiCard title="Riesgos Críticos Abiertos" value={kpis?.openCriticalRisks} subtitle="Sin control eficaz" icon={<AlertTriangle className="text-orange-500" />} />
        
        <KpiCard title="Acciones Vencidas" value={kpis?.overdueActions} subtitle="Críticas fuera de plazo" icon={<ShieldAlert className="text-red-600" />} />
        <KpiCard title="% Cierre en Término" value={`${kpis?.pctClosedOnTime}%`} subtitle="Eficacia de gestión" icon={<CheckSquare className="text-emerald-500" />} />
        <KpiCard title="% Controles Verificados" value={`${kpis?.pctControlsVerified}%`} subtitle="En riesgos altos" icon={<CheckCircle className="text-blue-600" />} />
        <KpiCard title="Cobertura Preventiva" value={kpis?.totalInspections || 0} subtitle="Inspecciones ejecutadas" icon={<Users className="text-purple-500" />} />
      </div>

      {/* FILA 2: TENDENCIAS Y RIESGOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
          <h3 className="text-slate-800 font-semibold mb-4 text-sm uppercase tracking-wider">Tendencia Mensual (IF e IG)</h3>
          <Line data={lineChartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-800 font-semibold mb-4 text-sm uppercase tracking-wider">Pareto de Causas</h3>
          <Chart type="bar" data={paretoChartData} options={paretoOptions} />
        </div>
      </div>

      {/* FILA 3: OPERACIONES Y AGING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-800 font-semibold mb-4 text-sm uppercase tracking-wider">Riesgos por Establecimiento</h3>
          <Bar data={riskStackedData} options={stackedOptions} />
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-800 font-semibold mb-4 text-sm uppercase tracking-wider">Antigüedad de Acciones Abiertas</h3>
          <Bar data={agingChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-800 font-semibold mb-4 text-sm uppercase tracking-wider">Eventos por Turno</h3>
          <div className="w-2/3 mx-auto">
            <Doughnut data={shiftChartData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* FILA 4: GAUGES (TACÓMETROS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <GaugeCard title="Cierre en Término" value={kpis?.pctClosedOnTime || 0} color="#10b981" />
        <GaugeCard title="Controles Críticos Eficaces" value={kpis?.pctControlsVerified || 0} color="#3b82f6" />
      </div>

    </div>
  );
}

// --- SUBCOMPONENTES ---

function KpiCard({ title, value, subtitle, icon }: { title: string, value: string | number, subtitle: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
      </div>
      <p className="text-xs text-slate-400 mt-3">{subtitle}</p>
    </div>
  );
}

function GaugeCard({ title, value, color }: { title: string, value: number, color: string }) {
  const gaugeData = {
    datasets: [{
      data: [value, 100 - value],
      backgroundColor: [color, '#f1f5f9'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }]
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center">
      <h3 className="text-slate-800 font-semibold mb-4 text-sm uppercase tracking-wider w-full text-center">{title}</h3>
      <div className="relative w-3/4 aspect-[2/1]">
        <Doughnut 
          data={gaugeData} 
          options={{ 
            responsive: true, 
            cutout: '80%', 
            plugins: { tooltip: { enabled: false }, legend: { display: false } } 
          }} 
        />
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <span className="text-3xl font-bold text-slate-700">{value}%</span>
        </div>
      </div>
    </div>
  );
}
