import DashboardClient from "./DashboardClient";

export default function DashboardPage() {
  const globalData = {
    stats: {
        daysWithoutIncidents: "142",
        frequencyRate: "2.4%",
        openIncidents: "3",
        compliance: "94%"
    },
    chartData: [
        { name: 'Ene', incidentes: 4 },
        { name: 'Feb', incidentes: 2 },
        { name: 'Mar', incidentes: 6 },
        { name: 'Abr', incidentes: 1 },
        { name: 'May', incidentes: 3 },
        { name: 'Jun', incidentes: 0 },
    ],
    pieData: [
        { name: 'Caídas', value: 40 },
        { name: 'Cortes', value: 30 },
        { name: 'Eléctrico', value: 20 },
        { name: 'Químico', value: 10 },
    ],
    pieTotal: "72",
    auditedWorkers: "1,248",
    monthlyInspections: "86"
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardClient data={globalData} />
    </div>
  );
}
