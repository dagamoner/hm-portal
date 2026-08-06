"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// ENVIRONMENTAL ASPECTS
// ==========================================

export async function getEnvironmentalAspects(companyId: string) {
  try {
    const aspects = await prisma.environmentalAspect.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: aspects };
  } catch (error) {
    console.error("Error fetching environmental aspects:", error);
    return { success: false, error: "Error fetching aspects" };
  }
}

export async function createEnvironmentalAspect(companyId: string, data: any) {
  try {
    const probability = Number(data.probability);
    const severity = Number(data.severity);
    const significance = probability * severity;
    const isSignificant = significance >= 12; // Example threshold: 12

    const aspect = await prisma.environmentalAspect.create({
      data: {
        companyId,
        process: data.process,
        aspect: data.aspect,
        impact: data.impact,
        condition: data.condition,
        probability,
        severity,
        significance,
        isSignificant,
        controls: data.controls,
        actionPlan: data.actionPlan,
      },
    });

    revalidatePath(`/portal/empresas/${companyId}/ambiental`);
    return { success: true, data: aspect };
  } catch (error) {
    console.error("Error creating environmental aspect:", error);
    return { success: false, error: "Error creating aspect" };
  }
}

export async function deleteEnvironmentalAspect(companyId: string, id: string) {
  try {
    await prisma.environmentalAspect.delete({
      where: { id },
    });

    revalidatePath(`/portal/empresas/${companyId}/ambiental`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting aspect:", error);
    return { success: false, error: "Error deleting aspect" };
  }
}

// ==========================================
// HAZARDOUS WASTE
// ==========================================

export async function getHazardousWaste(companyId: string) {
  try {
    const waste = await prisma.hazardousWaste.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: waste };
  } catch (error) {
    console.error("Error fetching hazardous waste:", error);
    return { success: false, error: "Error fetching waste records" };
  }
}

export async function createHazardousWaste(companyId: string, data: any) {
  try {
    const waste = await prisma.hazardousWaste.create({
      data: {
        companyId,
        type: data.type,
        description: data.description,
        generationDate: new Date(data.generationDate),
        amountKg: Number(data.amountKg),
        storageLocation: data.storageLocation,
        status: data.status || "Almacenado",
        manifestNumber: data.manifestNumber,
        transportedBy: data.transportedBy,
        disposalDate: data.disposalDate ? new Date(data.disposalDate) : null,
      },
    });

    revalidatePath(`/portal/empresas/${companyId}/ambiental`);
    return { success: true, data: waste };
  } catch (error) {
    console.error("Error creating waste record:", error);
    return { success: false, error: "Error creating waste record" };
  }
}

export async function updateHazardousWasteStatus(companyId: string, id: string, status: string, manifestNumber?: string, disposalDate?: string) {
  try {
    const dataToUpdate: any = { status };
    if (manifestNumber) dataToUpdate.manifestNumber = manifestNumber;
    if (disposalDate) dataToUpdate.disposalDate = new Date(disposalDate);

    const waste = await prisma.hazardousWaste.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath(`/portal/empresas/${companyId}/ambiental`);
    return { success: true, data: waste };
  } catch (error) {
    console.error("Error updating waste record:", error);
    return { success: false, error: "Error updating waste status" };
  }
}

export async function deleteHazardousWaste(companyId: string, id: string) {
  try {
    await prisma.hazardousWaste.delete({
      where: { id },
    });

    revalidatePath(`/portal/empresas/${companyId}/ambiental`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting waste record:", error);
    return { success: false, error: "Error deleting waste record" };
  }
}
