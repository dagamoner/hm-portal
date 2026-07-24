"use client";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, ShieldAlert, Settings, Home, Users } from "lucide-react"

export function PortalSidebar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname.startsWith(path);
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
      isActive 
        ? "bg-indigo-50 text-indigo-700 font-semibold" 
        : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
    }`;
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen fixed left-0 top-0 flex flex-col z-50">
      <div className="h-24 flex items-center px-8 border-b border-slate-100">
        <Link href="/portal" className="flex items-center gap-2">
          <span className="text-2xl font-black text-indigo-900 tracking-tight">MH<span className="text-indigo-600">.</span> Portal</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4">Menu Principal</div>
        
        <Link href="/portal/dashboard" className={getLinkClass("/portal/dashboard")}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link href="/portal/empresas" className={getLinkClass("/portal/empresas")}>
          <Building2 size={20} />
          <span>Empresas</span>
        </Link>

        <Link href="/portal/incidentes" className={getLinkClass("/portal/incidentes")}>
          <ShieldAlert size={20} />
          <span>Incidentes</span>
        </Link>
        
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-6 mb-2 px-4">Configuración</div>
        <Link href="/portal/usuarios" className={getLinkClass("/portal/usuarios")}>
          <Users size={20} />
          <span>Usuarios</span>
        </Link>
        <Link href="/portal/settings" className={getLinkClass("/portal/settings")}>
          <Settings size={20} />
          <span>Ajustes</span>
        </Link>
      </div>
    </aside>
  )
}
