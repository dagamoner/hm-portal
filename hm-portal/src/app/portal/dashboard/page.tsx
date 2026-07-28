import DashboardClient from "./DashboardClient";
import { getDashboardMetrics } from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const globalData = await getDashboardMetrics();

  // Si no hay datos (error), mostramos una versión en cero
  const fallbackData = {
    kpis: { frequencyRate: "0", severityRate: "0", lostDays: 0, openCriticalRisks: 0, overdueActions: 0, pctClosedOnTime: 100, pctControlsVerified: 100, pctInspections: 0 },
    monthlyTrend: [],
    riskByEstArray: [],
    paretoData: [],
    agingData: [],
    eventsByShift: []
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardClient data={globalData || fallbackData} />
    </div>
  );
}
