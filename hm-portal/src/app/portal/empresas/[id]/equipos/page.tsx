import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EquiposClient from "./EquiposClient";
import { getEquipments } from "@/app/actions/equipos";

export default async function EquiposPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const initialEquipments = await getEquipments(id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Activos y Mantenimiento Predictivo</h1>
          <p className="text-slate-500 text-sm mt-1">Directorio de maquinaria y equipos - {company.name}</p>
        </div>
      </div>
      
      <EquiposClient companyId={id} initialEquipments={initialEquipments} />
    </div>
  );
}
