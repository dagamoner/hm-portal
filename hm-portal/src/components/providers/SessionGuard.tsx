"use client";

import { useEffect, useCallback } from "react";
import { logout } from "@/app/actions/auth";

export function SessionGuard() {
  const INACTIVITY_LIMIT = 60 * 60 * 1000; // 1 hora en milisegundos

  const handleLogout = useCallback(async () => {
    sessionStorage.removeItem("active_session");
    await logout();
  }, []);

  useEffect(() => {
    // 1. Verificar si es una sesión restaurada (ej: Chrome restauró la pestaña y la cookie, pero sessionStorage está vacío)
    if (!sessionStorage.getItem("active_session")) {
      handleLogout();
      return;
    }

    // 2. Control de Inactividad
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_LIMIT);
    };

    // Listeners para detectar actividad del usuario
    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // Iniciar timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [handleLogout]);

  return null;
}
