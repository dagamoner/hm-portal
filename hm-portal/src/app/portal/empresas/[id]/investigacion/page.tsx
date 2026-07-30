import { getInvestigations } from '@/app/actions/investigations';
import InvestigationClient from './InvestigationClient';
import { getIncidents } from '@/app/actions/incidents';
import { prisma } from '@/lib/prisma';

export default async function InvestigacionPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const investigations = (await getInvestigations(id)) as any;
    const incidents = (await getIncidents(id)) as any;
    const company = await prisma.company.findUnique({ where: { id } });

    return (
        <InvestigationClient 
            investigations={investigations} 
            incidents={incidents}
            companyId={id} 
            company={company}
        />
    );
}
