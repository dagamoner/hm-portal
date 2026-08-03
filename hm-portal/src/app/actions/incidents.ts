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
    try {
      await requireAuth(companyId);
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
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function getIncidents(companyId: string) {
    try {
      await requireAuth(companyId);
        return await prisma.incident.findMany({
            where: { companyId },
            include: { company: true },
            orderBy: { date: 'desc' }
        });
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function updateIncidentStatus(id: string, companyId: string, status: string) {
    try {
      await requireAuth(companyId);
        const incident = await prisma.incident.update({
            where: { id },
            data: { status }
        });
        
        await logAction('Incidentes', 'MODIFICAR', `Estado de Incidente: ${incident.title}`, { id: incident.id, status }, companyId);
        
        revalidatePath(`/portal/empresas/${companyId}/incidentes`);
        return incident;
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
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
    try {
      await requireAuth(companyId);
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
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
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
    } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}
