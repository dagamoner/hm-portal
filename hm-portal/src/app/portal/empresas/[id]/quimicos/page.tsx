import { prisma } from "@/lib/prisma";
import { ChemicalsClient } from "./ChemicalsClient";

export default async function QuimicosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch Chemical Products
  const products = await prisma.chemicalProduct.findMany({
    where: { companyId: id },
    orderBy: { createdAt: "desc" }
  });

  // Fetch SGA Library
  const sgaLibrary = await prisma.sgaLibraryItem.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800">Productos Químicos (SGA/GHS)</h1>
        <p className="text-slate-500 mt-1">Inventario, clasificación y Fichas de Datos de Seguridad s/ Res. SRT 801/2015.</p>
      </div>

      <ChemicalsClient 
        companyId={id} 
        initialProducts={products}
        sgaLibrary={sgaLibrary}
      />
    </div>
  );
}
