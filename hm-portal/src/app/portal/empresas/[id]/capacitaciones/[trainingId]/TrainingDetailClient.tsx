"use client";

import React, { useState } from 'react';
import { ExternalLink, Save, CheckCircle2, FileCheck, XCircle } from 'lucide-react';
import { saveTrainingRecords, updateTraining } from '@/app/actions/trainings';

export default function TrainingDetailClient({ companyId, training }: any) {
  const [records, setRecords] = useState(training.records || []);
  const [isSaving, setIsSaving] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState(training.status);

  const handleRecordChange = (recordId: string, field: string, value: any) => {
    setRecords(records.map((r: any) => 
      r.id === recordId ? { ...r, [field]: value } : r
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveTrainingRecords(records, companyId);
      
      // Auto-update training status if everyone completed
      const allCompleted = records.every((r: any) => r.completed);
      const newStatus = allCompleted ? 'Completada' : 'En Progreso';
      
      if(newStatus !== trainingStatus) {
        await updateTraining(training.id, companyId, { status: newStatus });
        setTrainingStatus(newStatus);
      }
      
      alert("Registros guardados correctamente");
    } catch (error) {
      alert("Error al guardar los registros");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Cuestionario Link Card */}
      <div className="bg-gradient-to-r from-indigo-50 to-white p-6 rounded-3xl border border-indigo-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-500" /> Evaluación de Google Forms
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Comparta este enlace con los participantes. Luego, transcriba los resultados en la tabla inferior.
          </p>
        </div>
        
        {training.externalLink ? (
          <a 
            href={training.externalLink} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-all"
          >
            Abrir Formulario <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <span className="text-sm font-bold text-slate-400">Sin link configurado</span>
        )}
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Registro de Participación y Notas</h3>
            <p className="text-sm font-medium text-slate-500">Volcar la información del Excel generado por Certify'em</p>
          </div>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Guardando...' : 'Guardar Registros'}
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <th className="px-6 py-4">Trabajador / DNI</th>
                <th className="px-6 py-4 text-center">¿Realizó?</th>
                <th className="px-6 py-4 text-center">¿Aprobó?</th>
                <th className="px-6 py-4">Nota /100</th>
                <th className="px-6 py-4">ID Certificado</th>
                <th className="px-6 py-4">Fecha Completado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((record: any) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{record.worker.firstName} {record.worker.lastName}</p>
                    <p className="text-xs font-medium text-slate-500">DNI: {record.worker.documentId}</p>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={record.completed}
                      onChange={(e) => handleRecordChange(record.id, 'completed', e.target.checked)}
                      className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={record.approved || false}
                      onChange={(e) => handleRecordChange(record.id, 'approved', e.target.checked)}
                      disabled={!record.completed}
                      className="w-5 h-5 rounded border-slate-300 text-green-500 focus:ring-green-500 cursor-pointer disabled:opacity-50"
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <input 
                      type="number" 
                      value={record.score || ''}
                      onChange={(e) => handleRecordChange(record.id, 'score', e.target.value)}
                      disabled={!record.completed}
                      placeholder="Ej: 80"
                      className="w-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50"
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <input 
                      type="text" 
                      value={record.certificateId || ''}
                      onChange={(e) => handleRecordChange(record.id, 'certificateId', e.target.value)}
                      disabled={!record.completed}
                      placeholder="Ej: 6B11DO-CE000006"
                      className="w-48 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50 uppercase"
                    />
                  </td>
                  
                  <td className="px-6 py-4">
                    <input 
                      type="date" 
                      value={record.completionDate ? new Date(record.completionDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => handleRecordChange(record.id, 'completionDate', e.target.value)}
                      disabled={!record.completed}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-indigo-500/50 outline-none disabled:opacity-50 text-slate-700"
                    />
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                    No hay trabajadores registrados en esta empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
