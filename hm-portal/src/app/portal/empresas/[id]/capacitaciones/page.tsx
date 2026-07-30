import React from 'react';
import { getCompanyById } from '@/app/actions/companies';
import { getTrainingDashboardStats, getTrainingPlans, createTrainingPlan } from '@/app/actions/trainings';
import CapacitacionesClient from './CapacitacionesClient';
import { redirect } from 'next/navigation';

export default async function CapacitacionesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = (await getCompanyById(id)) as any;
  
  if (!company) {
    redirect('/portal');
  }

  const currentYear = new Date().getFullYear();
  let stats = (await getTrainingDashboardStats(id)) as any;
  let plans = (await getTrainingPlans(id)) as any;

  // Auto-create plan for current year if none exists
  if (!plans.some((p: any) => p.year === currentYear)) {
    await createTrainingPlan(id, currentYear);
    plans = (await getTrainingPlans(id)) as any;
    stats = (await getTrainingDashboardStats(id)) as any;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Capacitaciones y Competencias</h1>
        <p className="text-slate-500 font-medium mt-2">
          Gestión del plan anual de formación y control de cumplimiento para <span className="font-bold text-slate-700">{company.name}</span>.
        </p>
      </div>

      <CapacitacionesClient 
        companyId={company.id} 
        companyName={company.name}
        initialPlans={plans}
        stats={stats}
      />
    </div>
  );
}
