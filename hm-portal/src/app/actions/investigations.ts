"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getInvestigations(companyId: string) {
    try {
        return await prisma.investigation.findMany({
            where: { companyId },
            include: {
                incident: true
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching investigations:", error);
        throw new Error("Failed to fetch investigations");
    }
}

export async function getInvestigationByIncident(incidentId: string) {
    try {
        return await prisma.investigation.findUnique({
            where: { incidentId },
            include: { incident: true }
        });
    } catch (error) {
        console.error("Error fetching investigation:", error);
        throw new Error("Failed to fetch investigation");
    }
}

export async function startOrUpdateInvestigation(
    companyId: string, 
    incidentId: string, 
    data: { cause?: string, actionPlan?: string, status?: string }
) {
    try {
        const investigation = await prisma.investigation.upsert({
            where: { incidentId },
            update: {
                ...data
            },
            create: {
                companyId,
                incidentId,
                cause: data.cause || "",
                actionPlan: data.actionPlan || "",
                status: data.status || "En Progreso"
            }
        });

        // Update the incident status if investigation is completed
        if (data.status === 'Completada') {
            await prisma.incident.update({
                where: { id: incidentId },
                data: { status: 'Investigado' }
            });

            // Create Document in "Documentación" module
            const incident = await prisma.incident.findUnique({ where: { id: incidentId } });
            
            await prisma.document.create({
                data: {
                    companyId,
                    title: `Investigación Completada - INC-${incidentId.substring(0, 8).toUpperCase()}`,
                    category: 'PROCEDIMIENTOS',
                    status: 'CERRADO',
                    uploadDate: new Date(),
                    expirationDate: null
                }
            });
            revalidatePath(`/portal/empresas/${companyId}/documentacion`);
        }

        revalidatePath(`/portal/empresas/${companyId}/investigacion`);
        revalidatePath(`/portal/empresas/${companyId}/incidentes`);
        
        return investigation;
    } catch (error) {
        console.error("Error saving investigation:", error);
        throw new Error("Failed to save investigation");
    }
}
