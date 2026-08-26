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
  
  if (user?.role === 'CLIENT' && user.companyId) {
    events = await getCalendarEvents(user.companyId);
  } else {
    events = await getCalendarEvents();
  }

  // Serializar fechas para pasar al cliente
  const serializedEvents = events.map(e => ({
    ...e,
    date: e.date.toISOString()
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex justify-between items-center bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            📅 Calendario General Integrado
          </h1>
          <p className="text-slate-500 mt-1">Torre de control: vencimientos, visitas y auditorías programadas.</p>
        </div>
      </div>
      <CalendarClient initialEvents={serializedEvents} />
    </div>
  );
}
