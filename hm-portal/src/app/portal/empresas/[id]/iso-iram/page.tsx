import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { IsoIramClient } from "./IsoIramClient";

export const metadata = {
  title: "Sistemas de Gestión ISO/IRAM/AEA | Portal MH",
};

export default async function IsoIramPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  // Fetch real CAPAs (No Conformities)
  const capas = await prisma.capa.findMany({
    where: { companyId: id },
    orderBy: { reportDate: 'desc' },
    take: 5
  });

  const openCapasCount = await prisma.capa.count({
    where: { companyId: id, status: 'ABIERTO' }
  });

  const realData = {
    capas,
    openCapasCount
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Sistemas de Gestión y Mejora Continua
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-4xl transition-colors">
          Auditorías y seguimiento de normas ISO 45001, IRAM y Reglamentaciones AEA para la empresa {company.name}.
        </p>
      </div>

      <IsoIramClient companyId={id} realData={realData} />
    </div>
  );
}
