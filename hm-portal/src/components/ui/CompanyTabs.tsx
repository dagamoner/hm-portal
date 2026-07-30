"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { 
    LayoutDashboard, FileText, Activity, Accessibility, Bug, AlertTriangle, 
    Search, ShieldAlert, Calendar, Truck, Server, Users, ClipboardCheck, 
    History, GraduationCap, TableProperties, Siren
} from "lucide-react";

export const MODULES = [
    { name: "Emergencias", path: "/emergencias", icon: Siren },
    { name: "Documentación", path: "/documentacion", icon: FileText },
    { name: "Mediciones y Prot.", path: "/mediciones", icon: Activity },
    { name: "Ergonomía", path: "/ergonomia", icon: Accessibility },
    { name: "Cancerígenos", path: "/cancerigenos", icon: Bug },
    { name: "Incidentes", path: "/incidentes", icon: AlertTriangle },
    { name: "Investigación", path: "/investigacion", icon: Search },
    { name: "Riesgos Inher.", path: "/riesgos", icon: ShieldAlert },
    { name: "Matriz Global", path: "/matriz", icon: TableProperties },
    { name: "Programa Anual", path: "/programa-anual", icon: Calendar },
    { name: "Vehículos", path: "/vehiculos", icon: Truck },
    { name: "Equipos y Activos", path: "/equipos", icon: Server },
    { name: "Personal", path: "/personal", icon: Users },
    { name: "Visitas", path: "/visitas", icon: ClipboardCheck },
    { name: "Capacitaciones", path: "/capacitaciones", icon: GraduationCap },
];

export function CompanyTabs({ companyId }: { companyId: string }) {
    const pathname = usePathname();
    const { isClient } = useAuth();

    const tabsToRender = [
        ...(isClient ? [] : [{ name: "Dashboard 365", path: "", icon: LayoutDashboard }]),
        ...MODULES
    ];

    return (
        <div className="w-full bg-white/60 backdrop-blur-md border-b border-white/50 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex space-x-1 overflow-x-auto custom-scrollbar py-3">
                    {tabsToRender.map((module) => {
                        const href = `/portal/empresas/${companyId}${module.path}`;
                        const isActive = pathname === href;
                        return (
                            <Link 
                                key={module.path} 
                                href={href}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap text-sm font-bold transition-all ${
                                    isActive 
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                                        : "text-slate-500 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
                                }`}
                            >
                                <module.icon className="w-4 h-4" />
                                {module.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
