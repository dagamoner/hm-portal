import { prisma } from "@/lib/prisma";
import CalendarClient from "./CalendarClient";
import { getCalendarEvents } from "@/app/actions/calendar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const session = await getSession();
  
  if (!session || !session.user) {
    redirect('/login');
  }

  const user = session.user;

  let events = [];
  let companies: any[] = [];
  
  if (user?.role === 'CLIENT' && user.companyId) {
    events = await getCalendarEvents(user.companyId);
  } else {
    events = await getCalendarEvents();
    companies = await prisma.company.findMany({
      include: {
        establishments: true
      }
    });
  }

  // Serializar fechas para pasar al cliente
  const serializedEvents = events.map(e => ({
    ...e,
    date: e.date.toISOString()
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            📅 Calendario General Integrado
          </h1>
          <p className="text-slate-500 mt-1">Torre de control: vencimientos, visitas y auditorías programadas.</p>
        </div>
        <a 
          href={`/api/calendar/sync?token=${user.id}`}
          target="_blank"
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          Sincronizar (iCal)
        </a>
      </div>
      <CalendarClient initialEvents={serializedEvents} companies={companies} userRole={user.role} />
    </div>
  );
}
