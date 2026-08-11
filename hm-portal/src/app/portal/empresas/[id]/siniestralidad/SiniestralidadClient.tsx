"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown, Users, Clock, AlertTriangle, Calendar, Download, Edit2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

export function SiniestralidadClient({ 
  companyId, 
  realStats 
}: { 
  companyId: string, 
  realStats: { 
    trabajadoresPromedio: number, 
    hhtMensuales: number, 
    accidentesTotales: number, 
    diasPerdidos: number 
  } 
}) {
  const { isClient } = useAuth();
  
  // Usamos los datos reales provenientes de la base de datos
  const stats = realStats;

  // Fórmulas oficiales SRT
  // II = (Accidentes / Trabajadores) * 1000
  const indiceIncidencia = stats.trabajadoresPromedio > 0 
    ? ((stats.accidentesTotales / stats.trabajadoresPromedio) * 1000).toFixed(1) 
    : "0.0";
  
  // IF = (Accidentes / HHT) * 1.000.000
  const indiceFrecuencia = stats.hhtMensuales > 0 
    ? ((stats.accidentesTotales / stats.hhtMensuales) * 1000000).toFixed(1) 
    : "S/D";
  
  // IG = (Días perdidos / HHT) * 1000
  const indiceGravedad = stats.hhtMensuales > 0 
    ? ((stats.diasPerdidos / stats.hhtMensuales) * 1000).toFixed(2) 
    : "S/D";

  return (
    <div className="flex flex-col gap-6">
      
      {/* Resumen Anual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Índice Incidencia (II)</h3>
            <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <TrendingDown className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{indiceIncidencia}</p>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> 12% vs año anterior
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Índice Frecuencia (IF)</h3>
            <span className="p-2 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg">
              <ActivityIcon className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{indiceFrecuencia}</p>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> 5% vs promedio sector
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400">Índice Gravedad (IG)</h3>
            <span className="p-2 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <p className="text-3xl font-black text-slate-800 dark:text-white mb-1">{indiceGravedad}</p>
          <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> 2% vs año anterior
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-950 rounded-2xl p-5 shadow-sm flex flex-col justify-between text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
            <Download className="w-16 h-16" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-300">Reporte SRT</h3>
            <p className="text-xl font-black mt-1 leading-tight">Generar Declaración Jurada</p>
          </div>
          <button className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold rounded-lg transition-colors w-fit">
            Descargar PDF
          </button>
        </div>
      </div>

      {/* Gráfica y Tabla de Carga */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Gráfico Visual (Mock) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Evolución Anual: Índice de Frecuencia (IF)</h3>
            <select className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 outline-none">
              <option>Año 2026</option>
              <option>Año 2025</option>
            </select>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-2 h-64 mt-4 relative">
            {/* Línea de Límite SRT (Benchmarking) */}
            <div className="absolute w-full border-t-2 border-dashed border-rose-400/50 top-20 flex justify-end">
              <span className="text-[10px] font-bold text-rose-500 bg-white dark:bg-slate-900 px-2 -mt-2.5">Límite Sector SRT (IF: 140)</span>
            </div>

            {/* Barras de meses mock */}
            {[80, 110, 95, 120, 135, 123, 115, 90, 85, 0, 0, 0].map((val, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <div className="relative w-full flex justify-center h-full items-end">
                  {val > 0 ? (
                    <div 
                      className={`w-full max-w-[2rem] rounded-t-md transition-all ${val > 130 ? 'bg-amber-400 dark:bg-amber-500' : 'bg-indigo-500 dark:bg-indigo-600'}`} 
                      style={{ height: `${val}%` }}
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded font-bold transition-opacity z-10">
                        {val}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full max-w-[2rem] h-2 bg-slate-100 dark:bg-slate-800 rounded-t-md"></div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Carga Mensual */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Variables del Mes</h3>
            {!isClient && (
              <button className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Período Activo</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">Septiembre 2026</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Trabajadores Prom.</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{stats.trabajadoresPromedio}</p>
                  <span className="text-[10px] text-slate-400 font-medium italic">Vía módulo Personal</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Horas Hombre (HHT)</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {stats.hhtMensuales > 0 ? stats.hhtMensuales.toLocaleString() : "Falta cargar"}
                  </p>
                  {!isClient && <span className="text-[10px] text-indigo-500 font-bold uppercase cursor-pointer hover:underline">Actualizar</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Casos / Días Caídos</p>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{stats.accidentesTotales} <span className="text-slate-400 font-normal text-sm">casos</span> / {stats.diasPerdidos} <span className="text-slate-400 font-normal text-sm">días</span></p>
                  <span className="text-[10px] text-slate-400 font-medium italic">Vía módulo Incidentes</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// Alias de icono
import { Activity as ActivityIcon } from "lucide-react";
