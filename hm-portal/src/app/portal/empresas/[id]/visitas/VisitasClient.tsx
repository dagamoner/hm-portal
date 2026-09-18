"use client";

import React, { useState } from 'react';
import { Plus, ClipboardCheck, AlertCircle, Building2, MapPin, Calendar, CheckCircle2, ChevronRight, FileText, Settings, Book, MessageSquare } from 'lucide-react';
import VisitaWizard from './VisitaWizard';
import DashboardCards from './components/DashboardCards';
import FindingsList from './components/FindingsList';
import VisitsList from './components/VisitsList';
import PlantillasClient from './components/PlantillasClient';
import LibroHySLClient from './components/LibroHySLClient';
import InformesList from './components/InformesList';
import ActionLibraryModal from './components/ActionLibraryModal';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function VisitasClient({ 
  company, 
  establishments,
  initialVisits,
  initialFindings,
  initialTemplates = [],
  initialBookEntries = [],
  professionals = []
}: { 
  company: any;
  establishments: any[];
  initialVisits: any[];
  initialFindings: any[];
  initialTemplates?: any[];
  initialBookEntries?: any[];
  professionals?: any[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user, isClient, isAdmin, isManager, isInspector } = useAuth();
  
  const activeTab = (searchParams.get('tab') as 'visitas' | 'desvios' | 'libro' | 'informes') || 'visitas';
  
  const setActiveTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const [isCreating, setIsCreating] = useState(false);
  const [visitToEdit, setVisitToEdit] = useState<any>(null);
  const [isManagingTemplates, setIsManagingTemplates] = useState(false);
  const [isManagingLibrary, setIsManagingLibrary] = useState(false);
  const [visits, setVisits] = useState(initialVisits);
  const [findings, setFindings] = useState(initialFindings);

  React.useEffect(() => {
    setVisits(initialVisits);
    setFindings(initialFindings);
  }, [initialVisits, initialFindings]);

  const handleVisitCreated = (savedVisit: any) => {
    if (visitToEdit) {
      setVisits(visits.map(v => v.id === savedVisit.id ? savedVisit : v));
      // Re-fetch or manually merge findings would be complex here, so we will rely on reload or basic append if we were adding new findings. 
      // For now, let's just do a window.location.reload() to make sure all relational data (like removed/added findings) is perfectly in sync.
      window.location.reload();
      return;
    }
    setVisits([savedVisit, ...visits]);
    if (savedVisit.findings && savedVisit.findings.length > 0) {
      setFindings([...savedVisit.findings, ...findings]);
    }
    setIsCreating(false);
  };

  const handleFindingUpdated = (updatedFinding: any) => {
    if (updatedFinding.deleted) {
      setFindings(findings.filter(f => f.id !== updatedFinding.id));
      setVisits(visits.map(v => ({
        ...v,
        findings: (v.findings || []).filter((f: any) => f.id !== updatedFinding.id)
      })));
    } else {
      setFindings(findings.map(f => f.id === updatedFinding.id ? updatedFinding : f));
      setVisits(visits.map(v => {
        if (!v.findings) return v;
        return {
          ...v,
          findings: v.findings.map((f: any) => f.id === updatedFinding.id ? updatedFinding : f)
        };
      }));
    }
  };

  if (isCreating || visitToEdit) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">{visitToEdit ? 'Editar Acta de Visita' : 'Nueva Acta de Visita'}</h1>
            <p className="text-sm text-slate-500">Inspección de Higiene y Seguridad</p>
          </div>
          <button
            onClick={() => { setIsCreating(false); setVisitToEdit(null); }}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium px-4 py-2"
          >
            Cancelar
          </button>
        </div>
        
        {establishments.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No hay establecimientos</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Para crear un acta de visita, primero debe dar de alta al menos un establecimiento para esta empresa.</p>
          </div>
        ) : (
          <VisitaWizard 
            company={company}
            companyId={company.id} 
            establishments={establishments} 
            templates={initialTemplates}
            professionals={professionals}
            visitToEdit={visitToEdit}
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
            {(isAdmin || isManager || isInspector) && (
              <>
                <button 
                  onClick={() => setIsManagingLibrary(true)}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  📚 Biblioteca de Acciones
                </button>
                <button 
                  onClick={() => setIsManagingTemplates(true)}
                  className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  <Settings className="w-4 h-4" /> Plantillas
                </button>
                <button 
                  onClick={() => setIsCreating(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-indigo-200"
                >
                  <Plus className="w-4 h-4" /> Nueva Acta
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {isManagingLibrary && (
        <ActionLibraryModal 
          companyId={company.id} 
          onClose={() => setIsManagingLibrary(false)} 
        />
      )}

      {/* KPI Cards */}
      <div className="print:hidden">
        <DashboardCards visits={visits} findings={findings} bookEntries={initialBookEntries || []} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50 print:hidden">
          <button
            onClick={() => setActiveTab('visitas')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'visitas'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-transparent'
            }`}
          >
            <FileText className="w-4 h-4" /> Actas / Check-lists ({visits.length})
          </button>
          <button
            onClick={() => setActiveTab('desvios')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'desvios'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-transparent'
            }`}
          >
            <AlertCircle className="w-4 h-4" /> Desvíos / No Conformidades ({findings.length})
          </button>
          <button
            onClick={() => setActiveTab('libro')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'libro'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-transparent'
            }`}
          >
            <Book className="w-4 h-4" /> Libro Digital
          </button>
          <button
            onClick={() => setActiveTab('informes')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === 'informes'
                ? 'border-indigo-600 text-indigo-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Informes
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'visitas' && <VisitsList visits={visits} onEdit={(visit) => setVisitToEdit(visit)} canEditVisit={isAdmin || isManager} />}
          {activeTab === 'desvios' && (
            <FindingsList findings={findings} companyId={company.id} establishments={establishments} onUpdate={handleFindingUpdated} />
          )}
          {activeTab === 'libro' && (
            <LibroHySLClient 
              companyId={company.id} 
              companyName={company.name} 
              initialEntries={initialBookEntries || []} 
            />
          )}
          {activeTab === 'informes' && (
            <InformesList 
              visits={visits} 
              bookEntries={initialBookEntries || []} 
              companyName={company.name} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
