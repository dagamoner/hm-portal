import { getInvestigations } from '@/app/actions/investigations';
import InvestigationClient from './InvestigationClient';
import { getIncidents } from '@/app/actions/incidents';

export default async function InvestigacionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const investigations = await getInvestigations(id);
    const incidents = await getIncidents(id);

    return (
        <InvestigationClient 
            investigations={investigations} 
            incidents={incidents}
            companyId={id} 
        />
    );
}
