"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Copy, CalendarPlus, X, ExternalLink } from "lucide-react";

export function SyncCalendarButton({ token }: { token: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBaseUrl(window.location.origin);
    setMounted(true);
  }, []);

  const cacheBuster = Date.now().toString(36);
  const syncUrl = `${baseUrl}/api/calendar/sync?token=${token}&cb=${cacheBuster}`;
  
  // Google Calendar format: https://calendar.google.com/calendar/r?cid=URL
  const googleCalendarUrl = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(syncUrl)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(syncUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = isOpen ? (
    <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 animate-fade-in relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

            <h3 className="text-xl font-bold text-slate-800 mb-2">Sincronizar Calendario</h3>
            <p className="text-sm text-slate-500 mb-6">
              Elige cómo deseas conectar este calendario con tu agenda personal.
            </p>

            <div className="space-y-4">
              {/* Opción 1: Google Calendar */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-slate-50">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <svg viewBox="0 0 48 48" width="24px" height="24px"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">Añadir a Google Calendar</h4>
                    <p className="text-xs text-slate-500 mb-3">Se abrirá Google Calendar en una nueva pestaña y se suscribirá automáticamente.</p>
                    <a 
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Conectar Google <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Opción 2: Copiar URL Manual */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white">
                <h4 className="font-bold text-slate-800 mb-1">Copia la URL segura (iCal)</h4>
                <p className="text-xs text-slate-500 mb-3">Si usas Outlook o Apple Calendar, copia este link y pégalo en la configuración de "Añadir calendario por URL".</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={syncUrl} 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-500 focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2 shrink-0"
                  >
                    {copied ? <span className="text-emerald-600">¡Copiado!</span> : <><Copy size={16} /> Copiar</>}
                  </button>
                </div>
              </div>
              {/* Opción 3: Descargar Archivo (Ideal para pruebas locales) */}
              <div className="p-4 border border-slate-200 rounded-2xl bg-white">
                <h4 className="font-bold text-slate-800 mb-1">Descargar archivo (.ics)</h4>
                <p className="text-xs text-slate-500 mb-3">Si estás probando el sistema de forma local, Google Calendar no puede leer tu URL. Descarga el archivo e impórtalo manualmente.</p>
                <div className="flex gap-2">
                  <a 
                    href={syncUrl}
                    download="hm-portal.ics"
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors flex items-center gap-2 w-full justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    Descargar Archivo .ics
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
  ) : null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
      >
        <CalendarPlus size={16} />
        Sincronizar (iCal)
      </button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  );
}
