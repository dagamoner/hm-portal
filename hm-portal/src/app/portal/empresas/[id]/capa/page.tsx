import { prisma } from "@/lib/prisma";
import { CapaClient } from "./CapaClient";

export default async function CapaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch CAPA cases
  const capas = await prisma.capa.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Gestión CAPA</h1>
        <p className="text-slate-500 mt-1">Acciones Correctivas y Preventivas para control de riesgos y desvíos.</p>
      </div>

      <CapaClient 
        companyId={id} 
        initialCapas={capas} 
      />
    </div>
  );
}
