import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PersonalClient from "./PersonalClient";
import { getWorkers } from "@/app/actions/personal";

export default async function PersonalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id }
  });

  if (!company) {
    notFound();
  }

  const initialWorkers = await getWorkers(id);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestión de Personal y PTW</h1>
          <p className="text-slate-500 text-sm mt-1">Directorio de trabajadores y Permisos de Trabajo Seguro - {company.name}</p>
        </div>
      </div>
      
      <PersonalClient companyId={id} initialWorkers={initialWorkers} />
    </div>
  );
}
