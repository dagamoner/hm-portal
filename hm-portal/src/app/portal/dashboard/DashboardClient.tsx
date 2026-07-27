"use client";

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, Activity, TrendingUp, ShieldCheck, Users, Calendar, ClipboardCheck, Building2 } from 'lucide-react';

export interface DashboardData {
    companyName?: string;
    stats: {
        daysWithoutIncidents: string;
        frequencyRate: string;
        openIncidents: string;
        compliance: string;
    };
    chartData: any[];
    pieData: any[];
    pieTotal: string;
    auditedWorkers: string;
    monthlyInspections: string;
}

const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981'];

export default function DashboardClient({ data }: { data: DashboardData }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             {data.companyName && <Building2 className="w-8 h-8 text-indigo-600" />}
             {data.companyName ? `Panel Estratégico - ${data.companyName}` : "Panel Estratégico 365"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
             {data.companyName 
                ? "Visualización en tiempo real de indicadores críticos de seguridad para esta entidad." 
                : "Visualización en tiempo real de indicadores críticos de seguridad (Global)."}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/50">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">
              Periodo: {new Date().toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).replace('.', '')}
            </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: 'Días sin Accidentes', value: data.stats.daysWithoutIncidents, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-100', trend: '+12% vs mes anterior' },
            { label: 'Tasa de Frecuencia', value: data.stats.frequencyRate, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-100', trend: '-0.5% mejoría' },
            { label: 'Incidentes Abiertos', value: data.stats.openIncidents, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-100', trend: 'Prioridad Alta' },
            { label: 'Cumplimiento HSE', value: data.stats.compliance, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-100', trend: 'Certificación A' }
        ].map((stat, i) => (
            <div key={i} className="bg-white/60 backdrop-blur-xl p-7 rounded-[2rem] shadow-sm border border-white/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group overflow-hidden relative hover:-translate-y-1">
                <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                    <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-2xl w-fit mb-5 shadow-inner`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-500 font-extrabold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight mb-2">{stat.value}</p>
                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        {stat.trend}
                    </p>
                </div>
            </div>
        ))}
      </div>

      {/* Middle Section: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-black text-slate-900">Tendencia de Siniestralidad</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Reportes Mensuales Consolidados</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Incidentes</span>
                    </div>
                </div>
            </div>
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.chartData}>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748b', fontSize: 12, fontWeight: 700}} 
                        />
                        <Tooltip 
                            cursor={{fill: '#f8fafc'}} 
                            contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px', backgroundColor: 'rgba(255,255,255,0.9)' }}
                        />
                        <Bar dataKey="incidentes" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={45} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden border border-white/10">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <ShieldCheck className="w-32 h-32 text-indigo-400" />
            </div>
            <div className="relative z-10 h-full flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xl font-black text-white">Composición de Riesgos</h3>
                    <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest mt-1">Análisis por Categoría</p>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    fill="#8884d8"
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-black">{data.pieTotal}</span>
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    {data.pieData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2.5 bg-white/10 p-3 rounded-2xl border border-white/5 hover:bg-white/20 transition-colors">
                            <div className="w-3 h-3 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-200 uppercase truncate leading-none">{entry.name}</p>
                                <p className="text-[10px] font-bold text-indigo-400 mt-1">{entry.value}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Bottom Section: Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/50 flex items-center gap-6 group hover:-translate-y-1 transition-transform">
            <div className="p-5 bg-indigo-100 text-indigo-600 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <Users className="w-8 h-8" />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-extrabold uppercase tracking-[0.2em] mb-1">Fuerza Laboral Auditada</p>
                <h4 className="text-2xl font-black text-slate-800">{data.auditedWorkers} Operarios</h4>
                <p className="text-xs text-indigo-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Capacitación Vigente
                </p>
            </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-white/50 flex items-center gap-6 group hover:-translate-y-1 transition-transform">
            <div className="p-5 bg-emerald-100 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                <ClipboardCheck className="w-8 h-8" />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-extrabold uppercase tracking-[0.2em] mb-1">Inspecciones del Mes</p>
                <h4 className="text-2xl font-black text-slate-800">{data.monthlyInspections} Auditorías</h4>
                <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> +14% vs Objetivo de Junio
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}
