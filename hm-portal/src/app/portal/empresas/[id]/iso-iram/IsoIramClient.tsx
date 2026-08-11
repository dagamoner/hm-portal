"use client";

import { useState } from "react";
import { Award, ShieldCheck, FileText, AlertTriangle, CheckCircle2, ChevronRight, Target, FileWarning } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";

export function IsoIramClient({ 
  companyId,
  realData
}: { 
  companyId: string,
  realData: {
    capas: any[];
    openCapasCount: number;
  }
}) {
  const { isClient } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "iso45001" | "aea" | "iram">("dashboard");

  // Al no existir un motor de auditoría ISO real aún en la BD, la preparación es "N/D" (No Determinada)
  const readinessISO = "N/D";
  const readinessAEA = "N/D";
  const nonConformities = realData.openCapasCount;

  // Lista de control vacía hasta que se configure una auditoría real
  const isoChecklist: any[] = [];

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "dashboard"
              ? "border-indigo-600 text-indigo-700 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <LayoutDashboardIcon className="w-4 h-4" />
          Dashboard Global
        </button>
        <button
          onClick={() => setActiveTab("iso45001")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "iso45001"
              ? "border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <Award className="w-4 h-4" />
          Auditoría ISO 45001
        </button>
        <button
          onClick={() => setActiveTab("aea")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "aea"
              ? "border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Reglamentaciones AEA
        </button>
        <button
          onClick={() => setActiveTab("iram")}
          className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-semibold text-sm transition-colors border-b-2 ${
            activeTab === "iram"
              ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
              : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          Normas IRAM
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
              <div className="w-24 h-24 rounded-full border-8 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
                <span className="text-xl font-black text-slate-800 dark:text-white">{readinessISO}</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">Readiness ISO 45001</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pendiente de evaluación</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
              <div className="w-24 h-24 rounded-full border-8 border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4">
                <span className="text-xl font-black text-slate-800 dark:text-white">{readinessAEA}</span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">Cumplimiento AEA</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pendiente de evaluación</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center transition-colors">
              <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white">{nonConformities} No Conformidades</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Requieren acción inmediata</p>
              
              <Link href={`/portal/empresas/${companyId}/capa`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                Ir a Módulo CAPA <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Últimas Tareas de Mejora Continua (CAPA vinculadas)
            </h3>
            <div className="space-y-3">
              {realData.capas.length > 0 ? realData.capas.map((capa) => (
                <div key={capa.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 transition-colors">
                  <div className="flex items-center gap-3">
                    {capa.status === 'ABIERTO' ? <FileWarning className="w-5 h-5 text-rose-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate max-w-sm">{capa.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tipo: {capa.deviationType} - Reportado: {new Date(capa.reportDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase ${capa.status === 'ABIERTO' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                    {capa.status}
                  </span>
                </div>
              )) : (
                <p className="text-sm text-slate-500 italic">No hay acciones correctivas cargadas en la base de datos.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "iso45001" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-colors">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-emerald-50/50 dark:bg-emerald-900/10 flex justify-between items-center transition-colors">
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Checklist de Implementación ISO 45001:2018
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Evaluación de requisitos de la norma para certificar el Sistema de Gestión.</p>
            </div>
            {!isClient && (
              <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm">
                Nueva Auditoría
              </button>
            )}
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isoChecklist.length > 0 ? isoChecklist.map((item) => (
              <div key={item.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{item.section}</p>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2 max-w-md">
                    <div 
                      className={`h-2 rounded-full ${item.pct >= 80 ? 'bg-emerald-500' : item.pct >= 60 ? 'bg-amber-400' : 'bg-rose-500'}`} 
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border ${
                    item.status === 'Cumple' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800/50 dark:text-emerald-400' :
                    item.status === 'Observación' ? 'bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800/50 dark:text-amber-400' :
                    'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800/50 dark:text-rose-400'
                  }`}>
                    {item.status}
                  </span>
                  {!isClient && (
                    <button className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                      Evaluar
                    </button>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                <p>No se han configurado listas de verificación ISO 45001 en la base de datos para esta empresa.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "aea" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors flex flex-col items-center justify-center text-center min-h-[400px]">
          <ShieldCheck className="w-16 h-16 text-amber-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Auditorías AEA</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
            Módulo específico para inspecciones según la reglamentación de la Asociación Electrotécnica Argentina (Ej. AEA 90364).
          </p>
          {!isClient && (
            <button className="mt-6 px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-sm transition-colors">
              Iniciar Checklist AEA
            </button>
          )}
        </div>
      )}

      {activeTab === "iram" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm transition-colors flex flex-col items-center justify-center text-center min-h-[400px]">
          <FileText className="w-16 h-16 text-blue-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">Biblioteca y Checklist IRAM</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
            Verificación de cumplimiento de normas específicas IRAM para extintores (3517), señalización (10005) y elementos de protección.
          </p>
          {!isClient && (
            <button className="mt-6 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors">
              Explorar Normas
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Pequeño icono faltante en Lucide (LayoutDashboardIcon alias de LayoutDashboard)
import { LayoutDashboard as LayoutDashboardIcon } from "lucide-react";
