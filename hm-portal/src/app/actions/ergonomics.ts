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

        revalidatePath(`/portal/empresas/${companyId}/ergonomia`);
        return record;
    } catch (error) {
        console.error("Error creating ergonomic evaluation:", error);
        throw new Error("Failed to create ergonomic evaluation");
    }
}

export async function getErgonomicEvaluations(companyId: string) {
    try {
        return await prisma.ergonomicEvaluation.findMany({
            where: { companyId },
            orderBy: { date: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching ergonomic evaluations:", error);
        throw new Error("Failed to fetch ergonomic evaluations");
    }
}

export async function deleteErgonomicEvaluation(id: string, companyId: string) {
    try {
        await prisma.ergonomicEvaluation.delete({
            where: { id }
        });
        revalidatePath(`/portal/empresas/${companyId}/ergonomia`);
    } catch (error) {
        console.error("Error deleting ergonomic evaluation:", error);
        throw new Error("Failed to delete ergonomic evaluation");
    }
}
