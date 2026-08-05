import { prisma } from "@/lib/prisma";
import PoliticasPSTClient from "./PoliticasPSTClient";
import { notFound } from "next/navigation";

export default async function PoliticasPSTPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const [policies, psts, workers, tasks] = await Promise.all([
        prisma.companyPolicy.findMany({
            where: { companyId: id },
            include: { signatures: { include: { worker: true } } },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.pST.findMany({
            where: { companyId: id },
            include: { tasks: true },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.worker.findMany({
            where: { companyId: id }
        }),
        prisma.task.findMany({
            where: { jobRole: { process: { sector: { establishment: { companyId: id } } } } }
        })
    ]);

    if (!policies && !psts) notFound();

    return (
        <PoliticasPSTClient 
            companyId={id} 
            initialPolicies={policies} 
            initialPSTs={psts}
            workers={workers}
            tasks={tasks}
        />
    );
}
