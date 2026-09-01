import { redirect } from 'next/navigation';
import { getCompanyById } from '@/app/actions/companies';
import { getEstablishments, getVisits, getFindings } from '@/app/actions/visits';
import { getChecklistTemplates } from '@/app/actions/templates';
import { getSafetyBookEntries } from '@/app/actions/reports-book';
import { getProfessionals } from '@/app/actions/users';
import VisitasClient from './VisitasClient';

import { Suspense } from 'react';

export default async function VisitasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = (await getCompanyById(id)) as any;
  
  if (!company) {
    redirect('/portal/empresas');
  }

  const establishments = (await getEstablishments(company.id)) as any;
  const visits = (await getVisits(company.id)) as any;
  const findings = (await getFindings(company.id)) as any;
  const templates = (await getChecklistTemplates(company.id)) as any;
  const bookEntries = (await getSafetyBookEntries(company.id)) as any;
  const professionals = (await getProfessionals()) as any;

  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando...</div>}>
      <VisitasClient 
        company={company} 
        establishments={establishments}
        initialVisits={visits}
        initialFindings={findings}
        initialTemplates={templates}
        initialBookEntries={bookEntries}
        professionals={professionals}
      />
    </Suspense>
  );
}
