import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CompanyTabs } from "@/components/ui/CompanyTabs";

export default async function CompanyLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)]">
      {/* Header específico de la empresa (Tabs) */}
      <CompanyTabs companyId={id} />

      {/* Contenido del módulo seleccionado */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
}
