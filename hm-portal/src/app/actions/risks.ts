"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// ESTABLISHMENTS
// ==========================================

export async function getEstablishments(companyId: string) {
  try {
    return await prisma.establishment.findMany({
      where: { companyId },
      orderBy: { name: 'asc' },
      include: {
        sectors: {
          include: {
            processes: {
              include: {
                jobRoles: {
                  include: {
                    tasks: {
                      include: {
                        hazards: {
                          include: {
                            evaluations: {
                              include: {
                                improvementActions: true
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching establishments:", error);
    return [];
  }
}

export async function createEstablishment(companyId: string, formData: FormData) {
  try {
    await prisma.establishment.create({
      data: {
        companyId,
        name: formData.get("name") as string,
        address: formData.get("address") as string || null,
        province: formData.get("province") as string || null,
        municipality: formData.get("municipality") as string || null,
        type: formData.get("type") as string || null,
        coveredArea: Number(formData.get("coveredArea")) || null,
        uncoveredArea: Number(formData.get("uncoveredArea")) || null,
        floors: Number(formData.get("floors")) || null,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error creating establishment:", error);
    return { error: "Failed to create establishment." };
  }
}

export async function updateEstablishment(id: string, formData: FormData) {
  try {
    const est = await prisma.establishment.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        address: formData.get("address") as string || null,
        province: formData.get("province") as string || null,
        municipality: formData.get("municipality") as string || null,
        type: formData.get("type") as string || null,
        coveredArea: Number(formData.get("coveredArea")) || null,
        uncoveredArea: Number(formData.get("uncoveredArea")) || null,
        floors: Number(formData.get("floors")) || null,
      }
    });
    revalidatePath(`/portal/empresas/${est.companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error updating establishment:", error);
    return { error: "Failed to update establishment." };
  }
}

export async function deleteEstablishment(id: string, companyId: string) {
  try {
    await prisma.establishment.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting establishment:", error);
    return { error: "Failed to delete establishment." };
  }
}

// ==========================================
// SECTORS
// ==========================================

export async function createSector(establishmentId: string, companyId: string, formData: FormData) {
  try {
    await prisma.sector.create({
      data: {
        establishmentId,
        name: formData.get("name") as string,
        description: formData.get("description") as string || null,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error creating sector:", error);
    return { error: "Failed to create sector." };
  }
}

export async function deleteSector(id: string, companyId: string) {
  try {
    await prisma.sector.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting sector:", error);
    return { error: "Failed to delete sector." };
  }
}

// ==========================================
// PROCESSES
// ==========================================

export async function createProcess(sectorId: string, companyId: string, formData: FormData) {
  try {
    await prisma.process.create({
      data: {
        sectorId,
        name: formData.get("name") as string,
        description: formData.get("description") as string || null,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error creating process:", error);
    return { error: "Failed to create process." };
  }
}

export async function deleteProcess(id: string, companyId: string) {
  try {
    await prisma.process.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting process:", error);
    return { error: "Failed to delete process." };
  }
}

// ==========================================
// JOB ROLES
// ==========================================

export async function createJobRole(processId: string, companyId: string, formData: FormData) {
  try {
    await prisma.jobRole.create({
      data: {
        processId,
        name: formData.get("name") as string,
        personnelCount: Number(formData.get("personnelCount")) || 1,
        shifts: formData.get("shifts") as string || null,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error creating job role:", error);
    return { error: "Failed to create job role." };
  }
}

export async function deleteJobRole(id: string, companyId: string) {
  try {
    await prisma.jobRole.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting job role:", error);
    return { error: "Failed to delete job role." };
  }
}

// ==========================================
// TASKS
// ==========================================

export async function createTask(jobRoleId: string, companyId: string, formData: FormData) {
  try {
    await prisma.task.create({
      data: {
        jobRoleId,
        name: formData.get("name") as string,
        description: formData.get("description") as string || null,
        type: formData.get("type") as string || null,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task." };
  }
}

export async function deleteTask(id: string, companyId: string) {
  try {
    await prisma.task.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: "Failed to delete task." };
  }
}

// ==========================================
// HAZARDS
// ==========================================

export async function createHazard(taskId: string, companyId: string, formData: FormData) {
  try {
    await prisma.hazard.create({
      data: {
        taskId,
        name: formData.get("name") as string,
        description: formData.get("description") as string || null,
        type: formData.get("type") as string || null,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error creating hazard:", error);
    return { error: "Failed to create hazard." };
  }
}

export async function deleteHazard(id: string, companyId: string) {
  try {
    await prisma.hazard.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting hazard:", error);
    return { error: "Failed to delete hazard." };
  }
}

// ==========================================
// RISK EVALUATIONS
// ==========================================

export async function saveRiskEvaluation(hazardId: string, companyId: string, data: any) {
  try {
    const existing = await prisma.riskEvaluation.findFirst({
      where: { hazardId }
    });

    const probability = Number(data.probability);
    const severity = Number(data.severity);
    const riskLevel = probability * severity;

    if (existing) {
      await prisma.riskEvaluation.update({
        where: { id: existing.id },
        data: {
          probability,
          severity,
          riskLevel,
          controlMeasures: data.controlMeasures,
        }
      });
    } else {
      await prisma.riskEvaluation.create({
        data: {
          hazardId,
          probability,
          severity,
          riskLevel,
          controlMeasures: data.controlMeasures,
        }
      });
    }
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    revalidatePath(`/portal/empresas/${companyId}/matriz`);
    return { success: true };
  } catch (error) {
    console.error("Error saving risk evaluation:", error);
    return { error: "Failed to save risk evaluation." };
  }
}

// ==========================================
// IMPROVEMENT ACTIONS
// ==========================================

export async function createImprovementAction(evaluationId: string, companyId: string, formData: FormData) {
  try {
    await prisma.improvementAction.create({
      data: {
        evaluationId,
        description: formData.get("description") as string,
        hierarchy: "Administrativo", // Default value
        status: formData.get("status") as string || 'PENDING',
        deadline: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : null,
      }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    revalidatePath(`/portal/empresas/${companyId}/matriz`);
    return { success: true };
  } catch (error) {
    console.error("Error creating improvement action:", error);
    return { error: "Failed to create improvement action." };
  }
}

export async function updateImprovementActionStatus(id: string, companyId: string, status: string) {
  try {
    await prisma.improvementAction.update({
      where: { id },
      data: { status }
    });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error updating improvement action:", error);
    return { error: "Failed to update improvement action." };
  }
}

export async function deleteImprovementAction(id: string, companyId: string) {
  try {
    await prisma.improvementAction.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/riesgos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting improvement action:", error);
    return { error: "Failed to delete improvement action." };
  }
}
