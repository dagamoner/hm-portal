"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createMeasurement(companyId: string, data: any) {
    try {
        const record = await prisma.measurementRecord.create({
            data: {
                companyId,
                type: data.type,
                area: data.area || 'General',
                instrument: data.instrument || 'N/A',
                value: 0,
                unit: data.type === 'Iluminación' ? 'Lux' : data.type === 'Ruido' ? 'dBA' : 'Ohm',
                date: new Date(),
                status: 'Cumple',
                details: data.details || {}
            }
        });

        // Automatically create a Legal Document with 1-year expiration
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        
        await prisma.document.create({
            data: {
                companyId,
                title: `Protocolo SRT - ${data.type} (${data.area || 'General'})`,
                category: 'LEGAL',
                status: 'VIGENTE',
                uploadDate: new Date(),
                expirationDate
            }
        });

        revalidatePath(`/portal/empresas/${companyId}/mediciones`);
        revalidatePath(`/portal/empresas/${companyId}/documentacion`);
        return record;
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function getMeasurements(companyId: string) {
    try {
        return await prisma.measurementRecord.findMany({
            where: { companyId },
            orderBy: { date: 'desc' }
        });
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function deleteMeasurement(id: string, companyId: string) {
    try {
        await prisma.measurementRecord.delete({
            where: { id }
        });
        revalidatePath(`/portal/empresas/${companyId}/mediciones`);
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}
