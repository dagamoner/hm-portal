"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';
import Link from 'next/link';
import { getSystemNotifications, NotificationAlert } from '@/app/actions/notifications';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    const data = await getSystemNotifications();
    setNotifications(data);
    setIsLoading(false);
  };

  // Fetch notifications
  useEffect(() => {
    loadNotifications();

    const handleRefresh = () => loadNotifications();
    window.addEventListener("refresh-notifications", handleRefresh);
    return () => window.removeEventListener("refresh-notifications", handleRefresh);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      setNotifications([]);
      // Llamar al action para marcar todo como leido. Asumimos que lo importaremos arriba o podemos hacerlo luego
      const { markAllMessagesAsRead } = await import('@/app/actions/messages');
      await markAllMessagesAsRead();
      window.dispatchEvent(new Event("refresh-notifications"));
    } catch(e) {
      console.error(e);
    }
  };

  const handleNotificationClick = () => {
    setIsOpen(false);
    // Disparamos refresh un poco despues para que el layout cargue y las marque leídas
    setTimeout(() => window.dispatchEvent(new Event("refresh-notifications")), 1000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-rose-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-rose-50 border-rose-100';
      case 'warning': return 'bg-amber-50 border-amber-100';
      default: return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-xl transition-all relative ${isOpen ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}
        title="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in z-50">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-slate-800">Notificaciones</h3>
              {notifications.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                  {notifications.length}
                </span>
              )}
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                <div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                Cargando...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-500">No tienes notificaciones pendientes</p>
                <p className="text-xs text-slate-400 mt-1">Todo está al día.</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notif) => (
                  <Link 
                    key={notif.id} 
                    href={notif.link}
                    onClick={handleNotificationClick}
                    className={`block p-4 rounded-xl border transition-all hover:shadow-md ${getBgColor(notif.type)}`}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {getIcon(notif.type)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 mb-1">{notif.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed mb-2">
                          {notif.message}
                        </p>
                        {notif.date && (
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Vto: {new Date(notif.date).toLocaleDateString('es-AR')}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Marcar todas como leídas
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
