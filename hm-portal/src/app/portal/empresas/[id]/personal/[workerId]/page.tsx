import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getWorkerProfile } from "@/app/actions/personal";
import PTWClient from "./PTWClient";

export default async function WorkerPTWPage({ params }: { params: Promise<{ id: string, workerId: string }> }) {
  const { id, workerId } = await params;

  const worker = await getWorkerProfile(workerId);

  if (!worker) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl border border-blue-200">
            {worker.firstName.charAt(0)}{worker.lastName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{worker.firstName} {worker.lastName}</h1>
            <p className="text-slate-500 text-sm mt-1">
              DNI: {worker.documentId} | {(worker.laborData as any)?.position || 'Sin puesto'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Safety Score</p>
          <p className={`text-3xl font-black ${
            worker.safetyScore >= 90 ? 'text-emerald-500' :
            worker.safetyScore >= 70 ? 'text-amber-500' : 'text-red-500'
          }`}>
            {worker.safetyScore}%
          </p>
        </div>
      </div>
      
      <PTWClient companyId={id} worker={worker} />
    </div>
  );
}
