import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DashboardClient from "../../dashboard/DashboardClient";
import { getDashboardMetrics } from "@/app/actions/dashboard";

export default async function CompanyDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const companyData = await getDashboardMetrics(id);

  // Si no hay datos, mostramos fallback en cero
  const fallbackData = {
    companyName: company.name,
    kpis: { frequencyRate: "0", severityRate: "0", lostDays: 0, openCriticalRisks: 0, overdueActions: 0, pctClosedOnTime: 100, pctControlsVerified: 100, pctInspections: 0 },
    monthlyTrend: [],
    riskByEstArray: [],
    paretoData: [],
    agingData: [],
    eventsByShift: []
  };

  const finalData = companyData ? {
    companyName: company.name,
    ...companyData
  } : fallbackData;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardClient data={finalData} />
    </div>
  );
}
