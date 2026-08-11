import { prisma } from "@/lib/prisma";
import { AuditoriasClient } from "./AuditoriasClient";

export default async function AuditoriasPage({ params }: { params: { id: string } }) {
  const companyId = params.id;

  const [inspections, templates] = await Promise.all([
    prisma.inspection.findMany({
      where: { companyId },
      orderBy: { date: 'desc' }
    }),
    prisma.checklistTemplate.findMany({
      where: {
        OR: [
          { companyId },
          { companyId: null }
        ]
      },
      orderBy: { name: 'asc' }
    })
  ]);

  return (
    <AuditoriasClient 
      companyId={companyId} 
      initialInspections={inspections} 
      templates={templates} 
    />
  );
}
