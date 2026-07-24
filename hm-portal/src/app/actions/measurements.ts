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

        revalidatePath(`/portal/empresas/${companyId}/mediciones`);
        return record;
    } catch (error) {
        console.error("Error creating measurement:", error);
        throw new Error("Failed to create measurement");
    }
}

export async function getMeasurements(companyId: string) {
    try {
        return await prisma.measurementRecord.findMany({
            where: { companyId },
            orderBy: { date: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching measurements:", error);
        throw new Error("Failed to fetch measurements");
    }
}

export async function deleteMeasurement(id: string, companyId: string) {
    try {
        await prisma.measurementRecord.delete({
            where: { id }
        });
        revalidatePath(`/portal/empresas/${companyId}/mediciones`);
    } catch (error) {
        console.error("Error deleting measurement:", error);
        throw new Error("Failed to delete measurement");
    }
}
