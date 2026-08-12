"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getExtintores(companyId: string) {
    await requireAuth(companyId);
    return await prisma.emergencyEquipment.findMany({
        where: { 
            companyId,
            type: "EXTINTOR" 
        },
        orderBy: { updatedAt: 'desc' }
    });
}

export async function createExtintor(companyId: string, data: any) {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);

    // Determine status based on expiration dates
    const today = new Date();
    let status = "Operativo";
    
    if (data.nextInspection && new Date(data.nextInspection) < today) {
        status = "Vencido";
    }
    if (data.expirationDate && new Date(data.expirationDate) < today) {
        status = "Vencido"; // PH Vencida
    }

    const details = {
        agent: data.agent,
        fireClasses: data.fireClasses, // array: ['A', 'B', 'C']
        potential: data.potential, // e.g., '10B'
        capacity: data.capacity,
        maxDistance: data.maxDistance,
        coveredArea: data.coveredArea,
        manufacturingDate: data.manufacturingDate,
        checklists: [] // initialize empty checklists array
    };

    const extintor = await prisma.emergencyEquipment.create({
        data: {
            companyId,
            name: data.chapa, // We use 'name' to store the chapa number or identification
            type: "EXTINTOR",
            location: data.location,
            status: status,
            lastInspection: data.lastInspection ? new Date(data.lastInspection) : null,
            nextInspection: data.nextInspection ? new Date(data.nextInspection) : null,
            expirationDate: data.expirationDate ? new Date(data.expirationDate) : null, // PH expiration
            details: JSON.stringify(details)
        }
    });

    revalidatePath(`/portal/empresas/${companyId}/extintores`);
    return { success: true, extintor };
}

export async function updateExtintor(companyId: string, extintorId: string, data: any) {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);

    const existing = await prisma.emergencyEquipment.findUnique({
        where: { id: extintorId }
    });

    if (!existing) throw new Error("Extintor no encontrado");

    const existingDetails = JSON.parse(existing.details as string || "{}");
    
    const today = new Date();
    let status = "Operativo";
    
    if (data.nextInspection && new Date(data.nextInspection) < today) {
        status = "Vencido";
    }
    if (data.expirationDate && new Date(data.expirationDate) < today) {
        status = "Vencido"; // PH Vencida
    }
    // If it was manually set to 'Mantenimiento' or something else, override
    if (data.status) {
        status = data.status;
    }

    const newDetails = {
        ...existingDetails,
        agent: data.agent !== undefined ? data.agent : existingDetails.agent,
        fireClasses: data.fireClasses !== undefined ? data.fireClasses : existingDetails.fireClasses,
        potential: data.potential !== undefined ? data.potential : existingDetails.potential,
        capacity: data.capacity !== undefined ? data.capacity : existingDetails.capacity,
        maxDistance: data.maxDistance !== undefined ? data.maxDistance : existingDetails.maxDistance,
        coveredArea: data.coveredArea !== undefined ? data.coveredArea : existingDetails.coveredArea,
        manufacturingDate: data.manufacturingDate !== undefined ? data.manufacturingDate : existingDetails.manufacturingDate,
    };

    const updated = await prisma.emergencyEquipment.update({
        where: { id: extintorId },
        data: {
            name: data.chapa || existing.name,
            location: data.location || existing.location,
            status: status,
            lastInspection: data.lastInspection ? new Date(data.lastInspection) : existing.lastInspection,
            nextInspection: data.nextInspection ? new Date(data.nextInspection) : existing.nextInspection,
            expirationDate: data.expirationDate ? new Date(data.expirationDate) : existing.expirationDate,
            details: JSON.stringify(newDetails)
        }
    });

    revalidatePath(`/portal/empresas/${companyId}/extintores`);
    return { success: true, updated };
}

export async function addExtintorChecklist(companyId: string, extintorId: string, checklistData: any) {
    await requireAuth(companyId, ['ADMIN', 'MANAGER', 'INSPECTOR']);

    const existing = await prisma.emergencyEquipment.findUnique({
        where: { id: extintorId }
    });

    if (!existing) throw new Error("Extintor no encontrado");

    const details = JSON.parse(existing.details as string || "{}");
    const checklists = details.checklists || [];
    
    checklists.unshift({
        date: new Date().toISOString(),
        ...checklistData
    });

    // Check if any check failed, if so, put status as "Revisar"
    let status = existing.status;
    if (
        !checklistData.manometerGreen || 
        !checklistData.sealIntact || 
        !checklistData.hoseGood || 
        !checklistData.cylinderGood || 
        !checklistData.signageGood || 
        !checklistData.accessFree
    ) {
        status = "Observado";
    }

    details.checklists = checklists;

    const updated = await prisma.emergencyEquipment.update({
        where: { id: extintorId },
        data: {
            status: status,
            details: JSON.stringify(details)
        }
    });

    revalidatePath(`/portal/empresas/${companyId}/extintores`);
    return { success: true, updated };
}

export async function deleteExtintor(companyId: string, extintorId: string) {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);
    await prisma.emergencyEquipment.delete({
        where: { id: extintorId }
    });
    revalidatePath(`/portal/empresas/${companyId}/extintores`);
    return { success: true };
}
