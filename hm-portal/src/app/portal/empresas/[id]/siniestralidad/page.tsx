import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SiniestralidadClient } from "./SiniestralidadClient";

export const metadata = {
  title: "Estadísticas SRT | Portal MH",
};

export default async function SiniestralidadPage({
  params
}: {
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
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
          Estadísticas y Siniestralidad Oficial
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-4xl transition-colors">
          Cálculo automático de los índices exigidos por la Superintendencia de Riesgos del Trabajo (Res. 222/98) para {company.name}.
        </p>
      </div>

      <SiniestralidadClient companyId={id} />
    </div>
  );
}
