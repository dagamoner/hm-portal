"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

type SerializedEvent = {
  id: string;
  title: string;
  date: string;
  type: string;
  color: string;
  companyName: string;
  url: string;
};

export default function CalendarClient({ initialEvents }: { initialEvents: SerializedEvent[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeFilters, setActiveFilters] = useState<string[]>([
    'visit', 'finding', 'training', 'measurement', 'invoice', 'improvement_action'
  ]);

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const [view, setView] = useState<'month' | 'week' | 'agenda'>('month');

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  
  const nextWeek = () => setCurrentDate(addMonths(currentDate, 0)); // Hacky, better to add 1 week or just rely on prev/next buttons checking view
  const changeDate = (amount: number) => {
    if (view === 'month' || view === 'agenda') setCurrentDate(addMonths(currentDate, amount));
    else setCurrentDate(new Date(currentDate.getTime() + amount * 7 * 24 * 60 * 60 * 1000));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Month View Days
  const monthStartDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const monthEndDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const monthDays = eachDayOfInterval({ start: monthStartDate, end: monthEndDate });

  // Week View Days
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const daysToRender = view === 'week' ? weekDays : monthDays;

  const filteredEvents = initialEvents.filter(e => activeFilters.includes(e.type));

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(e => isSameDay(parseISO(e.date), day));
  };

  // Agenda Events (Upcoming from start of current month)
  const agendaEvents = filteredEvents
    .filter(e => parseISO(e.date) >= monthStart)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filterConfig = [
    { type: 'finding', label: 'Desvíos', color: 'bg-orange-500' },
    { type: 'improvement_action', label: 'Acciones', color: 'bg-amber-600' },
    { type: 'visit', label: 'Visitas', color: 'bg-emerald-500' },
    { type: 'training', label: 'Capacitaciones', color: 'bg-blue-500' },
    { type: 'measurement', label: 'Mediciones', color: 'bg-purple-500' },
    { type: 'invoice', label: 'Facturas', color: 'bg-slate-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white/60 p-4 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="w-5 h-5 text-slate-400 mr-2" />
          {filterConfig.map(f => (
            <button
              key={f.type}
              onClick={() => toggleFilter(f.type)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                activeFilters.includes(f.type) 
                  ? `${f.color} text-white border-transparent` 
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        {/* View Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setView('month')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === 'month' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Mes
          </button>
          <button 
            onClick={() => setView('week')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === 'week' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Semana
          </button>
          <button 
            onClick={() => setView('agenda')}
            className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${view === 'agenda' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Agenda
          </button>
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white/60 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 capitalize flex flex-col sm:flex-row sm:items-center gap-2">
            {view === 'week' 
              ? `Semana del ${format(weekStart, 'd')} de ${format(weekStart, 'MMMM', { locale: es })}`
              : format(currentDate, 'MMMM yyyy', { locale: es })
            }
          </h2>
          <div className="flex gap-2">
            <button onClick={() => changeDate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              Hoy
            </button>
            <button onClick={() => changeDate(1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {view === 'agenda' ? (
          <div className="p-6">
            <div className="space-y-4">
              {agendaEvents.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No hay eventos próximos en este mes.</div>
              ) : (
                agendaEvents.map(event => (
                  <Link 
                    key={event.id}
                    href={event.url}
                    className="flex flex-col sm:flex-row sm:items-center p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors gap-4 group"
                  >
                    <div className="flex flex-col sm:w-32 shrink-0">
                      <span className="text-sm font-bold text-slate-800">{format(parseISO(event.date), 'dd MMM', { locale: es })}</span>
                      <span className="text-xs text-slate-500">{format(parseISO(event.date), 'EEEE', { locale: es })}</span>
                    </div>
                    <div className={`w-3 h-3 rounded-full shrink-0 ${event.color}`}></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span className="font-medium text-slate-700">{event.companyName}</span>
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Días de la semana */}
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day, i) => (
                <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {day} {view === 'week' && <span className="block sm:inline sm:ml-1 text-slate-400 font-normal">{format(weekDays[i], 'd')}</span>}
                </div>
              ))}
            </div>

        {/* Cuadrícula */}
        <div className={`grid grid-cols-7 ${view === 'week' ? 'auto-rows-[300px]' : 'auto-rows-[120px]'} bg-slate-100 gap-px`}>
          {daysToRender.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = view === 'week' ? true : isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={day.toISOString()} 
                className={`bg-white p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50 ${!isCurrentMonth ? 'opacity-50' : ''}`}
              >
                <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>
                  {format(day, 'd')}
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                  {dayEvents.map(event => (
                    <Link 
                      key={event.id}
                      href={event.url}
                      className={`text-[10px] leading-tight px-1.5 py-1 rounded-md text-white font-medium truncate hover:opacity-90 transition-opacity ${event.color}`}
                      title={`${event.title} (${event.companyName})`}
                    >
                      <span className="opacity-80 mr-1">[{event.companyName.substring(0, 5)}]</span>
                      {event.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    )}
  </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}
