import { getProjects, getContractors } from '@/app/actions/contractors';
import ContractorsClient from './ContractorsClient';

export default async function ContractorsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const projects = await getProjects(id);
    const contractors = await getContractors(id);

    return (
        <ContractorsClient 
            projects={projects}
            contractors={contractors}
            companyId={id} 
        />
    );
}
