"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getChecklistTemplates() {
    try {
        return await prisma.checklistTemplate.findMany({
            where: { companyId: null },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching checklist templates:", error);
        return [];
    }
}

export async function createChecklistTemplate(data: any) {
    try {
        const template = await prisma.checklistTemplate.create({
            data: {
                name: data.name,
                type: data.type,
                companyId: null,
                categories: data.categories
            }
        });
        revalidatePath(`/portal/settings/checklists`);
        return { success: true, template };
    } catch (error) {
        console.error("Error creating checklist template:", error);
        return { success: false, error: "Error al crear plantilla." };
    }
}

export async function updateChecklistTemplate(id: string, data: any) {
    try {
        const template = await prisma.checklistTemplate.update({
            where: { id },
            data: {
                name: data.name,
                type: data.type,
                categories: data.categories
            }
        });
        revalidatePath(`/portal/settings/checklists`);
        return { success: true, template };
    } catch (error) {
        console.error("Error updating checklist template:", error);
        return { success: false, error: "Error al actualizar plantilla." };
    }
}

export async function deleteChecklistTemplate(id: string) {
    try {
        await prisma.checklistTemplate.delete({
            where: { id }
        });
        revalidatePath(`/portal/settings/checklists`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting checklist template:", error);
        return { success: false, error: "Error al eliminar plantilla." };
    }
}
