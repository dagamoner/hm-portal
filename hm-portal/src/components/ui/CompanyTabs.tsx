"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { 
    LayoutDashboard, FileText, Activity, Accessibility, Bug, AlertTriangle, 
    Search, ShieldAlert, Calendar, Truck, Server, Users, ClipboardCheck, 
    History, GraduationCap, TableProperties, Siren, Shield, HardHat, Receipt, Construction, BookOpenCheck, BookMarked, PieChart, Leaf, FlaskConical, Target, ChevronDown, Award, TrendingUp, Flame
} from "lucide-react";

export const MODULES = [
    { name: "Emergencias", path: "/emergencias", icon: Siren },
    { name: "Protección c/ Incendios", path: "/extintores", icon: Flame },
    { name: "Documentación", path: "/documentacion", icon: FileText },
    { name: "Mediciones y Prot.", path: "/mediciones", icon: Activity },
    { name: "Ergonomía", path: "/ergonomia", icon: Accessibility },
    { name: "Cancerígenos", path: "/cancerigenos", icon: Bug },
    { name: "Incidentes / Accidentes", path: "/incidentes", icon: AlertTriangle },
    { name: "Investigación", path: "/investigacion", icon: Search },
    { name: "Riesgos Inher.", path: "/riesgos", icon: ShieldAlert },
    { name: "Matriz Global", path: "/matriz", icon: TableProperties },
    { name: "Programa Anual", path: "/programa-anual", icon: Calendar },
    { name: "Vehículos", path: "/vehiculos", icon: Truck },
    { name: "Equipos y Activos", path: "/equipos", icon: Server },
    { name: "Personal", path: "/personal", icon: Users },
    { name: "Entrega EPP", path: "/epp", icon: Shield },
    { name: "Obras y Proyectos", path: "/obras", icon: Construction },
    { name: "Políticas y PST", path: "/politicas-pst", icon: BookOpenCheck },
    { name: "Inspecciones y Actas", path: "/visitas", icon: ClipboardCheck },
    { name: "Contratistas", path: "/contratistas", icon: HardHat },
    { name: "Capacitaciones", path: "/capacitaciones", icon: GraduationCap },
    { name: "Gestión Ambiental", path: "/ambiental", icon: Leaf },
    { name: "Productos Químicos", path: "/quimicos", icon: FlaskConical },
    { name: "Gestión CAPA", path: "/capa", icon: Target },
    { name: "Estadísticas SRT", path: "/siniestralidad", icon: TrendingUp },
    { name: "Normas ISO/IRAM/AEA", path: "/iso-iram", icon: Award },
].sort((a, b) => a.name.localeCompare(b.name));

export function CompanyTabs({ companyId, companyName, disabledModules = [] }: { companyId: string, companyName?: string, disabledModules?: string[] }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isClient, isAdmin, isInspector } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const allowedModules = MODULES.filter(m => {
        // Facturación is completely hidden from Client and Inspector
        if (m.path === "/facturacion" && !isAdmin) return false;
        return true;
    });

    if (isAdmin) {
        allowedModules.push({ name: "Reportes Gerenciales", path: "/reportes", icon: PieChart });
        allowedModules.push({ name: "Facturación", path: "/facturacion", icon: Receipt });
    }

    const tabsToRender = [
        ...(isClient ? [] : [{ name: "Dashboard 365", path: "", icon: LayoutDashboard }]),
        ...allowedModules
    ];

    // Ensure unique modules, just in case
    const uniqueTabs = Array.from(new Set(tabsToRender.map(t => t.path)))
      .map(path => tabsToRender.find(t => t.path === path)!);

    const activeModule = uniqueTabs.find(m => pathname === `/portal/empresas/${companyId}${m.path}`);

    return (
        <div className="print:hidden w-full bg-white/60 backdrop-blur-md border-b border-white/50 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {companyName && (
                    <div className="flex items-center gap-2 text-slate-800">
                        <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Trabajando en:</span>
                        <h2 className="text-xl font-black truncate">{companyName}</h2>
                    </div>
                )}
                
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between gap-3 w-full sm:w-[300px] px-5 py-3 bg-white border border-slate-200 shadow-sm rounded-2xl hover:bg-slate-50 transition-colors"
                    >
                        <div className="flex flex-col items-start text-left truncate">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Módulos de trabajo</span>
                            <span className="font-bold text-slate-800 text-sm truncate w-full flex items-center gap-2 mt-0.5">
                                {activeModule ? (
                                    <>
                                        <activeModule.icon className="w-4 h-4 text-indigo-600 shrink-0" />
                                        {activeModule.name}
                                    </>
                                ) : "Seleccionar módulo..."}
                            </span>
                        </div>
                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                        <div className="absolute top-full right-0 sm:left-0 mt-2 w-full sm:w-[350px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[60vh]">
                            <div className="overflow-y-auto custom-scrollbar p-2 grid grid-cols-1 gap-1">
                                {uniqueTabs.map((module) => {
                                    const href = `/portal/empresas/${companyId}${module.path}`;
                                    const isActive = pathname === href;
                                    const isDisabled = disabledModules.includes(module.path) && module.path !== ""; // Don't disable dashboard
                                    
                                    return (
                                        <button 
                                            key={module.path} 
                                            onClick={() => {
                                                if (isDisabled) return;
                                                setIsOpen(false);
                                                router.push(href);
                                            }}
                                            disabled={isDisabled}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left w-full transition-all ${
                                                isDisabled 
                                                    ? "opacity-50 cursor-not-allowed bg-slate-50" 
                                                    : isActive 
                                                        ? "bg-indigo-50 text-indigo-700 font-bold" 
                                                        : "text-slate-600 font-medium hover:bg-slate-50"
                                            }`}
                                        >
                                            <module.icon className={`w-4 h-4 ${isActive && !isDisabled ? 'text-indigo-600' : 'text-slate-400'}`} />
                                            <span className={isDisabled ? 'line-through decoration-slate-300' : ''}>{module.name}</span>
                                            {isDisabled && <span className="text-[10px] uppercase font-bold text-slate-400 ml-auto">No Disponible</span>}
                                            {isActive && !isDisabled && <div className="ml-auto w-2 h-2 rounded-full bg-indigo-600"></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
