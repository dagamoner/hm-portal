"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, ShieldAlert, Settings, Home, Users, BookOpen, Calculator } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"

export function PortalSidebar() {
  const pathname = usePathname();
  const { isAdmin, isManager, isInspector, isClient, user } = useAuth();
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobileSidebar } = useSidebar();

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
      isActive 
        ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold" 
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
    } ${isCollapsed ? "md:justify-center md:px-0" : ""}`;
  };

  return (
    <aside className={`print:hidden ${isCollapsed ? 'md:w-20 w-72' : 'w-72'} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen fixed left-0 top-0 flex flex-col z-50 overflow-hidden`}>
      <div className={`h-24 flex items-center ${isCollapsed ? 'md:justify-center justify-between px-6' : 'justify-between px-6'} border-b border-slate-100 dark:border-slate-800 transition-colors`}>
        <Link href="/portal" className="flex items-center gap-2">
           <span className={`text-2xl font-black text-indigo-900 dark:text-white tracking-tight transition-colors ${isCollapsed ? 'hidden md:block' : 'hidden'}`}>M<span className="text-indigo-600">.</span></span>
           <span className={`text-2xl font-black text-indigo-900 dark:text-white tracking-tight transition-colors ${isCollapsed ? 'md:hidden' : ''}`}>MH<span className="text-indigo-600">.</span> Portal</span>
        </Link>
        {!isCollapsed && (
          <button onClick={toggleSidebar} className="hidden md:block p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        {isCollapsed && (
          <button onClick={toggleSidebar} className="hidden md:flex w-full items-center justify-center p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg transition-colors mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        )}
        <button onClick={closeMobileSidebar} className="md:hidden p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      
      <div className={`flex-1 overflow-y-auto py-6 ${isCollapsed ? 'md:px-2 px-4' : 'px-4'} flex flex-col gap-2 custom-scrollbar`}>
        {(!isCollapsed || isMobileOpen) && <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-4 transition-colors md:hidden md:block">Menu Principal</div>}
        
        <Link href="/portal/dashboard" className={getLinkClass("/portal/dashboard")} title="Dashboard" onClick={closeMobileSidebar}>
          <Home size={20} className="shrink-0" />
          <span className={isCollapsed ? "md:hidden" : ""}>Dashboard</span>
        </Link>
        
        <Link href="/portal/calendario" className={getLinkClass("/portal/calendario")} title="Calendario" onClick={closeMobileSidebar}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          <span className={isCollapsed ? "md:hidden" : ""}>Calendario</span>
        </Link>
        
        {(isAdmin || isManager || (isClient && user?.assignedCompanyIds && user.assignedCompanyIds.length > 1)) && (
          <Link href="/portal/empresas" className={getLinkClass("/portal/empresas")} title="Empresas" onClick={closeMobileSidebar}>
            <Building2 size={20} className="shrink-0" />
            <span className={isCollapsed ? "md:hidden" : ""}>Empresas</span>
          </Link>
        )}

        {(isClient && user?.companyId && (!user.assignedCompanyIds || user.assignedCompanyIds.length <= 1)) && (
          <>
            <Link href={`/portal/empresas/${user.companyId}`} className={getLinkClass(`/portal/empresas/${user.companyId}`)} title="Mi Empresa" onClick={closeMobileSidebar}>
              <Building2 size={20} className="shrink-0" />
              <span className={isCollapsed ? "md:hidden" : ""}>Mi Empresa</span>
            </Link>
            
            <Link href="/portal/cuenta" className={getLinkClass("/portal/cuenta")} title="Cuenta" onClick={closeMobileSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
              <span className={isCollapsed ? "md:hidden" : ""}>Cuenta</span>
            </Link>
          </>
        )}

        {(isAdmin || isManager) && (
          <Link href="/portal/presupuestador" className={getLinkClass("/portal/presupuestador")} title="Presupuestador" onClick={closeMobileSidebar}>
            <Calculator size={20} className="shrink-0" />
            <span className={isCollapsed ? "md:hidden" : ""}>Presupuestador</span>
          </Link>
        )}

        {(isAdmin || isManager || isInspector) && (
          <Link href="/portal/digesto" className={getLinkClass("/portal/digesto")} title="Digesto Normativo" onClick={closeMobileSidebar}>
            <BookOpen size={20} className="shrink-0" />
            <span className={isCollapsed ? "md:hidden" : ""}>Digesto</span>
          </Link>
        )}

        {(isAdmin || isManager) && (
          <>
            {!isCollapsed && <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-6 mb-2 px-4 transition-colors">Configuración</div>}
            {isCollapsed && <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-4 transition-colors"></div>}
            {isAdmin && (
              <>
                <Link href="/portal/usuarios" className={getLinkClass("/portal/usuarios")} title="Usuarios" onClick={closeMobileSidebar}>
                  <Users size={20} className="shrink-0" />
                  <span className={isCollapsed ? "md:hidden" : ""}>Usuarios</span>
                </Link>
                <Link href="/portal/facturacion" className={getLinkClass("/portal/facturacion")} title="Facturación" onClick={closeMobileSidebar}>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current font-bold text-[10px] shrink-0">$</span>
                  <span className={isCollapsed ? "md:hidden" : ""}>Facturación</span>
                </Link>
              </>
            )}
            <Link href="/portal/settings" className={getLinkClass("/portal/settings")} title="Ajustes" onClick={closeMobileSidebar}>
              <Settings size={20} className="shrink-0" />
              <span className={isCollapsed ? "md:hidden" : ""}>Ajustes</span>
            </Link>
          </>
        )}
      </div>
    </aside>
  )
}
