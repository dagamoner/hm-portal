import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getEquipmentAnalysis } from "@/app/actions/equipos";
import AnalysisClient from "./AnalysisClient";

export default async function EquipmentAnalysisPage({ params }: { params: Promise<{ id: string, equipmentId: string }> }) {
  const { id, equipmentId } = await params;

  const data = await getEquipmentAnalysis(equipmentId);

  if (!data) {
    notFound();
  }

  const { equipment, analysis } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
            <span>Bitácora Técnica: {equipment.name}</span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                equipment.status === 'Operativo' ? 'bg-emerald-50 text-emerald-700' :
                equipment.status === 'En Mantenimiento' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              }`}>
              {equipment.status}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{equipment.category} | {equipment.hours.toLocaleString()} horas de operación acumuladas</p>
        </div>
      </div>

      <AnalysisClient equipment={equipment} analysis={analysis} companyId={id} />
    </div>
  );
}
