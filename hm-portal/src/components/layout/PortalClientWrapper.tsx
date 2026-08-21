"use client";

import { useState } from "react";
import { PortalSidebar } from "./PortalSidebar";
import { PortalHeader } from "./PortalHeader";
import { GlobalBackButton } from "@/components/ui/GlobalBackButton";
import { useSidebar } from "@/components/providers/SidebarProvider";

export function PortalClientWrapper({ children, header }: { children: React.ReactNode, header: React.ReactNode }) {
  const { isCollapsed, isMobileOpen, closeMobileSidebar } = useSidebar();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors selection:bg-indigo-100 selection:text-indigo-700 relative">
      {/* Overlay for mobile sidebar */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={closeMobileSidebar}
        />
      )}
      
      <PortalSidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-20' : 'md:ml-72'} print:ml-0`}>
        {header}
        <main className="flex-1 overflow-y-auto print:overflow-visible print:block p-4 sm:p-6 md:p-10 print:p-0 bg-slate-50/50 dark:bg-slate-900/50 transition-colors print:bg-transparent min-h-[calc(100vh-6rem)] print:min-h-0 relative">
          <GlobalBackButton />
          {children}
        </main>
      </div>
    </div>
  );
}
