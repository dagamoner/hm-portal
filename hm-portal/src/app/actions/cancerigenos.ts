"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCancerigenoEvaluation(companyId: string, data: any) {
    try {
        const evaluation = await prisma.cancerigenoEvaluation.create({
            data: {
                companyId,
                year: data.year,
                responsables: data.responsables || {},
                puestos: data.puestos || [],
                sustancias: data.sustancias || [],
                medidas: data.medidas || []
            }
        });

        revalidatePath(`/portal/empresas/${companyId}/cancerigenos`);
        return evaluation;
    } catch (error) {
        console.error("Error creating cancerigeno evaluation:", error);
        throw new Error("Failed to create cancerigeno evaluation");
    }
}

export async function getCancerigenoEvaluations(companyId: string) {
    try {
        return await prisma.cancerigenoEvaluation.findMany({
            where: { companyId },
            orderBy: { year: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching cancerigeno evaluations:", error);
        throw new Error("Failed to fetch cancerigeno evaluations");
    }
}
