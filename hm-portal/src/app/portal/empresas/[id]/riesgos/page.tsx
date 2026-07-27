import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import RiesgosClient from "./RiesgosClient";

export default async function RiesgosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const { getEstablishments } = await import("@/app/actions/risks");
  const establishments = await getEstablishments(id);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <RiesgosClient companyId={id} initialEstablishments={establishments} />
    </div>
  );
}
