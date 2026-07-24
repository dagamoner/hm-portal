import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DashboardClient from "../../dashboard/DashboardClient";

export default async function CompanyDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  // Generamos "dummy data" simulada basada en el nivel de riesgo y la cantidad de trabajadores
  // para que el dashboard se vea completo hasta que implementemos los módulos reales de incidentes.
  
  const totalWorkers = (company.workersAdmin || 0) + (company.workersOps || 0);
  
  let riskMultiplier = 1;
  switch (company.riskLevel) {
    case 'LOW': riskMultiplier = 0.5; break;
    case 'MEDIUM': riskMultiplier = 1; break;
    case 'HIGH': riskMultiplier = 2; break;
    case 'CRITICAL': riskMultiplier = 3.5; break;
  }

  const generatedIncidents = Math.round(totalWorkers * 0.05 * riskMultiplier);
  const openIncidents = Math.max(0, Math.round(generatedIncidents * 0.2));

  const chartData = [
    { name: 'Ene', incidentes: Math.max(0, generatedIncidents - 2) },
    { name: 'Feb', incidentes: Math.max(0, generatedIncidents + 1) },
    { name: 'Mar', incidentes: Math.max(0, generatedIncidents - 1) },
    { name: 'Abr', incidentes: Math.max(0, generatedIncidents + 2) },
    { name: 'May', incidentes: generatedIncidents },
    { name: 'Jun', incidentes: openIncidents },
  ];

  const pieData = [
    { name: 'Caídas', value: Math.round(generatedIncidents * 0.4) || 2 },
    { name: 'Cortes', value: Math.round(generatedIncidents * 0.3) || 1 },
    { name: 'Eléctrico', value: Math.round(generatedIncidents * 0.2) || 1 },
    { name: 'Ergonómico', value: Math.round(generatedIncidents * 0.1) || 1 },
  ];
  
  const pieTotal = pieData.reduce((acc, curr) => acc + curr.value, 0).toString();

  const companyData = {
    companyName: company.name,
    stats: {
        daysWithoutIncidents: company.riskLevel === 'CRITICAL' ? "12" : (company.riskLevel === 'LOW' ? "245" : "64"),
        frequencyRate: `${(2.4 * riskMultiplier).toFixed(1)}%`,
        openIncidents: openIncidents.toString(),
        compliance: `${company.safetyCompliance}%`
    },
    chartData,
    pieData,
    pieTotal,
    auditedWorkers: totalWorkers.toLocaleString(),
    monthlyInspections: Math.max(4, Math.round(totalWorkers * 0.1)).toString()
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardClient data={companyData} />
    </div>
  );
}
