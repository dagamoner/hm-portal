"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/providers/SidebarProvider";

export function MobileSidebarToggle() {
  const { toggleMobileSidebar } = useSidebar();

  return (
    <button 
      onClick={toggleMobileSidebar}
      className="md:hidden p-2 -ml-2 mr-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      title="Abrir menú"
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}
