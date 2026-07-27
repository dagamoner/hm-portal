import { getIncidents } from '@/app/actions/incidents';
import IncidentsClient from './IncidentsClient';

export default async function IncidentesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const incidents = await getIncidents(id);

    return (
        <IncidentsClient 
            incidents={incidents} 
            companyId={id} 
        />
    );
}
