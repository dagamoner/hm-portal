"use client";

import { useState } from "react";
import { FlaskConical, Plus } from "lucide-react";
import { ChemicalList } from "./ChemicalList";
import { ChemicalForm } from "./ChemicalForm";

export function ChemicalsClient({ companyId, initialProducts }: any) {
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const [products, setProducts] = useState(initialProducts);

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
          <FlaskConical size={18} />
          Inventario y FDS
        </button>
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "form"
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/60"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          <Plus size={18} />
          Registrar Producto Químico
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "list" ? (
          <ChemicalList 
            companyId={companyId} 
            products={products} 
            setProducts={setProducts} 
          />
        ) : (
          <ChemicalForm 
            companyId={companyId} 
            onSuccess={(newProduct: any) => {
              setProducts([newProduct, ...products]);
              setActiveTab("list");
            }} 
            onCancel={() => setActiveTab("list")}
          />
        )}
      </div>
    </div>
  );
}
