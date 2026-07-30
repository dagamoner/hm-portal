import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MeasurementsClient from "./MeasurementsClient";
import { getMeasurements } from "@/app/actions/measurements";

export default async function MedicionesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const measurements = (await getMeasurements(id)) as any;

  return (
    <div className="space-y-6">
      <MeasurementsClient measurements={measurements} companyId={company.id} companyName={company.name} />
    </div>
  );
}
