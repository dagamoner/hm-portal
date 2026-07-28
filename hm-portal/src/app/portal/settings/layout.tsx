"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldAlert, Settings as SettingsIcon } from "lucide-react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${
      isActive 
        ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100" 
        : "text-slate-600 hover:bg-slate-50 border border-transparent"
    }`;
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Menú de Ajustes</h2>
          <nav className="flex flex-col space-y-2">
            <Link href="/portal/settings" className={getLinkClass("/portal/settings")}>
              <SettingsIcon size={20} />
              <span>General</span>
            </Link>
            <Link href="/portal/settings/log-auditoria" className={getLinkClass("/portal/settings/log-auditoria")}>
              <ShieldAlert size={20} />
              <span>Log Auditoría</span>
            </Link>
          </nav>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
