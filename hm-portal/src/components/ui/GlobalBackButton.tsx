"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

export function GlobalBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show on root paths where going "back" doesn't make sense within the portal
  const hiddenPaths = ["/portal/dashboard"];
  
  // Extra safety: only show if we are in /portal and not exactly /portal (though /portal redirects to dashboard usually)
  if (!pathname.startsWith("/portal") || pathname === "/portal" || hiddenPaths.includes(pathname)) {
    return null;
  }

  const handleBack = () => {
    // Implement structural "Up" navigation for better predictability
    // If we are at /portal/empresas/[id]/personal, going up means /portal/empresas/[id]
    // If we are at /portal/empresas/[id], going up means /portal/empresas
    // etc.
    
    // Split the path and remove the last segment
    const segments = pathname.split('/').filter(Boolean);
    
    if (segments.length > 2) {
      // e.g. ["portal", "empresas", "123", "personal"] -> remove "personal"
      // If we are in ["portal", "empresas", "123"] -> remove "123" -> ["portal", "empresas"]
      segments.pop();
      const parentPath = "/" + segments.join("/");
      router.push(parentPath);
    } else if (segments.length === 2 && segments[0] === "portal") {
      // e.g. ["portal", "empresas"] -> go to dashboard
      router.push("/portal/dashboard");
    } else {
      // Fallback
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-4 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 shadow-sm rounded-lg group w-fit"
    >
      <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
      <span className="text-sm font-medium">Volver</span>
    </button>
  );
}
