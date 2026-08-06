"use client";

import { useState } from "react";
import { Target, Plus } from "lucide-react";
import { CapaList } from "./CapaList";
import { CapaForm } from "./CapaForm";
import { useAuth } from "@/components/providers/AuthProvider";

export function CapaClient({ companyId, initialCapas }: any) {
  const { isClient } = useAuth();
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [capas, setCapas] = useState(initialCapas);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
        <button
          onClick={() => setActiveTab("list")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "list"
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          <Target size={18} />
          Casos CAPA
        </button>
        {!isClient && (
          <button
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === "form"
                ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60"
                : "text-slate-500 hover:bg-white/60"
            }`}
          >
            <Plus size={18} />
            Nuevo Caso CAPA
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "list" ? (
          <CapaList 
            companyId={companyId} 
            capas={capas} 
            setCapas={setCapas} 
          />
        ) : (
          <CapaForm 
            companyId={companyId} 
            onSuccess={(newCapa: any) => {
              setCapas([newCapa, ...capas]);
              setActiveTab("list");
            }} 
            onCancel={() => setActiveTab("list")}
          />
        )}
      </div>
    </div>
  );
}
