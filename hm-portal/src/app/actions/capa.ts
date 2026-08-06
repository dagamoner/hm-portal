"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCapas(companyId: string) {
  try {
    const capas = await prisma.capa.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: capas };
  } catch (error) {
    console.error("Error fetching CAPA cases:", error);
    return { success: false, error: "Error fetching CAPA cases" };
  }
}

export async function createCapa(companyId: string, data: any) {
  try {
    const capa = await prisma.capa.create({
      data: {
        companyId,
        area: data.area,
        deviationType: data.deviationType,
        riskLevel: data.riskLevel,
        description: data.description,
        immediateCorrection: data.immediateCorrection,
        notifiedPersons: data.notifiedPersons,
        backgroundCheck: data.backgroundCheck,
        interviews: data.interviews,
        inspections: data.inspections,
        rootCause: data.rootCause,
        actionPlan: data.actionPlan || [],
        verificationTests: data.verificationTests,
        verificationResults: data.verificationResults,
        sopUpdated: data.sopUpdated || false,
        status: data.status || "ABIERTO",
      },
    });

    revalidatePath(`/portal/empresas/${companyId}/capa`);
    return { success: true, data: capa };
  } catch (error) {
    console.error("Error creating CAPA case:", error);
    return { success: false, error: "Error creating CAPA case" };
  }
}

export async function updateCapa(companyId: string, id: string, data: any) {
  try {
    const capa = await prisma.capa.update({
      where: { id },
      data: {
        area: data.area,
        deviationType: data.deviationType,
        riskLevel: data.riskLevel,
        description: data.description,
        immediateCorrection: data.immediateCorrection,
        notifiedPersons: data.notifiedPersons,
        backgroundCheck: data.backgroundCheck,
        interviews: data.interviews,
        inspections: data.inspections,
        rootCause: data.rootCause,
        actionPlan: data.actionPlan,
        verificationTests: data.verificationTests,
        verificationResults: data.verificationResults,
        sopUpdated: data.sopUpdated,
        status: data.status,
        closedAt: data.status === "CERRADO" && !data.closedAt ? new Date() : data.closedAt,
      },
    });

    revalidatePath(`/portal/empresas/${companyId}/capa`);
    return { success: true, data: capa };
  } catch (error) {
    console.error("Error updating CAPA case:", error);
    return { success: false, error: "Error updating CAPA case" };
  }
}

export async function deleteCapa(companyId: string, id: string) {
  try {
    await prisma.capa.delete({
      where: { id },
    });

    revalidatePath(`/portal/empresas/${companyId}/capa`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting CAPA case:", error);
    return { success: false, error: "Error deleting CAPA case" };
  }
}
