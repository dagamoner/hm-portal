"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import BudgetPrintView, { BudgetData, BudgetItem } from "../components/BudgetPrintView";

export default function BudgetEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [budget, setBudget] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await fetch(`/api/budgets/${id}`);
        if (!res.ok) throw new Error("Error fetching budget");
        const data = await res.json();
        
        // Ensure items have the correct structure if they were saved differently
        const items = Array.isArray(data.items) ? data.items.map((item: any) => ({
          description: item.description || "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || item.price || 0,
          total: item.total || (item.quantity || 1) * (item.unitPrice || item.price || 0)
        })) : [];

        setBudget({ ...data, items });
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el presupuesto.");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchBudget();
  }, [id]);

  const handleSave = async () => {
    if (!budget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/budgets/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(budget),
      });
      if (!res.ok) throw new Error("Error saving budget");
      alert("Presupuesto guardado exitosamente");
    } catch (error) {
      console.error(error);
      alert("Error al guardar el presupuesto.");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const updateField = (field: keyof BudgetData, value: any) => {
    if (budget) {
      setBudget({ ...budget, [field]: value });
    }
  };

  const updateItem = (index: number, field: keyof BudgetItem, value: any) => {
    if (!budget) return;
    const newItems = [...budget.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Auto calculate total if quantity or price changes
    if (field === 'quantity' || field === 'unitPrice') {
      const q = Number(field === 'quantity' ? value : newItems[index].quantity) || 0;
      const p = Number(field === 'unitPrice' ? value : newItems[index].unitPrice) || 0;
      newItems[index].total = q * p;
    }

    const newTotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
    setBudget({ ...budget, items: newItems, total: newTotal });
  };

  const addItem = () => {
    if (!budget) return;
    const newItems = [...budget.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }];
    setBudget({ ...budget, items: newItems });
  };

  const removeItem = (index: number) => {
    if (!budget) return;
    const newItems = budget.items.filter((_, i) => i !== index);
    const newTotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
    setBudget({ ...budget, items: newItems, total: newTotal });
  };

  if (loading) {
    return <div className="p-8 text-center">Cargando presupuesto...</div>;
  }

  if (!budget) {
    return <div className="p-8 text-center text-red-500">Presupuesto no encontrado</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* LEFT: Editor Form (Hidden on Print) */}
      <div className="w-1/2 p-6 overflow-y-auto bg-white border-r border-gray-200 print:hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Editar Presupuesto #{budget.budgetNumber}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/portal/presupuestador')}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Imprimir PDF
            </button>
          </div>
        </div>

        <div className="space-y-6 flex-grow">
          {/* Client Details */}
          <section className="bg-gray-50 p-4 rounded border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Datos del Cliente</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={budget.clientName || ''}
                  onChange={(e) => updateField('clientName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={budget.clientCompany || ''}
                  onChange={(e) => updateField('clientCompany', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CUIL/CUIT</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={budget.clientCuil || ''}
                  onChange={(e) => updateField('clientCuil', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Domicilio</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={budget.clientAddress || ''}
                  onChange={(e) => updateField('clientAddress', e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  value={budget.reference || ''}
                  onChange={(e) => updateField('reference', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="bg-gray-50 p-4 rounded border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold">Ítems</h2>
              <button onClick={addItem} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
                + Agregar Ítem
              </button>
            </div>
            
            <div className="space-y-4">
              {budget.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-white p-3 border border-gray-200 rounded">
                  <div className="flex-grow">
                    <label className="block text-xs text-gray-500 mb-1">Descripción</label>
                    <textarea
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      rows={2}
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                    />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs text-gray-500 mb-1">Cant.</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      min="1"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500 mb-1">Precio Unit.</label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded p-2 text-sm"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))}
                      min="0"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs text-gray-500 mb-1">Total</label>
                    <div className="p-2 border border-transparent text-sm font-medium">
                      ${item.total.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    className="mt-6 text-red-500 hover:bg-red-50 p-2 rounded"
                    title="Eliminar"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex justify-end">
              <div className="text-lg font-bold text-gray-800 bg-white px-4 py-2 rounded border border-gray-200">
                Total Presupuesto: ${budget.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </section>

          {/* Important Note */}
          <section className="bg-gray-50 p-4 rounded border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">Nota Importante</h2>
            <textarea
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              rows={4}
              value={budget.importantNote || ''}
              onChange={(e) => updateField('importantNote', e.target.value)}
              placeholder="Escriba alguna nota o aclaración importante..."
            />
          </section>
        </div>
      </div>

      {/* RIGHT: Print Preview */}
      <div className="w-1/2 overflow-y-auto bg-gray-300 print:w-full print:bg-white print:overflow-visible flex flex-col p-8 print:p-0">
        <div className="bg-white shadow-2xl print:shadow-none mx-auto w-full max-w-[210mm] min-h-[297mm]">
          <BudgetPrintView budget={budget} />
        </div>
      </div>
    </div>
  );
}
