import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CancerigenosClient from "./CancerigenosClient";

import { getCancerigenoEvaluations } from "@/app/actions/cancerigenos";

export default async function CancerigenosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const presentaciones = (await getCancerigenoEvaluations(company.id)) as any;

  return (
    <div className="space-y-6">
      <CancerigenosClient presentaciones={presentaciones} companyId={company.id} companyName={company.name} />
    </div>
  );
}
