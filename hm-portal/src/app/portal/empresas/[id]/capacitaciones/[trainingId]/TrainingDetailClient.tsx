"use client";

import React, { useState } from 'react';
import { ExternalLink, Save, CheckCircle2, FileCheck, XCircle, Copy, Trash2, Printer } from 'lucide-react';
import { saveTrainingRecords, updateTraining } from '@/app/actions/trainings';
import { useRouter } from 'next/navigation';

export default function TrainingDetailClient({ company, companyId, training, userRole }: any) {
  const router = useRouter();
  const [records, setRecords] = useState(training.records || []);
  const [sheetLink, setSheetLink] = useState(training.sheetLink || '');
  const [externalLink, setExternalLink] = useState(training.externalLink || '');
  const [isSaving, setIsSaving] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(training.status);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [savedRecordIds, setSavedRecordIds] = useState<Set<string>>(new Set());
  
  const [printData, setPrintData] = useState({
    tema: training.title || '',
    profesional: '',
    direccion: company?.address || '',
    fecha: new Date().toISOString().split('T')[0],
    horaInicio: '',
    horaFin: ''
  });
  
  const handlePrintDataChange = (field: string, value: string) => {
    setPrintData(prev => ({ ...prev, [field]: value }));
  };
  
  React.useEffect(() => {
    setRecords(training.records || []);
    setTrainingStatus(training.status);
  }, [training]);
  
  const canEdit = userRole === 'ADMIN' || userRole === 'MANAGER' || userRole === 'INSPECTOR';

  const handleRecordChange = (recordId: string, field: string, value: any) => {
    setRecords(records.map((r: any) => 
      r.id === recordId ? { ...r, [field]: value, _isDirty: true } : r
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await saveTrainingRecords(records, companyId);
      if (res?.error) throw new Error(res.error);
      
      const updateRes = await updateTraining(training.id, companyId, { sheetLink, externalLink, status: trainingStatus });
      if ((updateRes as any)?.error) throw new Error((updateRes as any).error);
      
      router.refresh();
      alert("Registros y estado guardados correctamente");
    } catch (error: any) {
      alert(error.message || "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveRecord = async (recordId: string) => {
    const recordToSave = records.find((r: any) => r.id === recordId);
    if (!recordToSave) return;
    
    try {
      // Just save this single record
      const res = await saveTrainingRecords([recordToSave], companyId);
      if (res?.error) throw new Error(res.error);
      
      setSavedRecordIds(prev => new Set(prev).add(recordId));
    } catch (error: any) {
      alert(error.message || "Error al guardar el registro individual");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(externalLink);
    alert('Link copiado');
  };

  const filteredRecords = records
    .filter((r: any) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      const worker = r.worker || {};
      const fullName = `${worker.lastName || ''} ${worker.firstName || ''}`.toLowerCase();
      const dni = worker.documentId || '';
      return fullName.includes(search) || dni.includes(search);
    })
    .sort((a: any, b: any) => {
      // Jump to bottom if saved in DB or saved in session
      const aSaved = savedRecordIds.has(a.id) || (a.completed && !a._isDirty);
      const bSaved = savedRecordIds.has(b.id) || (b.completed && !b._isDirty);
      
      if (aSaved && !bSaved) return 1;
      if (!aSaved && bSaved) return -1;
      
      // Then sort alphabetically
      const nameA = a.worker?.lastName || '';
      const nameB = b.worker?.lastName || '';
      return nameA.localeCompare(nameB);
    });

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: A4 portrait; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
        }
      `}} />
      
      {/* Action Bar - Hidden when printing */}
      <div className="print:hidden flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="text-sm font-medium text-slate-500">Opciones de Capacitación</div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-bold transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimir Planilla
        </button>
      </div>
      
      {/* Cuestionario Link Card */}
      <div className="print:hidden bg-gradient-to-r from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-500" /> Formulario de Capacitación
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Formulario de evaluación online para los participantes.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full relative">
            <input 
              type="url" 
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              disabled={!canEdit}
              placeholder="https://forms.google.com/..."
              className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500"
            />
            {!canEdit && externalLink && (
              <button 
                onClick={handleCopyLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 rounded-md text-slate-500 transition-colors"
                title="Copiar Link"
              >
                <Copy className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            {externalLink && (
              <a 
                href={externalLink} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all whitespace-nowrap"
              >
                Abrir Formulario <ExternalLink className="w-4 h-4" />
              </a>
            )}
            
            {canEdit && (
              <>
                <button 
                  onClick={handleSave}
                  className="p-3 bg-slate-900 hover:bg-black text-white rounded-xl shadow-sm transition-all"
                  title="Guardar Link"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setExternalLink('')}
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all"
                  title="Borrar Link"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Google Sheets Record Card */}
      <div className="print:hidden bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 text-xl">Registro de Participación y Notas</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Vínculo al documento de Google Sheets generado por Certify'em o carga manual
            </p>
          </div>
          
          {canEdit && (
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Guardar Registros'}
            </button>
          )}
        </div>
        
        <div className="p-6 border-b border-slate-100">
          {canEdit ? (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-slate-700 mb-2">Vínculo de Google Sheets</label>
                <input 
                  type="url" 
                  value={sheetLink}
                  onChange={(e) => setSheetLink(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-slate-50"
                />
              </div>
              
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-bold text-slate-700 mb-2">Estado de la Capacitación</label>
                <select 
                  value={trainingStatus}
                  onChange={(e) => setTrainingStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-slate-50"
                >
                  <option value="Bloqueada">Bloqueada</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Progreso">En Progreso</option>
                  <option value="Completada">Completada</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              {sheetLink ? (
                <a 
                  href={sheetLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl shadow-sm border border-emerald-200 transition-all text-lg"
                >
                  <ExternalLink className="w-5 h-5" /> Ver Registro de Participantes y Notas
                </a>
              ) : (
                <div className="p-6 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                  <p className="font-medium text-slate-500">Aún no hay un registro de notas disponible para esta capacitación.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Workers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4" rowSpan={2}>
                  <div className="flex flex-col gap-2">
                    <span>Trabajador / DNI</span>
                    <input 
                      type="text" 
                      placeholder="Buscar por nombre o DNI..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-2 py-1 text-xs font-normal normal-case border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/50 bg-white"
                    />
                  </div>
                </th>
                <th className="px-6 py-2 text-center border-b border-slate-200" colSpan={2}>¿Realizó?</th>
                <th className="px-6 py-2 text-center border-b border-slate-200" colSpan={2}>Examen</th>
                <th className="px-6 py-2 text-center border-b border-slate-200" colSpan={2}>¿Aprobó?</th>
                <th className="px-6 py-4" rowSpan={2}>Nota /100</th>
                <th className="px-6 py-4" rowSpan={2}>ID Certificado</th>
                <th className="px-6 py-4" rowSpan={2}>Fecha Completado</th>
                <th className="px-6 py-4 text-center" rowSpan={2}>Acciones</th>
              </tr>
              <tr className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-3 py-2 text-center border-r border-slate-200">Sí</th>
                <th className="px-3 py-2 text-center border-r border-slate-200">No</th>
                <th className="px-3 py-2 text-center border-r border-slate-200">Sí</th>
                <th className="px-3 py-2 text-center border-r border-slate-200">No</th>
                <th className="px-3 py-2 text-center border-r border-slate-200">Sí</th>
                <th className="px-3 py-2 text-center border-r border-slate-200">No</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record: any) => {
                const isSavedInSession = savedRecordIds.has(record.id) || (record.completed && !record._isDirty);
                return (
                <tr key={record.id} className={`transition-colors ${isSavedInSession ? 'bg-slate-100 opacity-60' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{record.worker.firstName} {record.worker.lastName}</p>
                    <p className="text-xs font-medium text-slate-500">DNI: {record.worker.documentId}</p>
                  </td>
                     <td className="px-3 py-4 text-center border-r border-slate-100">
                    <input 
                      type="radio" 
                      name={`completed_${record.id}`}
                      checked={record.completed === true}
                      onChange={() => handleRecordChange(record.id, 'completed', true)}
                      disabled={!canEdit || isSavedInSession}
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-3 py-4 text-center border-r border-slate-200">
                    <input 
                      type="radio" 
                      name={`completed_${record.id}`}
                      checked={record.completed === false}
                      onChange={() => handleRecordChange(record.id, 'completed', false)}
                      disabled={!canEdit || isSavedInSession}
                      className="w-4 h-4 text-slate-400 border-slate-300 focus:ring-slate-500 disabled:opacity-50"
                    />
                  </td>

                  <td className="px-3 py-4 text-center border-r border-slate-100">
                    <input 
                      type="radio" 
                      name={`hasExam_${record.id}`}
                      checked={record.hasExam === true}
                      onChange={() => handleRecordChange(record.id, 'hasExam', true)}
                      disabled={!canEdit || !record.completed || isSavedInSession}
                      className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-3 py-4 text-center border-r border-slate-200">
                    <input 
                      type="radio" 
                      name={`hasExam_${record.id}`}
                      checked={record.hasExam === false}
                      onChange={() => handleRecordChange(record.id, 'hasExam', false)}
                      disabled={!canEdit || !record.completed || isSavedInSession}
                      className="w-4 h-4 text-slate-400 border-slate-300 focus:ring-slate-500 disabled:opacity-50"
                    />
                  </td>

                  <td className="px-3 py-4 text-center border-r border-slate-100">
                    <input 
                      type="radio" 
                      name={`approved_${record.id}`}
                      checked={record.approved === true}
                      onChange={() => handleRecordChange(record.id, 'approved', true)}
                      disabled={!canEdit || !record.completed || !record.hasExam || isSavedInSession}
                      className="w-4 h-4 text-emerald-600 border-slate-300 focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </td>
                  <td className="px-3 py-4 text-center border-r border-slate-200">
                    <input 
                      type="radio" 
                      name={`approved_${record.id}`}
                      checked={record.approved === false}
                      onChange={() => handleRecordChange(record.id, 'approved', false)}
                      disabled={!canEdit || !record.completed || !record.hasExam || isSavedInSession}
                      className="w-4 h-4 text-slate-400 border-slate-300 focus:ring-slate-500 disabled:opacity-50"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={record.score || ''}
                      onChange={(e) => handleRecordChange(record.id, 'score', e.target.value)}
                      disabled={!canEdit || !record.completed || !record.hasExam || isSavedInSession}
                      placeholder="Ej: 80"
                      min="0"
                      max="100"
                      className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50 text-slate-700 placeholder-slate-300"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      value={record.certificateId || ''}
                      onChange={(e) => handleRecordChange(record.id, 'certificateId', e.target.value.toUpperCase())}
                      disabled={!canEdit || !record.completed || isSavedInSession}
                      placeholder="Ej: 6B11DO-CE000006"
                      className="w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50 text-slate-700 placeholder-slate-300 uppercase"
                    />
                  </td>

                  <td className="px-6 py-4">
                    <input 
                      type="date" 
                      value={record.completionDate ? new Date(record.completionDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleRecordChange(record.id, 'completionDate', e.target.value ? new Date(e.target.value).toISOString() : null)}
                      disabled={!canEdit || !record.completed || isSavedInSession}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50 text-slate-700"
                    />
                  </td>

                  <td className="px-6 py-4 text-center">
                    {isSavedInSession ? (
                      <div className="p-2 bg-slate-100 text-slate-400 rounded-lg flex flex-col items-center justify-center w-full">
                        <CheckCircle2 className="w-4 h-4 mb-1 text-emerald-500" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Guardado</span>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSaveRecord(record.id)}
                        disabled={!canEdit}
                        className="p-2 bg-slate-900 text-white hover:bg-black rounded-lg transition-colors disabled:opacity-50 flex flex-col items-center justify-center w-full"
                        title="Guardar este registro"
                      >
                        <Save className="w-4 h-4 mb-1" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Guardar</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No hay trabajadores registrados o pendientes en esta capacitación.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Print Only Layout */}
      {(() => {
        const printableRecords = records.filter((r: any) => r.completed && r.approved);
        return (
          <div className="hidden print:block font-sans text-[11px] leading-tight w-full">
            <div className="border-2 border-black w-full">
          {/* Top Header */}
          <div className="grid grid-cols-4 border-b-2 border-black">
            <div className="col-span-1 border-r-2 border-black p-2 flex items-center justify-center">
              <span className="font-bold text-xl tracking-tighter">MH. Portal</span>
            </div>
            <div className="col-span-2 border-r-2 border-black p-2 flex flex-col items-center justify-center text-center">
              <div className="font-bold border-b border-black w-full pb-1 mb-1">Sistema de Gestión</div>
              <div className="font-bold">Planilla Capacitación</div>
            </div>
            <div className="col-span-1 p-2 flex items-center justify-center text-center font-bold">
              HIGIENE Y<br />SEGURIDAD EN EL<br />TRABAJO
            </div>
          </div>
          
          <div className="text-center font-bold py-1 border-b border-black">PLANILLA DE CAPACITACIÓN</div>
          
          {/* Meta Information */}
          <div className="border-b border-black flex">
            <div className="font-bold p-1 w-16 border-r border-black bg-gray-100 print:bg-transparent">TEMA</div>
            <div className="p-1 flex-1 uppercase">
              <input type="text" value={printData.tema} onChange={e => handlePrintDataChange('tema', e.target.value)} className="w-full bg-transparent outline-none print:hidden border-b border-slate-200" />
              <span className="hidden print:inline">{printData.tema}</span>
            </div>
          </div>
          <div className="border-b-2 border-black p-1 text-[9px] text-gray-700">
            Todo conforme al Art.9 inciso k, de la LEY 19587 y Artículos 208, 209 y 210 del decreto reglamentario 351/79. Conforme y ajustado a procedimiento reglamentario.
          </div>
          
          <div className="grid grid-cols-2 border-b border-black">
            <div className="flex border-r border-black">
              <div className="font-bold p-1 w-24 border-r border-black bg-gray-100 print:bg-transparent">EMPRESA</div>
              <div className="p-1 flex-1 uppercase font-bold">{company?.name}</div>
            </div>
            <div className="flex">
              <div className="font-bold p-1 w-48 border-r border-black text-[10px] flex items-center bg-gray-100 print:bg-transparent">PROFESIONAL RESPONSABLE</div>
              <div className="p-1 flex-1 uppercase">
                <input type="text" value={printData.profesional} onChange={e => handlePrintDataChange('profesional', e.target.value)} className="w-full bg-transparent outline-none print:hidden border-b border-slate-200" placeholder="Nombre del profesional..." />
                <span className="hidden print:inline">{printData.profesional}</span>
              </div>
            </div>
          </div>
          
          <div className="border-b border-black flex">
            <div className="font-bold p-1 w-24 border-r border-black bg-gray-100 print:bg-transparent">DIRECCION</div>
            <div className="p-1 flex-1 uppercase">
              <input type="text" value={printData.direccion} onChange={e => handlePrintDataChange('direccion', e.target.value)} className="w-full bg-transparent outline-none print:hidden border-b border-slate-200" />
              <span className="hidden print:inline">{printData.direccion}</span>
            </div>
          </div>
          
          <div className="border-b-2 border-black grid grid-cols-3">
            <div className="flex border-r border-black">
              <div className="font-bold p-1 w-16 border-r border-black bg-gray-100 print:bg-transparent">FECHA</div>
              <div className="p-1 flex-1">
                <input type="date" value={printData.fecha} onChange={e => handlePrintDataChange('fecha', e.target.value)} className="w-full bg-transparent outline-none print:hidden" />
                <span className="hidden print:inline">{printData.fecha ? new Date(printData.fecha).toLocaleDateString('es-AR') : ''}</span>
              </div>
            </div>
            <div className="flex border-r border-black">
              <div className="font-bold p-1 border-r border-black flex-1 text-right bg-gray-100 print:bg-transparent">Hora de Inicio:</div>
              <div className="p-1 w-24">
                <input type="time" value={printData.horaInicio} onChange={e => handlePrintDataChange('horaInicio', e.target.value)} className="w-full bg-transparent outline-none print:hidden" />
                <span className="hidden print:inline">{printData.horaInicio}</span>
              </div>
            </div>
            <div className="flex">
              <div className="font-bold p-1 border-r border-black flex-1 text-right bg-gray-100 print:bg-transparent">Hora de Finalización:</div>
              <div className="p-1 w-24">
                <input type="time" value={printData.horaFin} onChange={e => handlePrintDataChange('horaFin', e.target.value)} className="w-full bg-transparent outline-none print:hidden" />
                <span className="hidden print:inline">{printData.horaFin}</span>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black bg-gray-100 print:bg-transparent">
                <th className="border-r border-black p-1 w-8 text-center font-bold">Nº</th>
                <th className="border-r border-black p-1 text-center font-bold">Nombre y Apellido</th>
                <th className="border-r border-black p-1 w-32 text-center font-bold">Firma</th>
                <th className="p-1 w-32 text-center font-bold">DNI</th>
              </tr>
            </thead>
            <tbody>
              {printableRecords.map((r: any, idx: number) => (
                <tr key={r.id} className="border-b border-black h-7">
                  <td className="border-r border-black p-1 text-center font-medium">{String(idx + 1).padStart(2, '0')}</td>
                  <td className="border-r border-black p-1 uppercase px-2 font-medium">{r.worker.lastName}, {r.worker.firstName}</td>
                  <td className="border-r border-black p-1"></td>
                  <td className="p-1 text-center font-medium">{r.worker.documentId}</td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 20 - printableRecords.length) }).map((_, i) => (
                <tr key={'empty-' + i} className="border-b border-black h-7">
                  <td className="border-r border-black p-1 text-center font-medium">{String(printableRecords.length + i + 1).padStart(2, '0')}</td>
                  <td className="border-r border-black p-1"></td>
                  <td className="border-r border-black p-1"></td>
                  <td className="p-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Checkboxes Footer */}
          <div className="grid grid-cols-2 border-b-2 border-black">
            <div className="border-r border-black grid grid-rows-3 divide-y divide-black">
              <div className="flex justify-between items-center p-1 px-2">
                <span>Se proyectó Power Point sobre el tema</span>
                <span className="font-bold flex gap-4"><span>SI</span> <span>NO</span></span>
              </div>
              <div className="flex justify-between items-center p-1 px-2">
                <span>Se entregó material ilustrativo sobre el tema</span>
                <span className="font-bold flex gap-4"><span>SI</span> <span>NO</span></span>
              </div>
              <div className="flex justify-between items-center p-1 px-2">
                <span>Se tomó evaluación al personal</span>
                <span className="font-bold flex gap-4"><span>SI</span> <span>NO</span></span>
              </div>
            </div>
            <div className="grid grid-rows-3 divide-y divide-black">
              <div className="flex justify-between items-center p-1 px-2">
                <span>Se proyectó video sobre el tema</span>
                <span className="font-bold flex gap-4"><span>SI</span> <span>NO</span></span>
              </div>
              <div className="flex justify-between items-center p-1 px-2">
                <span>Se dejó cartelería para ser exhibida en el sector</span>
                <span className="font-bold flex gap-4"><span>SI</span> <span>NO</span></span>
              </div>
              <div className="flex justify-between items-center p-1 px-2">
                <span>El personal manifestó entender el tema</span>
                <span className="font-bold flex gap-4"><span>SI</span> <span>NO</span></span>
              </div>
            </div>
          </div>
          
          {/* Signatures */}
          <div className="grid grid-cols-2 h-24 text-center">
            <div className="border-r border-black p-2 flex items-end justify-center pb-4">
              <div className="border-t border-black w-3/4 pt-1 font-bold">Responsable de Higiene y Seguridad</div>
            </div>
            <div className="p-2 flex items-end justify-center pb-4">
              <div className="border-t border-black w-3/4 pt-1 font-bold">Responsable y/o encargado por la Empresa</div>
            </div>
          </div>
        </div>
      </div>
      );
      })()}
    </div>
  );
}
