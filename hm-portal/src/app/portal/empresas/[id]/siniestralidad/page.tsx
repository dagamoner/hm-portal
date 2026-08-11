import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SiniestralidadClient } from "./SiniestralidadClient";

export const metadata = {
  title: "Estadísticas SRT | Portal MH",
};

export default async function SiniestralidadPage({
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

  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);

  // 1. Trabajadores Activos Reales
  const workersCount = await prisma.worker.count({
    where: { companyId: id }
  });

  // 2. Incidentes del año en curso
  const incidents = await prisma.incident.findMany({
    where: { 
      companyId: id,
      date: { gte: startOfYear }
    }
  });

  const incidentCount = incidents.length;

  // 3. Días Perdidos Reales (extraídos del JSON details si existen)
  let lostDays = 0;
  incidents.forEach(inc => {
    const details = inc.details as any;
    if (details) {
      if (typeof details.diasPerdidos === 'number') {
        lostDays += details.diasPerdidos;
      } else if (typeof details.daysLost === 'number') {
        lostDays += details.daysLost;
      } else if (typeof details.dias_baja === 'number') {
        lostDays += details.dias_baja;
      }
    }
  });

  let hhtMensuales = 0;
  if (company.keyData) {
    try {
      const parsed = JSON.parse(company.keyData);
      if (parsed.hhtMensuales) hhtMensuales = Number(parsed.hhtMensuales);
    } catch (e) {
      // Ignorar errores de parseo
    }
  }

  const realStats = {
    trabajadoresPromedio: workersCount,
    hhtMensuales, // Ahora lo leemos del keyData que actualiza el inspector
    accidentesTotales: incidentCount,
    diasPerdidos: lostDays,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Estadísticas y Siniestralidad Oficial
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-4xl transition-colors">
          Cálculo automático de los índices exigidos por la Superintendencia de Riesgos del Trabajo (Res. 222/98) para {company.name}.
        </p>
      </div>

      <SiniestralidadClient companyId={id} realStats={realStats} />
    </div>
  );
}
