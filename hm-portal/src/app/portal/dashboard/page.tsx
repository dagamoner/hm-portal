import DashboardClient from "./DashboardClient";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const { role, companyId } = session.user;
  const isGlobalAdmin = role === "ADMIN" || role === "MANAGER";
  
  // Si no es admin y no tiene empresa asignada, mostramos cero
  if (!isGlobalAdmin && !companyId) {
    return <div className="p-10 text-center text-slate-500">No tienes una empresa asignada. Contacta al administrador.</div>;
  }

  const globalData = await getDashboardMetrics(isGlobalAdmin ? undefined : companyId);
  const fallbackData = {
    kpis: { frequencyRate: "0", severityRate: "0", lostDays: 0, openCriticalRisks: 0, overdueActions: 0, pctClosedOnTime: 0, pctControlsVerified: 0, totalInspections: 0, trainingCompliancePct: 0, eppCoveragePct: 0 },
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
