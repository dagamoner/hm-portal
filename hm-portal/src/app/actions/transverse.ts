"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getToolboxTalks(companyId: string) {
    try {
        const talks = await prisma.toolboxTalk.findMany({
            where: { companyId },
            include: {
                signatures: {
                    include: { worker: true }
                }
            },
            orderBy: { date: 'desc' }
        });
        return talks;
    } catch (error) {
        console.error("Error fetching toolbox talks:", error);
        return [];
    }
}

export async function getWorkersForTalks(companyId: string) {
    try {
        return await prisma.worker.findMany({
            where: { companyId },
            orderBy: { lastName: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching workers:", error);
        return [];
    }
}

export async function createToolboxTalk(companyId: string, data: any) {
    try {
        const talk = await prisma.toolboxTalk.create({
            data: {
                companyId,
                title: data.title,
                topic: data.topic,
                supervisor: data.supervisor,
                date: new Date(data.date),
                signatures: {
                    create: data.workerIds.map((workerId: string) => ({
                        workerId,
                        signedAt: new Date()
                    }))
                }
            }
        });
        revalidatePath('/portal');
        return { success: true, talk };
    } catch (error) {
        console.error("Error creating toolbox talk:", error);
        return { success: false, error: "Error al registrar la charla." };
    }
}
