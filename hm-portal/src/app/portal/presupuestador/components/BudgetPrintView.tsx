import React from "react";
import { format } from "date-fns";

export interface BudgetItem {
  description: string;
  price: number;
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
    ? format(new Date(budget.date), "dd 'de' MMMM 'de' yyyy", {
        // We'll just do a simple fallback if no locale is available, 
        // but '14 de agosto de 2026' is what the PDF shows.
      })
    : "";
  
  // Custom date formatter for spanish
  const dateObj = budget.date ? new Date(budget.date) : new Date();
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const displayDate = `${dateObj.getDate()} de ${months[dateObj.getMonth()]} de ${dateObj.getFullYear()}`;

  return (
    <div className="bg-white text-black max-w-4xl mx-auto min-h-screen relative font-sans">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print-container { 
             padding: 1.5cm !important; 
             height: auto !important; 
             display: block !important; 
          }
          .print-mt-auto { margin-top: 4rem !important; }
        }
      `}} />
      
      <div className="print-container p-12 min-h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="w-28 h-28 flex items-center justify-center shrink-0">
            <img src="/logo-mh-gold.png" alt="MH Higiene y Seguridad Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-right pt-2 flex flex-col justify-center">
            <h1 className="text-2xl font-black text-[#d4af37] mb-2 uppercase tracking-wide">MH Higiene y Seguridad</h1>
            <p className="text-gray-500 text-[13px] uppercase tracking-widest font-semibold mb-1">Presupuesto de Servicios Técnicos</p>
            <p className="text-gray-400 text-[13px] tracking-wide">Mendoza, {displayDate}</p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-[2px] bg-gradient-to-r from-[#d4af37] to-gray-200 w-full mb-8"></div>

        {/* Client Box */}
        <div className="bg-gray-50/80 border border-gray-100 rounded-lg p-6 mb-10 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[14px]">
            <div>
              <p className="text-gray-800 mb-2 leading-relaxed">
                <span className="font-bold text-gray-900 uppercase text-[12px] tracking-wider block mb-1">Cliente / Empresa</span> 
                {budget.clientName} {budget.clientCompany ? ` - ${budget.clientCompany}` : ''}
              </p>
              <p className="text-gray-800 leading-relaxed">
                <span className="font-bold text-gray-900 uppercase text-[12px] tracking-wider block mb-1">CUIL / CUIT</span> 
                {budget.clientCuil || "No especificado"}
              </p>
            </div>
            <div>
              <p className="text-gray-800 mb-2 leading-relaxed">
                <span className="font-bold text-gray-900 uppercase text-[12px] tracking-wider block mb-1">Domicilio</span> 
                {budget.clientAddress || "No especificado"}
              </p>
              <p className="text-gray-800 leading-relaxed">
                <span className="font-bold text-gray-900 uppercase text-[12px] tracking-wider block mb-1">Referencia</span> 
                {budget.reference || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8 flex-grow">
          <table className="w-full text-[14px] border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-800 text-gray-900">
                <th className="py-3 px-4 text-left font-bold w-3/4 tracking-wide uppercase text-[12px]">Descripción del Servicio</th>
                <th className="py-3 px-4 text-right font-bold w-1/4 tracking-wide uppercase text-[12px]">Precio (ARS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {budget.items.map((item, index) => (
                <tr key={index} className="group">
                  <td className="py-4 px-4 text-gray-700 whitespace-pre-line leading-relaxed group-hover:bg-gray-50/50">{item.description}</td>
                  <td className="py-4 px-4 text-right text-gray-700 font-medium group-hover:bg-gray-50/50">${Number(item.price).toLocaleString('es-AR', { minimumFractionDigits: 0 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Totals Section */}
          <div className="flex justify-end mt-4">
            <div className="w-1/2 md:w-1/3">
              <div className="flex justify-between items-center py-4 px-6 bg-gray-900 text-white rounded-lg shadow-sm">
                <span className="font-bold text-[13px] tracking-widest uppercase">Total</span>
                <span className="font-bold text-lg tracking-wide">${Number(budget.total).toLocaleString('es-AR', { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Important Note */}
        {budget.importantNote && (
          <div className="mb-12 p-6 bg-gray-50/80 border border-gray-100 rounded-lg text-[13px] text-gray-600 leading-relaxed whitespace-pre-wrap break-inside-avoid">
            <span className="font-bold text-gray-900 tracking-wide uppercase text-[11px] block mb-2">Nota importante</span>
            {budget.importantNote}
          </div>
        )}

        {/* Signatures & Footer */}
        <div className="mt-auto print-mt-auto pt-24 print:pt-12 break-inside-avoid">
          <div className="flex justify-start mb-16">
            <div className="text-center">
              <div className="w-64 border-t border-gray-400 mb-2"></div>
              <p className="font-semibold text-gray-800 text-[13px] tracking-wide">Lic. mgter. Moner Dante Gabriel</p>
              <p className="font-semibold text-gray-800 text-[13px] tracking-wide">Lic. Moner Fernando Gabriel</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 text-[12px] text-gray-400 text-center flex flex-col md:flex-row justify-between items-center tracking-wide">
            <p className="font-medium text-gray-500 mb-2 md:mb-0">MH Higiene y Seguridad en el Trabajo | Mendoza, Argentina</p>
            <p className="font-medium">mhhigieneyseguridad@gmail.com | www.mhhigieneyseguridad.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
