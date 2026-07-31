import { getWorkers } from "@/app/actions/personal";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { Shield, FileCheck, FileWarning, Info } from "lucide-react";
import { EppInfoModal } from "./EppInfoModal";

export const metadata = {
  title: "Entrega de E.P.P. - HM Portal",
};

export default async function EppPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await requireAuth(id, ['ADMIN', 'MANAGER', 'INSPECTOR', 'CLIENT']);
  const workers = await getWorkers(id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600" />
            Entrega de E.P.P. (Res. 299/2011)
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Gestión y registro de entrega de Elementos de Protección Personal y Ropa de Trabajo.
          </p>
        </div>
        <EppInfoModal />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trabajador
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Puesto
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
                  Estado Planilla
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workers.map((worker: any) => {
                const eppDelivery = worker.eppDeliveries?.[0]; // latest if ordered by desc in getWorkers
                const hasEpp = !!eppDelivery;
                
                return (
                  <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">
                        {worker.lastName}, {worker.firstName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                      {worker.documentId}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {worker.primaryRole?.name || "No asignado"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {hasEpp ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            <FileCheck className="w-3.5 h-3.5" />
                            Completada
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400">
                            Act: {new Date(eppDelivery.updatedAt).toLocaleDateString('es-AR')}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                          <FileWarning className="w-3.5 h-3.5" />
                          Falta Planilla
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/portal/empresas/${id}/epp/${worker.id}`}
                        className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                      >
                        {hasEpp ? 'Ver / Editar' : 'Llenar Planilla'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {workers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No hay trabajadores registrados en esta empresa.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
