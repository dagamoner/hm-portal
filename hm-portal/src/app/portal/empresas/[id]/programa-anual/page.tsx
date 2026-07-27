import { prisma } from "@/lib/prisma";
import { getTrainingPlanData } from "@/app/actions/programa-anual";
import ProgramaAnualClient from "./ProgramaAnualClient";
import { notFound } from "next/navigation";

export default async function ProgramaAnualPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company) notFound();

  const topics = await getTrainingPlanData(id);

  return (
    <ProgramaAnualClient 
      companyId={company.id}
      companyName={company.name}
      topics={topics}
    />
  );
}
