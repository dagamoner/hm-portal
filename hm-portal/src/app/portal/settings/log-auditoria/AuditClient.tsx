"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, ShieldAlert, Activity, UserX, FileText } from "lucide-react";

export default function AuditClient({ initialLogs, currentTimeRange }: { initialLogs: any[], currentTimeRange: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const [actionFilter, setActionFilter] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const handleTimeRangeChange = (range: string) => {
    router.push(`/portal/settings/log-auditoria?period=${range}`);
  };

  const filteredLogs = initialLogs.filter(log => {
    const matchesSearch = log.userName.toLowerCase().includes(activeSearchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
                          log.module.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
                          (log.company?.name || '').toLowerCase().includes(activeSearchTerm.toLowerCase());
    
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    const matchesModule = moduleFilter ? log.module === moduleFilter : true;
    const matchesSeverity = severityFilter ? log.severity === severityFilter : true;

    return matchesSearch && matchesAction && matchesModule && matchesSeverity;
  });

  const totalEvents = initialLogs.length;
  const securityAlerts = initialLogs.filter(l => l.action === 'ACCESO_DENEGADO' || l.action === 'LOGIN_FALLIDO').length;
  const criticalActions = initialLogs.filter(l => l.action === 'ELIMINAR').length;
  const activeUsers = new Set(initialLogs.map(l => l.userName)).size;

  // Extract unique values for filters
  const uniqueActions = Array.from(new Set(initialLogs.map(l => l.action)));
  const uniqueModules = Array.from(new Set(initialLogs.map(l => l.module)));
  const uniqueSeverities = Array.from(new Set(initialLogs.map(l => l.severity).filter(Boolean)));

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Total Eventos</p>
            <p className="text-2xl font-bold text-slate-800">{totalEvents}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-lg">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Alertas de Seguridad</p>
            <p className="text-2xl font-bold text-orange-600">{securityAlerts}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Acciones Críticas</p>
            <p className="text-2xl font-bold text-red-600">{criticalActions}</p>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase">Usuarios Activos</p>
            <p className="text-2xl font-bold text-indigo-600">{activeUsers}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
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
          <div className="flex w-full md:w-96 flex-shrink-0 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar por texto libre, usuario, ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setActiveSearchTerm(searchTerm)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
              onClick={() => setActiveSearchTerm(searchTerm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Buscar
            </button>
          </div>
        </div>

        {/* Extended Filters */}
        <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase">Filtros Forenses:</span>
          </div>
          <select 
            value={actionFilter} 
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
          >
            <option value="">Todas las Acciones</option>
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <select 
            value={moduleFilter} 
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
          >
            <option value="">Todos los Módulos</option>
            {uniqueModules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 bg-white"
          >
            <option value="">Cualquier Severidad</option>
            {uniqueSeverities.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
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
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Severidad</th>
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
                    {log.severity && (
                      <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                        log.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        log.severity === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {log.severity}
                      </span>
                    )}
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
                  <p className="text-slate-400 font-medium text-xs uppercase mb-1">Severidad y Acción</p>
                  <div className="flex gap-2 items-center">
                    {selectedLog.severity && (
                      <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                        selectedLog.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        selectedLog.severity === 'WARNING' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedLog.severity}
                      </span>
                    )}
                    <span className={`inline-flex px-2 py-1 text-xs border rounded-md ${getActionColor(selectedLog.action)}`}>
                      {selectedLog.action}
                    </span>
                  </div>
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
