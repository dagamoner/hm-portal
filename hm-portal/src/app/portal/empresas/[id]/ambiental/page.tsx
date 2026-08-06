import { prisma } from "@/lib/prisma";
import { EnvironmentalClient } from "./EnvironmentalClient";

export default async function AmbientalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch Environmental Aspects
  const aspects = await prisma.environmentalAspect.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" }
  });

  // Fetch Hazardous Waste
  const waste = await prisma.hazardousWaste.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Gestión Ambiental y Residuos</h1>
        <p className="text-slate-500 mt-1">Identificación de aspectos, evaluación de impactos y seguimiento de residuos peligrosos.</p>
      </div>

      <EnvironmentalClient 
        companyId={id} 
        initialAspects={aspects} 
        initialWaste={waste} 
      />
    </div>
  );
}
