"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getProjectPSOs(projectId: string) {
  try {
    const psos = await prisma.projectPSO.findMany({
      where: { projectId },
      include: {
        stages: {
            orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return psos;
  } catch (error) {
    console.error("Error fetching PSOs:", error);
    return [];
  }
}

export async function createPSO(projectId: string, data: { art: string; hysResponsible: string }) {
  try {
    const pso = await prisma.projectPSO.create({
      data: {
        projectId,
        art: data.art,
        hysResponsible: data.hysResponsible,
        status: "Borrador",
      },
    });
    revalidatePath(`/portal/empresas/[id]/obras/${projectId}`);
    return { success: true, pso };
  } catch (error) {
    console.error("Error creating PSO:", error);
    return { success: false, error: "Error al crear el PSO." };
  }
}

export async function updatePSO(psoId: string, data: { art?: string; hysResponsible?: string; status?: string; dispositionNum?: string; approvalDate?: string }) {
  try {
    const pso = await prisma.projectPSO.update({
      where: { id: psoId },
      data,
    });
    revalidatePath(`/portal`); // We invalidate broadly as path varies
    return { success: true, pso };
  } catch (error) {
    console.error("Error updating PSO:", error);
    return { success: false, error: "Error al actualizar el PSO." };
  }
}

export async function createPSOStage(psoId: string, data: { name: string; description: string; risks: string; preventions: string }) {
  try {
    const stage = await prisma.pSOStage.create({
      data: {
        psoId,
        ...data
      },
    });
    revalidatePath(`/portal`);
    return { success: true, stage };
  } catch (error) {
    console.error("Error creating PSO stage:", error);
    return { success: false, error: "Error al crear la etapa." };
  }
}

export async function deletePSOStage(stageId: string) {
  try {
    await prisma.pSOStage.delete({
      where: { id: stageId },
    });
    revalidatePath(`/portal`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting PSO stage:", error);
    return { success: false, error: "Error al eliminar la etapa." };
  }
}
