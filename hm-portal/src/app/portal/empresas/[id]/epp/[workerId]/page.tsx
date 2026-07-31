import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EppDeliveryForm from "./EppDeliveryForm";
import { getEppDeliveryByWorker } from "@/app/actions/epp";

export default async function WorkerEppPage({ params }: { params: Promise<{ id: string, workerId: string }> }) {
  const { id, workerId } = await params;
  await requireAuth(id, ['ADMIN', 'MANAGER', 'INSPECTOR', 'CLIENT']);

  // Fetch company info
  const company = await prisma.company.findUnique({
    where: { id }
  });

  // Fetch worker info
  const worker = await prisma.worker.findUnique({
    where: { id: workerId },
    include: {
      primaryRole: true,
      establishment: true
    }
  });

  if (!company || !worker) {
    redirect(`/portal/empresas/${id}/epp`);
  }

  // Fetch existing EPP Delivery form if any
  const existingDelivery = await getEppDeliveryByWorker(workerId, id);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <EppDeliveryForm 
        company={company} 
        worker={worker} 
        existingDelivery={existingDelivery} 
      />
    </div>
  );
}
