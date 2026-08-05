"use client";

import React, { useState } from "react";
import { BookOpenCheck, ShieldAlert } from "lucide-react";
import PoliciesClient from "./PoliciesClient";
import PSTClient from "./PSTClient";

export default function PoliticasPSTClient({ companyId, initialPolicies, initialPSTs, workers, tasks }: any) {
    const [activeTab, setActiveTab] = useState<'policies' | 'pst'>('policies');

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center gap-4 bg-white/60 p-6 rounded-3xl backdrop-blur-xl border border-white/50 shadow-sm">
                <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl">
                    <BookOpenCheck className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Políticas y Procedimientos (PST)</h2>
                    <p className="text-slate-500 font-medium">Gestión documental de políticas corporativas y Procedimientos Seguros de Trabajo / ATS.</p>
                </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 custom-scrollbar">
                <button 
                    onClick={() => setActiveTab('policies')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                        activeTab === 'policies' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/60 text-slate-600 hover:bg-white'
                    }`}
                >
                    <BookOpenCheck className="w-5 h-5" /> Repositorio de Políticas Institucionales
                </button>
                <button 
                    onClick={() => setActiveTab('pst')}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                        activeTab === 'pst' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/60 text-slate-600 hover:bg-white'
                    }`}
                >
                    <ShieldAlert className="w-5 h-5" /> Gestor de Procedimientos Seguros (PST / ATS)
                </button>
            </div>

            {activeTab === 'policies' && (
                <PoliciesClient companyId={companyId} initialPolicies={initialPolicies} workers={workers} />
            )}

            {activeTab === 'pst' && (
                <PSTClient companyId={companyId} initialPSTs={initialPSTs} tasks={tasks} />
            )}
        </div>
    );
}
