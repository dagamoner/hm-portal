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
          .print-container { padding: 2cm !important; }
        }
      `}} />
      
      <div className="print-container p-12 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="w-32 h-32 flex items-center justify-center shrink-0">
            <img src="/logo-mh-gold.png" alt="MH Higiene y Seguridad Logo" className="w-full h-full object-contain" />
          </div>
          <div className="text-right pt-2">
            <h1 className="text-3xl font-bold text-[#d4af37] mb-1 tracking-tight">MH Higiene y Seguridad</h1>
            <p className="text-gray-600 text-[15px]">Presupuesto de Servicios Técnicos</p>
            <p className="text-gray-600 text-[15px] mt-2">Fecha: {displayDate}</p>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px bg-[#d4af37] w-full mb-6"></div>

        {/* Client Box */}
        <div className="bg-[#f8f9fa] p-5 mb-8">
          <p className="text-[15px] text-gray-800 mb-1">
            <span className="font-bold">Cliente:</span> {budget.clientName} 
            {budget.clientCompany ? ` - ${budget.clientCompany}` : ''}
            {budget.clientCuil ? ` (CUIL/CUIT: ${budget.clientCuil})` : ''}
            {budget.clientAddress ? ` - Domicilio: ${budget.clientAddress}` : ''}
          </p>
          <p className="text-[15px] text-gray-800">
            <span className="font-bold">Referencia:</span> {budget.reference || "-"}
          </p>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full text-[15px] border-collapse">
            <thead>
              <tr className="bg-[#34495e] text-white">
                <th className="py-3 px-4 text-left font-bold w-3/4">Descripción del Servicio</th>
                <th className="py-3 px-4 text-right font-bold w-1/4">Precio<br/>(ARS)</th>
              </tr>
            </thead>
            <tbody>
              {budget.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-300">
                  <td className="py-4 px-4 text-gray-800 whitespace-pre-line">{item.description}</td>
                  <td className="py-4 px-4 text-right text-gray-800">${Number(item.price).toLocaleString('es-AR', { minimumFractionDigits: 0 })}</td>
                </tr>
              ))}
              <tr className="bg-[#f8f9fa] border-b border-gray-300">
                <td className="py-4 px-4 font-bold text-gray-800">TOTAL</td>
                <td className="py-4 px-4 text-right font-bold text-gray-800">${Number(budget.total).toLocaleString('es-AR', { minimumFractionDigits: 0 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Important Note */}
        {budget.importantNote && (
          <div className="mb-12 text-[14px] text-gray-600">
            <span className="font-bold">Nota importante:</span> {budget.importantNote}
          </div>
        )}

        {/* Signatures & Footer */}
        <div className="mt-auto pt-24">
          <div className="flex justify-start mb-12">
            <div className="text-left">
              <p className="font-medium text-gray-800 text-[15px]">Firma Lic. mgter. Moner Dante Gabriel y Lic. Moner Fernando Gabriel</p>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-4 text-[13px] text-gray-500 text-left">
            <p>MH Higiene y Seguridad en el Trabajo | Mendoza, Argentina</p>
            <p>mail: mhhigieneyseguridad@gmail.com / www.mhhigieneyseguridad.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
