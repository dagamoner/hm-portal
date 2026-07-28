"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ShieldAlert, Activity, UserX, FileText } from "lucide-react";

export default function AuditClient({ initialLogs, currentTimeRange }: { initialLogs: any[], currentTimeRange: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const handleTimeRangeChange = (range: string) => {
    router.push(`/portal/settings/log-auditoria?period=${range}`);
  };

  const filteredLogs = initialLogs.filter(log => 
    log.userName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.company?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalActions = initialLogs.length;
  const criticalEvents = initialLogs.filter(l => l.action === 'ELIMINAR' || l.action === 'ACCESO_DENEGADO').length;
  const deniedAccess = initialLogs.filter(l => l.action === 'ACCESO_DENEGADO').length;

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREAR': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MODIFICAR': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ELIMINAR': return 'bg-red-100 text-red-800 border-red-200 font-bold';
      case 'LOGIN': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'ACCESO_DENEGADO': return 'bg-orange-100 text-orange-800 border-orange-200 font-bold';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const isCritical = (action: string) => action === 'ELIMINAR' || action === 'ACCESO_DENEGADO';

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Acciones</p>
            <p className="text-2xl font-bold text-slate-800">{totalActions}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Eventos Críticos</p>
            <p className="text-2xl font-bold text-red-600">{criticalEvents}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Accesos Denegados</p>
            <p className="text-2xl font-bold text-orange-600">{deniedAccess}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex space-x-2">
          {['today', '7days', '30days', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentTimeRange === range ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {range === 'today' ? 'Hoy' : range === '7days' ? '7 Días' : range === '30days' ? '30 Días' : 'Todo'}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Buscar por usuario, acción, módulo..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fecha / Hora</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuario</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Acción</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Módulo</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Objetivo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr 
                  key={log.id} 
                  onClick={() => setSelectedLog(log)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${isCritical(log.action) ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-transparent'}`}
                >
                  <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-800">{log.userName}</span>
                      <span className="text-xs text-slate-500">{log.userRole}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs border rounded-md ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-700 font-medium">
                    {log.module}
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 truncate max-w-xs">
                    {log.company?.name ? <span className="font-semibold text-indigo-700 mr-1">[{log.company.name}]</span> : null}
                    {log.target}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-sm">
                    No se encontraron registros en este período o bajo ese criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Detalles */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className={`px-6 py-4 flex justify-between items-center ${isCritical(selectedLog.action) ? 'bg-red-50 border-b border-red-100' : 'bg-slate-50 border-b border-slate-100'}`}>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-500" />
                <span>Detalle de Evento</span>
              </h2>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400 font-medium text-xs uppercase mb-1">ID del Log</p>
                  <p className="text-slate-800 font-mono">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-xs uppercase mb-1">Fecha y Hora</p>
                  <p className="text-slate-800">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                
                <div>
                  <p className="text-slate-400 font-medium text-xs uppercase mb-1">Usuario</p>
                  <p className="text-slate-800 font-semibold">{selectedLog.userName} <span className="text-slate-500 font-normal">({selectedLog.userRole})</span></p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium text-xs uppercase mb-1">Módulo</p>
                  <p className="text-slate-800">{selectedLog.module}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-slate-400 font-medium text-xs uppercase mb-1">Acción</p>
                  <span className={`inline-flex px-2 py-1 text-xs border rounded-md ${getActionColor(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-slate-400 font-medium text-xs uppercase mb-1">Objetivo / Entidad</p>
                  <p className="text-slate-800 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    {selectedLog.company?.name ? <span className="font-semibold text-indigo-700 mr-2">Empresa: {selectedLog.company.name}</span> : null}
                    {selectedLog.target}
                  </p>
                </div>

                {selectedLog.details && Object.keys(selectedLog.details).length > 0 && (
                  <div className="col-span-2 mt-4">
                    <p className="text-slate-400 font-medium text-xs uppercase mb-1">Detalles Técnicos</p>
                    <pre className="bg-slate-900 text-slate-300 p-4 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
