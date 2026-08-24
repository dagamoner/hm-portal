import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MessageSquare, Calendar, Building2 } from 'lucide-react';

export default function InformesList({ visits, bookEntries, companyName }: { visits: any[], bookEntries: any[], companyName: string }) {
  // Generar informes basados en las visitas
  const visitReports = visits.map(v => {
    const findingsCount = v.findings?.length || 0;
    const estName = v.establishment?.name || 'el establecimiento';
    const msg = `En fecha ${format(new Date(v.date), 'dd/MM/yyyy')} se realiza la visita de Higienistas al establecimiento ${estName} de la empresa ${companyName}, en donde, en tareas de relevamiento de condiciones de Higiene y Seguridad en el trabajo, se detectaron ${findingsCount} desvíos / No Conformidades, y se realizó un acta de visita la cual contiene lo siguiente: "${v.observations || 'Sin observaciones detalladas'}". A continuación se le eleva informe correspondiente para que tome las medidas correspondientes a fin de levantar dichas observaciones/desvíos/No conformidades.`;
    
    return {
      id: `v-${v.id}`,
      type: 'Check-list',
      date: new Date(v.date),
      number: v.visitNumber || 0,
      content: msg,
      inspector: v.inspectorName || 'Inspector',
    };
  });

  // Generar informes basados en el libro digital
  const bookReports = bookEntries.map(b => {
    const msg = `En el día de la fecha ${format(new Date(b.date), 'dd/MM/yyyy')} se asienta el folio N° ${String(b.folioNumber).padStart(4, '0')} en el Libro Digital de Higiene y Seguridad de la empresa ${companyName}, estableciendo las siguientes observaciones: "${b.observations}". A continuación se eleva informe correspondiente para la toma de medidas a fin de regularizar lo observado.`;
    
    return {
      id: `b-${b.id}`,
      type: 'Libro Digital',
      date: new Date(b.date),
      number: b.folioNumber,
      content: msg,
      inspector: b.professional || 'Profesional',
    };
  });

  // Combinar y ordenar por fecha (descendente) y luego por número
  const allReports = [...visitReports, ...bookReports].sort((a, b) => {
    if (a.date.getTime() !== b.date.getTime()) {
      return b.date.getTime() - a.date.getTime();
    }
    return b.number - a.number;
  });

  if (allReports.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-700">No hay informes</h3>
        <p className="text-slate-500">Aún no se han generado informes automáticos de visitas o libro digital.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allReports.map(report => (
        <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${report.type === 'Check-list' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {report.type === 'Check-list' ? <MessageSquare className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">
                  Informe Automático de {report.type}
                  {report.number ? ` #${report.number}` : ''}
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
            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full w-fit">
              ENVIADO AL CLIENTE
            </div>
          </div>
          <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap italic bg-slate-50 p-4 rounded-xl border border-slate-100">
            "{report.content}"
          </div>
        </div>
      ))}
    </div>
  );
}
