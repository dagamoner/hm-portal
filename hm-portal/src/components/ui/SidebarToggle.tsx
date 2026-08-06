"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/providers/SidebarProvider";

export function SidebarToggle() {
  const { toggleSidebar } = useSidebar();

  return (
    <button 
      onClick={toggleSidebar} 
      className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors hidden md:block shrink-0"
    >
      <Menu className="w-5 h-5" />
    </button>
  );
}
