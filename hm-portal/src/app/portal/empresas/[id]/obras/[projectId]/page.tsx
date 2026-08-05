import { getProjectById } from "@/app/actions/projects";
import { prisma } from "@/lib/prisma";
import ProjectDetailClient from "./ProjectDetailClient";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string, projectId: string }> }) {
    const { id, projectId } = await params;
    
    const [project, companyWorkers] = await Promise.all([
        getProjectById(projectId),
        prisma.worker.findMany({ where: { companyId: id }, include: { primaryRole: true } })
    ]);

    if (!project) notFound();

    return (
        <ProjectDetailClient 
            companyId={id} 
            project={project} 
            companyWorkers={companyWorkers}
        />
    );
}
