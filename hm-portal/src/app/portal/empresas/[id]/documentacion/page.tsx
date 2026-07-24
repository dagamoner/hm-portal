import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import DocumentationClient from "./DocumentationClient";
import { getDocumentsByCompany } from "@/app/actions/documents";

export default async function DocumentacionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const documents = await getDocumentsByCompany(id);

  return (
    <div className="space-y-6">
      <DocumentationClient documents={documents} companyId={company.id} companyName={company.name} />
    </div>
  );
}
