"use client";

import { useState } from "react";
import { Leaf, Trash2 } from "lucide-react";
import { EnvironmentalMatrix } from "./EnvironmentalMatrix";
import { WasteManagement } from "./WasteManagement";

export function EnvironmentalClient({ companyId, initialAspects, initialWaste }: any) {
  const [activeTab, setActiveTab] = useState<"matriz" | "residuos">("matriz");
  const [aspects, setAspects] = useState(initialAspects);
  const [waste, setWaste] = useState(initialWaste);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-100 p-2 gap-2 bg-slate-50/50">
        <button
          onClick={() => setActiveTab("matriz")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "matriz"
              ? "bg-white text-emerald-700 shadow-sm border border-slate-200/60"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          <Leaf size={18} />
          Matriz de Aspectos e Impactos
        </button>
        <button
          onClick={() => setActiveTab("residuos")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "residuos"
              ? "bg-white text-orange-700 shadow-sm border border-slate-200/60"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          <Trash2 size={18} />
          Gestión de Residuos Peligrosos
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "matriz" ? (
          <EnvironmentalMatrix 
            companyId={companyId} 
            aspects={aspects} 
            setAspects={setAspects} 
          />
        ) : (
          <WasteManagement 
            companyId={companyId} 
            waste={waste} 
            setWaste={setWaste} 
          />
        )}
      </div>
    </div>
  );
}
