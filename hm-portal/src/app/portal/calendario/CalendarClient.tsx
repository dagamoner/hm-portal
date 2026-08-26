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

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const filteredEvents = initialEvents.filter(e => activeFilters.includes(e.type));

  const getEventsForDay = (day: Date) => {
    return filteredEvents.filter(e => isSameDay(parseISO(e.date), day));
  };

  const filterConfig = [
    { type: 'finding', label: 'Desvíos', color: 'bg-orange-500' },
    { type: 'improvement_action', label: 'Acciones (Matriz)', color: 'bg-amber-600' },
    { type: 'visit', label: 'Visitas', color: 'bg-emerald-500' },
    { type: 'training', label: 'Capacitaciones', color: 'bg-blue-500' },
    { type: 'measurement', label: 'Mediciones', color: 'bg-purple-500' },
    { type: 'invoice', label: 'Facturas', color: 'bg-slate-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white/60 p-4 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm flex flex-wrap gap-2 items-center">
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

      {/* Calendario */}
      <div className="bg-white/60 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: es })}
          </h2>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors">
              Hoy
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Cuadrícula */}
        <div className="grid grid-cols-7 auto-rows-[120px] bg-slate-100 gap-px">
          {days.map((day, i) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
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
