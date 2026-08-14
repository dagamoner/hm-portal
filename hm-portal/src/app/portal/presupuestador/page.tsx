"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calculator, Plus, Search, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PresupuestadorList() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await fetch("/api/budgets");
      if (res.ok) {
        const data = await res.json();
        setBudgets(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar presupuestos");
    } finally {
      setLoading(false);
    }
  };

  const createBudget = async () => {
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: "Nuevo Cliente",
          items: [],
          total: 0
        })
      });
      if (res.ok) {
        const newBudget = await res.json();
        router.push(`/portal/presupuestador/${newBudget.id}`);
      } else {
        toast.error("Error al crear presupuesto");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear presupuesto");
    }
  };

  const deleteBudget = async (id: string) => {
    if (!confirm("¿Eliminar presupuesto?")) return;
    try {
      const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Presupuesto eliminado");
        fetchBudgets();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar");
    }
  };

  const filteredBudgets = budgets.filter(b => 
    b.budgetNumber.toLowerCase().includes(search.toLowerCase()) ||
    (b.clientName || "").toLowerCase().includes(search.toLowerCase()) ||
    (b.clientCompany || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-indigo-600" />
            Presupuestador
          </h1>
          <p className="text-slate-500 mt-1">Crea y administra presupuestos de servicios técnicos.</p>
        </div>
        <button 
          onClick={createBudget}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Nuevo Presupuesto
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Buscar por cliente, empresa o número..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500">Cargando...</div>
        ) : filteredBudgets.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Calculator className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-bold text-lg">No hay presupuestos</p>
            <p>Crea tu primer presupuesto para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                  <th className="p-4 font-bold">Número</th>
                  <th className="p-4 font-bold">Fecha</th>
                  <th className="p-4 font-bold">Cliente</th>
                  <th className="p-4 font-bold">Empresa</th>
                  <th className="p-4 font-bold text-right">Total (ARS)</th>
                  <th className="p-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredBudgets.map(b => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-indigo-600">{b.budgetNumber}</td>
                    <td className="p-4 text-slate-600">{new Date(b.date).toLocaleDateString('es-AR')}</td>
                    <td className="p-4 font-medium text-slate-800">{b.clientName || "-"}</td>
                    <td className="p-4 text-slate-600">{b.clientCompany || "-"}</td>
                    <td className="p-4 font-black text-slate-800 text-right">
                      ${Number(b.total || 0).toLocaleString('es-AR')}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/portal/presupuestador/${b.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button onClick={() => deleteBudget(b.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
