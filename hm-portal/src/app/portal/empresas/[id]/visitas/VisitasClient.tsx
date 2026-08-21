"use client";

import React, { useState } from 'react';
import { Plus, ClipboardCheck, AlertCircle, Building2, MapPin, Calendar, CheckCircle2, ChevronRight, FileText, Settings, Book } from 'lucide-react';
import VisitaWizard from './VisitaWizard';
import DashboardCards from './components/DashboardCards';
import FindingsList from './components/FindingsList';
import VisitsList from './components/VisitsList';
import PlantillasClient from './components/PlantillasClient';
import LibroHySLClient from './components/LibroHySLClient';
import { useAuth } from '@/components/providers/AuthProvider';

export default function VisitasClient({ 
  company, 
  establishments,
  initialVisits,
  initialFindings,
  initialTemplates = [],
  initialBookEntries = []
}: { 
  company: any;
  establishments: any[];
  initialVisits: any[];
  initialFindings: any[];
  initialTemplates?: any[];
  initialBookEntries?: any[];
}) {
  const { canEdit, isClient } = useAuth();
  const [activeTab, setActiveTab] = useState<'visitas' | 'desvios' | 'libro'>('visitas');
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingTemplates, setIsManagingTemplates] = useState(false);
  const [visits, setVisits] = useState(initialVisits);
  const [findings, setFindings] = useState(initialFindings);

  const handleVisitCreated = (newVisit: any) => {
    setVisits([newVisit, ...visits]);
    if (newVisit.findings && newVisit.findings.length > 0) {
      setFindings([...newVisit.findings, ...findings]);
    }
    setIsCreating(false);
  };

  const handleFindingUpdated = (updatedFinding: any) => {
    setFindings(findings.map(f => f.id === updatedFinding.id ? updatedFinding : f));
  };

  if (isCreating) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Nueva Acta de Visita</h1>
            <p className="text-sm text-slate-500">Inspección de Higiene y Seguridad</p>
          </div>
          <button
            onClick={() => setIsCreating(false)}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium px-4 py-2"
          >
            Cancelar
          </button>
        </div>
        
        {establishments.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-6 rounded-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 mx-auto text-amber-500" />
            <h3 className="font-bold">No hay Establecimientos u Obras</h3>
            <p className="text-sm">Debe crear al menos un establecimiento u obra en el módulo de Riesgos antes de poder registrar una visita.</p>
          </div>
        ) : (
          <VisitaWizard 
            companyId={company.id} 
            establishments={establishments} 
            templates={initialTemplates}
            onComplete={handleVisitCreated}
          />
        )}
      </div>
    );
  }

  if (isManagingTemplates) {
    return (
      <PlantillasClient 
        companyId={company.id} 
        initialTemplates={initialTemplates} 
        onBack={() => setIsManagingTemplates(false)} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 print:m-0 print:space-y-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ClipboardCheck className="w-8 h-8 text-indigo-600" />
            Inspecciones y Libro Oficial
          </h1>
          <p className="text-slate-500 mt-1">Gestión de actas de visitas, check-lists, libro de HyS y desvíos.</p>
        </div>
        
        {!isManagingTemplates && !isClient && (
          <div className="flex items-center gap-3">
            {(userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'INSPECTOR') && (
              <button 
                onClick={() => setIsManagingTemplates(true)}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
              >
                <Settings className="w-4 h-4" /> Plantillas
              </button>
            )}
            
            <button 
              onClick={() => setIsCreating(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all"
            >
              <Plus className="w-4 h-4" /> Nueva Visita
            </button>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="print:hidden">
        <DashboardCards visits={visits} findings={findings} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none print:overflow-visible">
        <div className="flex border-b border-slate-100 print:hidden">
          <button
            onClick={() => setActiveTab('visitas')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'visitas' 
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-4 h-4" /> Historial de Visitas ({visits.length})
          </button>
          <button
            onClick={() => setActiveTab('desvios')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'desvios' 
                ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <AlertCircle className="w-4 h-4" /> Desvíos / No Conformidades ({findings.filter(f => f.status !== 'CERRADO').length})
          </button>
          <button
            onClick={() => setActiveTab('libro')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'libro' 
                ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Book className="w-4 h-4" /> Libro Digital
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'visitas' && <VisitsList visits={visits} />}
          {activeTab === 'desvios' && (
            <FindingsList findings={findings} onUpdate={handleFindingUpdated} />
          )}
          {activeTab === 'libro' && (
            <LibroHySLClient 
              companyId={company.id} 
              companyName={company.name} 
              initialEntries={initialBookEntries || []} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
