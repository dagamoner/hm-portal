"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createErgonomicEvaluation(companyId: string, data: any) {
    try {
        const record = await prisma.ergonomicEvaluation.create({
            data: {
                companyId,
                jobPosition: data.jobPosition,
                sector: data.sector,
                workerName: data.workerName,
                date: new Date(),
                planilla1: data.planilla1 || {},
                planilla2: data.planilla2 || {},
                planilla3: data.planilla3 || {},
                planilla4: data.planilla4 || {},
                globalStatus: data.globalStatus || 'Tolerable'
            }
        });

        // Automatically create a Legal Document with 1-year expiration
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        
        await prisma.document.create({
            data: {
                companyId,
                title: `Protocolo Ergonomía (Res 886/15) - ${data.jobPosition}`,
                category: 'LEGAL',
                status: 'VIGENTE',
                uploadDate: new Date(),
                expirationDate
            }
        });

        revalidatePath(`/portal/empresas/${companyId}/ergonomia`);
        revalidatePath(`/portal/empresas/${companyId}/documentacion`);
        return record;
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function getErgonomicEvaluations(companyId: string) {
    try {
        return await prisma.ergonomicEvaluation.findMany({
            where: { companyId },
            orderBy: { date: 'desc' }
        });
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function deleteErgonomicEvaluation(id: string, companyId: string) {
    try {
        await prisma.ergonomicEvaluation.delete({
            where: { id }
        });
        revalidatePath(`/portal/empresas/${companyId}/ergonomia`);
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}
