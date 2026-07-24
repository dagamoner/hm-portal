import { createCompany } from "@/actions/company";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";

export default function NewCompanyPage() {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/portal/companies" className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800">Agregar Nueva Empresa</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-xl">
            <Building2 size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Información del Cliente</h3>
            <p className="text-sm text-slate-500">Ingresa los datos fiscales y operativos de la nueva empresa.</p>
          </div>
        </div>

        <form action={createCompany} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">Razón Social</label>
              <input type="text" id="name" name="name" required placeholder="Ej: Industria Metalúrgica S.A." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="taxId" className="text-sm font-semibold text-slate-700">CUIT</label>
              <input type="text" id="taxId" name="taxId" required placeholder="Ej: 30-12345678-9" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="industry" className="text-sm font-semibold text-slate-700">Industria</label>
              <select id="industry" name="industry" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-slate-700">
                <option value="Construcción">Construcción</option>
                <option value="Minería">Minería</option>
                <option value="Petróleo y Gas">Petróleo y Gas</option>
                <option value="Manufactura">Manufactura</option>
                <option value="Agropecuaria">Agropecuaria</option>
                <option value="Servicios">Servicios</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="riskLevel" className="text-sm font-semibold text-slate-700">Nivel de Riesgo SRT</label>
              <select id="riskLevel" name="riskLevel" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50 text-slate-700">
                <option value="LOW">Bajo (Clase 1-2)</option>
                <option value="MEDIUM">Medio (Clase 3)</option>
                <option value="HIGH">Alto (Clase 4-5)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="address" className="text-sm font-semibold text-slate-700">Domicilio Legal</label>
            <input type="text" id="address" name="address" placeholder="Calle, Número, Localidad, Provincia" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50" />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <Link href="/portal/companies" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancelar
            </Link>
            <button type="submit" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
              Guardar Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
