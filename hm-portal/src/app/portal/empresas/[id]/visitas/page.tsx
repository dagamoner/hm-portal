import { redirect } from 'next/navigation';
import { getCompanyById } from '@/app/actions/companies';
import { getEstablishments, getVisits, getFindings } from '@/app/actions/visits';
import VisitasClient from './VisitasClient';

export default async function VisitasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const company = await getCompanyById(id);
  
  if (!company) {
    redirect('/portal/empresas');
  }

  const establishments = await getEstablishments(company.id);
  const visits = await getVisits(company.id);
  const findings = await getFindings(company.id);

  return (
    <VisitasClient 
      company={company} 
      establishments={establishments}
      initialVisits={visits}
      initialFindings={findings}
    />
  );
}
