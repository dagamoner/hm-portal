"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logAction } from "@/app/actions/auditoria";
import { requireAuth } from "@/lib/auth";

export async function createIncident(companyId: string, data: { 
    title: string, 
    location: string, 
    description: string, 
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    date: Date,
    details: any
}) {
    await requireAuth(companyId);
    try {
        const incident = await prisma.incident.create({
            data: {
                companyId,
                title: data.title,
                location: data.location,
                description: data.description,
                severity: data.severity,
                date: data.date,
                status: 'En Investigación',
                details: data.details || {}
            }
        });

        await logAction('Incidentes', 'CREAR', `Incidente: ${incident.title}`, { id: incident.id, severity: incident.severity }, companyId);

        revalidatePath(`/portal/empresas/${companyId}/incidentes`);
        return incident;
    } catch (error) {
        console.error("Error creating incident:", error);
        throw new Error("Failed to create incident");
    }
}

export async function getIncidents(companyId: string) {
    await requireAuth(companyId);
    try {
        return await prisma.incident.findMany({
            where: { companyId },
            orderBy: { date: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching incidents:", error);
        throw new Error("Failed to fetch incidents");
    }
}

export async function updateIncidentStatus(id: string, companyId: string, status: string) {
    await requireAuth(companyId);
    try {
        const incident = await prisma.incident.update({
            where: { id },
            data: { status }
        });
        
        await logAction('Incidentes', 'MODIFICAR', `Estado de Incidente: ${incident.title}`, { id: incident.id, status }, companyId);
        
        revalidatePath(`/portal/empresas/${companyId}/incidentes`);
        return incident;
    } catch (error) {
        console.error("Error updating incident status:", error);
        throw new Error("Failed to update incident status");
    }
}

export async function updateIncident(id: string, companyId: string, data: {
    title: string,
    location: string,
    description: string,
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    date: Date,
    details: any
}) {
    await requireAuth(companyId);
    try {
        const incident = await prisma.incident.update({
            where: { id },
            data: {
                title: data.title,
                location: data.location,
                description: data.description,
                severity: data.severity,
                date: data.date,
                details: data.details || {}
            }
        });
        
        await logAction('Incidentes', 'MODIFICAR', `Incidente: ${incident.title}`, { id: incident.id, severity: incident.severity }, companyId);
        
        revalidatePath(`/portal/empresas/${companyId}/incidentes`);
        return incident;
    } catch (error) {
        console.error("Error updating incident:", error);
        throw new Error("Failed to update incident");
    }
}

export async function deleteIncident(id: string, companyId: string) {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']); // Only ADMIN/MANAGER can delete
    try {
        await prisma.incident.delete({
            where: { id }
        });
        
        await logAction('Incidentes', 'ELIMINAR', `Incidente ID: ${id}`, { id }, companyId);
        
        revalidatePath(`/portal/empresas/${companyId}/incidentes`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting incident:", error);
        throw new Error("Failed to delete incident");
    }
}
