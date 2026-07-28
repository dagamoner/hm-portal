import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import VehiculosClient from "./VehiculosClient";
import { getVehicles } from "@/app/actions/vehiculos";

export default async function VehiculosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const initialVehicles = await getVehicles(id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Flota Vehicular</h1>
          <p className="text-slate-500 text-sm mt-1">Directorio y registro de unidades - {company.name}</p>
        </div>
      </div>
      
      <VehiculosClient companyId={id} initialVehicles={initialVehicles} />
    </div>
  );
}
