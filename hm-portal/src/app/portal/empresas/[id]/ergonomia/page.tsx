import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ErgonomiaClient from "./ErgonomiaClient";
import { getErgonomicEvaluations } from "@/app/actions/ergonomics";

export default async function ErgonomiaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const evaluations = (await getErgonomicEvaluations(id)) as any;

  return (
    <div className="space-y-6">
      <ErgonomiaClient evaluations={evaluations} companyId={company.id} companyName={company.name} />
    </div>
  );
}
