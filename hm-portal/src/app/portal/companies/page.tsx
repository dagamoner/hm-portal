import { prisma } from "@/lib/prisma"
import { Building2, Search, Plus } from "lucide-react"

import Link from "next/link";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Directorio de Empresas</h2>
        <Link href="/portal/companies/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium shadow-sm transition-colors">
          <Plus size={18} />
          <span>Nueva Empresa</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o CUIT..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Empresa</th>
                <th className="p-4 font-semibold">CUIT</th>
                <th className="p-4 font-semibold">Industria</th>
                <th className="p-4 font-semibold">Riesgo</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    <Building2 className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <p className="font-medium text-slate-600">No hay empresas registradas</p>
                    <p className="text-sm">Comienza agregando tu primera empresa cliente.</p>
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <td className="p-4">
                      <p className="font-bold text-slate-900">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.address}</p>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{company.taxId}</td>
                    <td className="p-4 text-sm text-slate-600">{company.industry}</td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        company.riskLevel === 'HIGH' ? 'bg-rose-100 text-rose-700' :
                        company.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {company.riskLevel}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-indigo-600 font-medium text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Gestionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
