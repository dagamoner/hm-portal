import React from "react";
import { format } from "date-fns";

export interface BudgetItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface BudgetData {
  id: string;
  budgetNumber: string;
  date: string | Date;
  clientName: string;
  clientCompany?: string | null;
  clientCuil?: string | null;
  clientAddress?: string | null;
  reference?: string | null;
  items: BudgetItem[];
  total: number;
  importantNote?: string | null;
}

export default function BudgetPrintView({ budget }: { budget: BudgetData }) {
  const formattedDate = budget.date
    ? format(new Date(budget.date), "dd/MM/yyyy")
    : "";

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto min-h-screen relative font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-container { padding: 2cm !important; }
        }
      `}} />
      
      <div className="print-container h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">PRESUPUESTO</h1>
            <p className="text-gray-500 mt-1">Nº {budget.budgetNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-blue-900">HM Portal</h2>
            <p className="text-sm text-gray-600">Servicios de Higiene y Seguridad</p>
            <p className="text-sm text-gray-600">Fecha: {formattedDate}</p>
          </div>
        </div>

        {/* Client Box */}
        <div className="bg-gray-100 p-6 rounded-lg mb-8 border border-gray-200">
          <h3 className="font-bold text-gray-700 mb-4 uppercase text-sm tracking-wider border-b border-gray-300 pb-2">Datos del Cliente</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-semibold">Nombre:</span> {budget.clientName}</p>
              {budget.clientCompany && <p><span className="font-semibold">Empresa:</span> {budget.clientCompany}</p>}
              {budget.clientCuil && <p><span className="font-semibold">CUIL/CUIT:</span> {budget.clientCuil}</p>}
            </div>
            <div>
              {budget.clientAddress && <p><span className="font-semibold">Domicilio:</span> {budget.clientAddress}</p>}
              {budget.reference && <p><span className="font-semibold">Referencia:</span> {budget.reference}</p>}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 flex-grow">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="py-3 px-4 text-left rounded-tl-lg">Descripción</th>
                <th className="py-3 px-4 text-right">Cantidad</th>
                <th className="py-3 px-4 text-right">Precio Unitario</th>
                <th className="py-3 px-4 text-right rounded-tr-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {budget.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 even:bg-gray-50">
                  <td className="py-3 px-4 whitespace-pre-line">{item.description}</td>
                  <td className="py-3 px-4 text-right">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">${item.unitPrice.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                  <td className="py-3 px-4 text-right font-medium">${item.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div className="flex justify-end mt-4">
            <div className="w-1/3">
              <div className="flex justify-between items-center py-3 px-4 bg-gray-100 rounded-lg border border-gray-200">
                <span className="font-bold text-lg text-gray-700">TOTAL</span>
                <span className="font-bold text-lg text-blue-900">${budget.total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        {budget.importantNote && (
          <div className="mb-8 p-4 bg-blue-50 text-blue-900 rounded-lg border border-blue-100 text-sm">
            <h4 className="font-bold mb-2">Nota Importante:</h4>
            <p className="whitespace-pre-line">{budget.importantNote}</p>
          </div>
        )}

        {/* Footer & Signature */}
        <div className="mt-auto pt-16">
          <div className="flex justify-end">
            <div className="text-center w-64">
              <div className="border-t border-gray-400 mb-2 pt-2">
                <p className="font-bold text-gray-800">Firma y Aclaración</p>
                <p className="text-sm text-gray-500">HM Portal - Área de Presupuestos</p>
              </div>
            </div>
          </div>
          <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-200 pt-4">
            <p>Este presupuesto tiene una validez de 15 días desde su emisión.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
