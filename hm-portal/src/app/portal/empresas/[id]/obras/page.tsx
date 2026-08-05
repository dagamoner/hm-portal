import { getProjects } from "@/app/actions/projects";
import ObrasClient from "./ObrasClient";

export default async function ObrasPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const initialProjects = await getProjects(id);

    return (
        <ObrasClient companyId={id} initialProjects={initialProjects} />
    );
}
