import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getEmergencyPlans, getEmergencyDrills, getBrigadeMembers, getEmergencyEquipment } from "@/app/actions/emergencias";
import { getWorkers } from "@/app/actions/personal";
import EmergencyClient from "./EmergencyClient";

export default async function EmergenciasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  // Fetch initial data
  const [plans, drills, brigadistas, equipment, workers] = await Promise.all([
    getEmergencyPlans(id),
    getEmergencyDrills(id),
    getBrigadeMembers(id),
    getEmergencyEquipment(id),
    getWorkers(id)
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Emergencias y Contingencias</h2>
          <p className="text-slate-500 mt-1">Gestión de PGE, Simulacros, Brigadas y Equipamiento</p>
        </div>
      </div>

      <EmergencyClient 
        companyId={id} 
        initialPlans={plans}
        initialDrills={drills}
        initialBrigadistas={brigadistas}
        initialEquipment={equipment}
        availableWorkers={workers}
      />
    </div>
  );
}
