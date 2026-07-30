"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function createCancerigenoEvaluation(companyId: string, data: any) {
    try {
      await requireAuth(companyId, ['ADMIN', 'MANAGER']);
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
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function getCancerigenoEvaluations(companyId: string) {
    try {
      await requireAuth(companyId);
        return await prisma.cancerigenoEvaluation.findMany({
            where: { companyId },
            orderBy: { year: 'desc' }
        });
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}
