import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getVehicleDiagnosis } from "@/app/actions/vehiculos";
import DiagnosisClient from "./DiagnosisClient";

export default async function VehicleDiagnosisPage({ params }: { params: Promise<{ id: string, vehicleId: string }> }) {
  const { id, vehicleId } = await params;

  const data = await getVehicleDiagnosis(vehicleId);

  if (!data) {
    notFound();
  }

  const { vehicle, diagnosis } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center space-x-3">
            <span>Ficha Técnica: {vehicle.plate}</span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                vehicle.status === 'Disponible' ? 'bg-emerald-50 text-emerald-700' :
                vehicle.status === 'En Mantenimiento' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              }`}>
              {vehicle.status}
            </span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">{vehicle.type} | {vehicle.brand} {vehicle.model} ({vehicle.year})</p>
        </div>
      </div>

      <DiagnosisClient vehicle={vehicle} diagnosis={diagnosis} companyId={id} />
    </div>
  );
}
