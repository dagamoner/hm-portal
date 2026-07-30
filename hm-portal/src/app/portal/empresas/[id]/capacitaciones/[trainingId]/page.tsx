import React from 'react';
import { getCompanyById } from '@/app/actions/companies';
import { getTrainingDetails, syncTrainingRecords } from '@/app/actions/trainings';
import TrainingDetailClient from './TrainingDetailClient';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function TrainingDetailPage({ params }: { params: Promise<{ id: string, trainingId: string }> }) {
  const { id, trainingId } = await params;
  const company = (await getCompanyById(id)) as any;
  if (!company) redirect('/portal');

  // Sync workers to this training just in case there are new workers
  const training = (await syncTrainingRecords(trainingId, id)) as any;
  if (!training || training.error) redirect(`/portal/empresas/${id}/capacitaciones`);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div>
        <Link href={`/portal/empresas/${company.id}/capacitaciones`} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Volver a Capacitaciones
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{training.title}</h1>
        <p className="text-slate-500 font-medium mt-1">
          Plan Anual {training.plan.year} • Nivel {training.type} • Prioridad {training.priority}
        </p>
      </div>

      <TrainingDetailClient 
        companyId={company.id} 
        training={training} 
      />
    </div>
  );
}
