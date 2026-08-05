"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCompanyPolicies(companyId: string) {
    try {
        const policies = await prisma.companyPolicy.findMany({
            where: { companyId },
            include: {
                signatures: {
                    include: { worker: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        return policies;
    } catch (error) {
        console.error("Error fetching policies:", error);
        return [];
    }
}

export async function createPolicy(companyId: string, data: { type: string; title: string; content: string }) {
    try {
        const policy = await prisma.companyPolicy.create({
            data: {
                companyId,
                type: data.type,
                title: data.title,
                content: data.content,
            }
        });
        revalidatePath(`/portal`);
        return { success: true, policy };
    } catch (error) {
        console.error("Error creating policy:", error);
        return { success: false, error: "Error al crear política." };
    }
}

export async function signPolicy(policyId: string, workerId: string) {
    try {
        await prisma.policySignature.create({
            data: {
                policyId,
                workerId,
                accepted: true
            }
        });
        revalidatePath(`/portal`);
        return { success: true };
    } catch (error) {
        console.error("Error signing policy:", error);
        return { success: false, error: "Error al firmar política." };
    }
}

export async function deletePolicy(policyId: string) {
    try {
        await prisma.companyPolicy.delete({
            where: { id: policyId }
        });
        revalidatePath(`/portal`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting policy:", error);
        return { success: false, error: "Error al eliminar política." };
    }
}

export async function getCompanyPSTs(companyId: string) {
    try {
        const psts = await prisma.pST.findMany({
            where: { companyId },
            include: {
                tasks: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return psts;
    } catch (error) {
        console.error("Error fetching PSTs:", error);
        return [];
    }
}

export async function createPST(companyId: string, data: { title: string; description: string; content: any }) {
    try {
        const pst = await prisma.pST.create({
            data: {
                companyId,
                title: data.title,
                description: data.description,
                content: data.content,
            }
        });
        revalidatePath(`/portal`);
        return { success: true, pst };
    } catch (error) {
        console.error("Error creating PST:", error);
        return { success: false, error: "Error al crear PST." };
    }
}

export async function updatePST(pstId: string, data: { title?: string; description?: string; content?: any; status?: string; version?: number }) {
    try {
        const pst = await prisma.pST.update({
            where: { id: pstId },
            data
        });
        revalidatePath(`/portal`);
        return { success: true, pst };
    } catch (error) {
        console.error("Error updating PST:", error);
        return { success: false, error: "Error al actualizar PST." };
    }
}

export async function linkTaskToPST(pstId: string, taskId: string) {
    try {
        await prisma.pST.update({
            where: { id: pstId },
            data: {
                tasks: {
                    connect: { id: taskId }
                }
            }
        });
        revalidatePath(`/portal`);
        return { success: true };
    } catch (error) {
        console.error("Error linking task:", error);
        return { success: false, error: "Error al vincular tarea." };
    }
}

export async function unlinkTaskFromPST(pstId: string, taskId: string) {
    try {
        await prisma.pST.update({
            where: { id: pstId },
            data: {
                tasks: {
                    disconnect: { id: taskId }
                }
            }
        });
        revalidatePath(`/portal`);
        return { success: true };
    } catch (error) {
        console.error("Error unlinking task:", error);
        return { success: false, error: "Error al desvincular tarea." };
    }
}

export async function deletePST(pstId: string) {
    try {
        await prisma.pST.delete({
            where: { id: pstId }
        });
        revalidatePath(`/portal`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting PST:", error);
        return { success: false, error: "Error al eliminar PST." };
    }
}
