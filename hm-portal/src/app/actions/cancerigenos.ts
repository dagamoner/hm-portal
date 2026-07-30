"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function createCancerigenoEvaluation(companyId: string, data: any) {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);
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

        // Automatically create a Legal Document with 1-year expiration
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        
        await prisma.document.create({
            data: {
                companyId,
                title: `Declaración Cancerígenos SVCC (Res 81/19) - ${data.year}`,
                category: 'LEGAL',
                status: 'VIGENTE',
                uploadDate: new Date(),
                expirationDate
            }
        });

        revalidatePath(`/portal/empresas/${companyId}/cancerigenos`);
        revalidatePath(`/portal/empresas/${companyId}/documentacion`);
        return evaluation;
    } catch (error) {
        console.error("Error creating cancerigeno evaluation:", error);
        throw new Error("Failed to create cancerigeno evaluation");
    }
}

export async function getCancerigenoEvaluations(companyId: string) {
    await requireAuth(companyId);
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
