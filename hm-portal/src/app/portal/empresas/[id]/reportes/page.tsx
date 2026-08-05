import { prisma } from "@/lib/prisma";
import ReportesClient from "./ReportesClient";
import { notFound } from "next/navigation";

export default async function ReportesPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const [reports, company] = await Promise.all([
        prisma.managementReport.findMany({
            where: { companyId: id },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.company.findUnique({
            where: { id }
        })
    ]);

    if (!company) notFound();

    return (
        <ReportesClient 
            companyId={id} 
            companyName={company.name}
            initialReports={reports} 
        />
    );
}
