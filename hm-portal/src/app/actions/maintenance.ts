"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMaintenanceAlerts(companyId: string) {
    try {
        return await prisma.maintenanceAlert.findMany({
            where: { equipment: { companyId } },
            include: { equipment: true },
            orderBy: { dueDate: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching maintenance alerts:", error);
        return [];
    }
}

export async function resolveMaintenanceAlert(companyId: string, alertId: string, resolutionNotes: string) {
    try {
        await prisma.maintenanceAlert.update({
            where: { id: alertId },
            data: {
                status: 'RESOLVED',
                resolvedAt: new Date(),
                resolutionNotes
            }
        });
        revalidatePath(`/portal/empresas/${companyId}/equipos`);
        return { success: true };
    } catch (error) {
        console.error("Error resolving maintenance alert:", error);
        return { success: false, error: "Error al resolver alerta." };
    }
}

export async function createMaintenanceAlert(companyId: string, data: any) {
    try {
        const alert = await prisma.maintenanceAlert.create({
            data: {
                title: data.title,
                type: data.type,
                dueDate: new Date(data.dueDate),
                equipmentId: data.equipmentId
            }
        });
        revalidatePath(`/portal/empresas/${companyId}/equipos`);
        return { success: true, alert };
    } catch (error) {
        console.error("Error creating maintenance alert:", error);
        return { success: false, error: "Error al crear alerta." };
    }
}
