import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Calendar, Send } from 'lucide-react';
import { sendMessage } from '@/app/actions/messages';

export default function InformesList({ visits, bookEntries, companyName }: { visits: any[], bookEntries: any[], companyName: string }) {
  
  const reportsByDate = new Map<string, {
    date: Date;
    visits: any[];
    bookEntries: any[];
  }>();

  [...visits, ...bookEntries].forEach(item => {
    const d = new Date(item.date);
    const dateStr = d.toISOString().split('T')[0];
    if (!reportsByDate.has(dateStr)) {
      reportsByDate.set(dateStr, { date: d, visits: [], bookEntries: [] });
    }
    const bucket = reportsByDate.get(dateStr)!;
    if ('visitNumber' in item) {
      bucket.visits.push(item);
    } else {
      bucket.bookEntries.push(item);
    }
  });

  const allReports = Array.from(reportsByDate.values()).map(bucket => {
    const totalFindings = bucket.visits.reduce((acc, v) => acc + (v.findings?.length || 0), 0);
    const estNamesSet = new Set(bucket.visits.map(v => v.establishment?.name).filter(Boolean));
    const establishmentsStr = estNamesSet.size > 0 ? Array.from(estNamesSet).join(' y ') : 'el establecimiento';
    
    const inspectorNamesSet = new Set([
      ...bucket.visits.map(v => v.inspectorName),
      ...bucket.bookEntries.map(b => b.professional)
    ].filter(Boolean));
    const inspectorStr = inspectorNamesSet.size > 0 ? Array.from(inspectorNamesSet).join(', ') : 'Higienistas';
    
    let msg = `En fecha ${format(bucket.date, 'dd/MM/yyyy')} se realiza la visita de Higienistas al establecimiento ${establishmentsStr} de la empresa ${companyName}, en donde, en tareas de relevamiento de condiciones de Higiene y Seguridad en el trabajo, se detectaron ${totalFindings} desvíos / No Conformidades`;
    
    if (bucket.visits.length > 0) {
      const allObs = bucket.visits.map(v => v.observations).filter(Boolean).join('. ');
      msg += `, y se realizaron actas de visita las cuales contienen lo siguiente: "${allObs || 'Sin observaciones detalladas'}".`;
      
      const allFindingsList = bucket.visits.flatMap(v => v.findings || []);
      if (allFindingsList.length > 0) {
          msg += `\n\nDesvíos detectados:\n`;
          allFindingsList.forEach((f) => {
             msg += `- ${f.description} (Riesgo ${f.hazardLevel})\n`;
          });
      }
    } else {
      msg += ".";
    }

    if (bucket.bookEntries.length > 0) {
      const bookObs = bucket.bookEntries.map(b => `Folio N° ${String(b.folioNumber).padStart(4, '0')}: ${b.observations}`).join('\n');
      msg += `\n\nAdemás, se dejó asentado en el Libro Digital de Higiene y Seguridad lo siguiente:\n"${bookObs}"`;
    }

    msg += `\n\nA continuación se le eleva informe correspondiente para que tome las medidas correspondientes a fin de levantar dichas observaciones/desvíos/No conformidades.`;

    const companyId = (bucket.visits[0]?.companyId) || (bucket.bookEntries[0]?.companyId);

    return {
      id: `report-${bucket.date.getTime()}`,
      date: bucket.date,
      content: msg,
      inspector: inspectorStr,
      companyId
    };
  }).sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleSendReport = async (companyId: string, content: string) => {
    if (!confirm('¿Seguro que deseas enviar este informe consolidado al cliente por mensaje interno?')) return;
    
    try {
      const res = await sendMessage(companyId, content);
      if (res.success) {
        alert('Informe enviado al cliente con éxito.');
      } else {
        alert(res.error || 'Ocurrió un error al enviar el informe.');
      }
    } catch (err) {
      console.error(err);
      alert('Ocurrió un error al enviar el informe.');
    }
  };

  if (allReports.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-700">No hay informes</h3>
        <p className="text-slate-500">Aún no se han registrado visitas ni folios de libro digital.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-sm mb-2 flex justify-between items-center flex-wrap gap-4">
        <div>
          <strong>Reportes Consolidados:</strong> Aquí se agrupan automáticamente todos los check-lists y folios digitales por fecha de visita. Puedes revisar el informe final y enviarlo al cliente haciendo clic en el botón.
        </div>
        <button 
          onClick={() => {
            window.location.reload();
          }}
          className="bg-white text-amber-700 hover:bg-amber-100 border border-amber-300 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors whitespace-nowrap"
        >
          ↻ Actualizar Informes
        </button>
      </div>
      {allReports.map(report => (
        <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  Informe de Visita Consolidado
                </h3>
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(report.date, "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                  <span>•</span>
                  <span>{report.inspector}</span>
                </div>
              </div>
            </div>
            {report.companyId && (
              <button 
                onClick={() => handleSendReport(report.companyId, report.content)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-4 h-4" /> Enviar al Cliente
              </button>
            )}
          </div>
          <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap italic bg-slate-50 p-4 rounded-xl border border-slate-100">
            {report.content}
          </div>
        </div>
      ))}
    </div>
  );
}
