import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AuditRunClient } from "./AuditRunClient";

export default async function AuditRunPage({ params }: { params: { id: string, auditId: string } }) {
  const { id: companyId, auditId } = params;

  const inspection = await prisma.inspection.findUnique({
    where: { id: auditId },
    include: {
      company: {
        select: { name: true }
      }
    }
  });

  if (!inspection) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <AuditRunClient 
        companyId={companyId}
        inspection={inspection}
      />
    </div>
  );
}
