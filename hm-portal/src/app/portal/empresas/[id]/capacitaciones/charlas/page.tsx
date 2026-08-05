import { prisma } from "@/lib/prisma";
import CharlasClient from "./CharlasClient";
import { notFound } from "next/navigation";

export default async function CharlasPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const [company, talks, workers] = await Promise.all([
        prisma.company.findUnique({ where: { id } }),
        prisma.toolboxTalk.findMany({
            where: { companyId: id },
            include: { signatures: { include: { worker: true } } },
            orderBy: { date: 'desc' }
        }),
        prisma.worker.findMany({
            where: { companyId: id },
            orderBy: { lastName: 'asc' }
        })
    ]);

    if (!company) notFound();

    return (
        <CharlasClient 
            companyId={id} 
            initialTalks={talks} 
            workers={workers} 
        />
    );
}
