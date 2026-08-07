"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, ShieldAlert, Settings, Home, Users, BookOpen } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { useSidebar } from "@/components/providers/SidebarProvider"

export function PortalSidebar() {
  const pathname = usePathname();
  const { isAdmin, isManager, isClient, user } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
      isActive 
        ? "bg-indigo-50 text-indigo-700 font-semibold" 
        : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
    } ${isCollapsed ? "justify-center px-0" : ""}`;
  };

  return (
    <aside className={`print:hidden ${isCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-50 overflow-hidden`}>
      <div className={`h-24 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} border-b border-slate-100`}>
        <Link href="/portal" className="flex items-center gap-2">
          {isCollapsed ? (
             <span className="text-2xl font-black text-indigo-900 tracking-tight">M<span className="text-indigo-600">.</span></span>
          ) : (
             <span className="text-2xl font-black text-indigo-900 tracking-tight">MH<span className="text-indigo-600">.</span> Portal</span>
          )}
        </Link>
        {!isCollapsed && (
          <button onClick={toggleSidebar} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        {isCollapsed && (
          <button onClick={toggleSidebar} className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        )}
      </div>
      
      <div className={`flex-1 overflow-y-auto py-6 ${isCollapsed ? 'px-2' : 'px-4'} flex flex-col gap-2 custom-scrollbar`}>
        {!isCollapsed && <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">Menu Principal</div>}
        
        <Link href="/portal/dashboard" className={getLinkClass("/portal/dashboard")} title="Dashboard">
          <Home size={20} className="shrink-0" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        
        {(isAdmin || isManager || (isClient && user?.assignedCompanyIds && user.assignedCompanyIds.length > 1)) && (
          <Link href="/portal/empresas" className={getLinkClass("/portal/empresas")} title="Empresas">
            <Building2 size={20} className="shrink-0" />
            {!isCollapsed && <span>Empresas</span>}
          </Link>
        )}

        {(isClient && user?.companyId && (!user.assignedCompanyIds || user.assignedCompanyIds.length <= 1)) && (
          <Link href={`/portal/empresas/${user.companyId}`} className={getLinkClass(`/portal/empresas/${user.companyId}`)} title="Mi Empresa">
            <Building2 size={20} className="shrink-0" />
            {!isCollapsed && <span>Mi Empresa</span>}
          </Link>
        )}

        {(isAdmin || isManager) && (
          <>
            {!isCollapsed && <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">Configuración</div>}
            {isCollapsed && <div className="h-px w-full bg-slate-100 my-4"></div>}
            {isAdmin && (
              <>
                <Link href="/portal/usuarios" className={getLinkClass("/portal/usuarios")} title="Usuarios">
                  <Users size={20} className="shrink-0" />
                  {!isCollapsed && <span>Usuarios</span>}
                </Link>
                <Link href="/portal/facturacion" className={getLinkClass("/portal/facturacion")} title="Facturación">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-current font-bold text-[10px] shrink-0">$</span>
                  {!isCollapsed && <span>Facturación</span>}
                </Link>
              </>
            )}
            <Link href="/portal/settings" className={getLinkClass("/portal/settings")} title="Ajustes">
              <Settings size={20} className="shrink-0" />
              {!isCollapsed && <span>Ajustes</span>}
            </Link>
          </>
        )}

        {!isCollapsed && <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">Ayuda</div>}
        {isCollapsed && <div className="h-px w-full bg-slate-100 my-4"></div>}
        <a 
          href={isClient ? "/manuals/Manual_Usuario_Cliente_MH.pdf" : "/manuals/Manual_Usuario_Profesionales_MH.pdf"} 
          download={isClient ? "Manual_Usuario_Cliente_MH.pdf" : "Manual_Usuario_Profesionales_MH.pdf"}
          target="_blank" 
          rel="noopener noreferrer"
          title="Manual de Usuario"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 ${isCollapsed ? "justify-center px-0" : ""}`}
        >
          <BookOpen size={20} className="shrink-0" />
          {!isCollapsed && <span>Manual de Usuario</span>}
        </a>
      </div>
    </aside>
  )
}
