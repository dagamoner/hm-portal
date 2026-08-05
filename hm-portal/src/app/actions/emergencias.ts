"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// ==========================================
// EMERGENCY PLANS
// ==========================================

export async function getEmergencyPlans(companyId: string) {
  await requireAuth(companyId);
  return await prisma.emergencyPlan.findMany({
    where: { companyId },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createEmergencyPlan(companyId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const plan = await prisma.emergencyPlan.create({
    data: {
      title: data.title,
      companyId,
      establishmentId: data.establishmentId || null,
      riskScenarios: data.riskScenarios || [],
      evacuationRoutes: data.evacuationRoutes || [],
      protocols: data.protocols || [],
      status: data.status || "Vigente",
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return plan;
}

export async function updateEmergencyPlan(companyId: string, planId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const plan = await prisma.emergencyPlan.update({
    where: { id: planId },
    data: {
      title: data.title,
      establishmentId: data.establishmentId || null,
      riskScenarios: data.riskScenarios,
      evacuationRoutes: data.evacuationRoutes,
      protocols: data.protocols,
      status: data.status,
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return plan;
}

export async function deleteEmergencyPlan(companyId: string, planId: string) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  await prisma.emergencyPlan.delete({
    where: { id: planId }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
}

// ==========================================
// EMERGENCY DRILLS
// ==========================================

export async function getEmergencyDrills(companyId: string) {
  await requireAuth(companyId);
  return await prisma.emergencyDrill.findMany({
    where: { companyId },
    orderBy: { date: "desc" },
  });
}

export async function createEmergencyDrill(companyId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const drill = await prisma.emergencyDrill.create({
    data: {
      title: data.title,
      type: data.type,
      date: new Date(data.date),
      companyId,
      targetTimeStr: data.targetTimeStr,
      actualTimeStr: data.actualTimeStr,
      evacuatedCount: data.evacuatedCount ? parseInt(data.evacuatedCount) : null,
      expectedCount: data.expectedCount ? parseInt(data.expectedCount) : null,
      findings: data.findings || [],
      observations: data.observations,
      status: data.status || "Programado",
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return drill;
}

export async function updateEmergencyDrill(companyId: string, drillId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const drill = await prisma.emergencyDrill.update({
    where: { id: drillId },
    data: {
      title: data.title,
      type: data.type,
      date: data.date ? new Date(data.date) : undefined,
      targetTimeStr: data.targetTimeStr,
      actualTimeStr: data.actualTimeStr,
      evacuatedCount: data.evacuatedCount ? parseInt(data.evacuatedCount) : null,
      expectedCount: data.expectedCount ? parseInt(data.expectedCount) : null,
      findings: data.findings,
      observations: data.observations,
      status: data.status,
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return drill;
}

export async function deleteEmergencyDrill(companyId: string, drillId: string) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  await prisma.emergencyDrill.delete({
    where: { id: drillId }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
}

// ==========================================
// BRIGADE MEMBERS
// ==========================================

export async function getBrigadeMembers(companyId: string) {
  await requireAuth(companyId);
  return await prisma.brigadeMember.findMany({
    where: { companyId },
    include: {
      worker: true
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createBrigadeMember(companyId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const member = await prisma.brigadeMember.create({
    data: {
      companyId,
      workerId: data.workerId,
      role: data.role,
      shift: data.shift,
      area: data.area,
      medicalAptitudeDate: data.medicalAptitudeDate ? new Date(data.medicalAptitudeDate) : null,
      medicalAptitudeStatus: data.medicalAptitudeStatus,
      competenceMatrix: data.competenceMatrix || [],
      status: data.status || "Activo",
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return member;
}

export async function updateBrigadeMember(companyId: string, memberId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const member = await prisma.brigadeMember.update({
    where: { id: memberId },
    data: {
      role: data.role,
      shift: data.shift,
      area: data.area,
      medicalAptitudeDate: data.medicalAptitudeDate ? new Date(data.medicalAptitudeDate) : null,
      medicalAptitudeStatus: data.medicalAptitudeStatus,
      competenceMatrix: data.competenceMatrix,
      status: data.status,
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return member;
}

export async function deleteBrigadeMember(companyId: string, memberId: string) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  await prisma.brigadeMember.delete({
    where: { id: memberId }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
}

// ==========================================
// EMERGENCY EQUIPMENT
// ==========================================

export async function getEmergencyEquipment(companyId: string) {
  await requireAuth(companyId);
  return await prisma.emergencyEquipment.findMany({
    where: { companyId },
    orderBy: { type: "asc" },
  });
}

export async function createEmergencyEquipment(companyId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const equipment = await prisma.emergencyEquipment.create({
    data: {
      companyId,
      name: data.name,
      type: data.type,
      location: data.location,
      status: data.status || "Operativo",
      lastInspection: data.lastInspection ? new Date(data.lastInspection) : null,
      nextInspection: data.nextInspection ? new Date(data.nextInspection) : null,
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
      details: data.details || {},
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return equipment;
}

export async function updateEmergencyEquipment(companyId: string, equipmentId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const equipment = await prisma.emergencyEquipment.update({
    where: { id: equipmentId },
    data: {
      name: data.name,
      type: data.type,
      location: data.location,
      status: data.status,
      lastInspection: data.lastInspection ? new Date(data.lastInspection) : null,
      nextInspection: data.nextInspection ? new Date(data.nextInspection) : null,
      expirationDate: data.expirationDate ? new Date(data.expirationDate) : null,
      details: data.details,
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
  return equipment;
}

export async function deleteEmergencyEquipment(companyId: string, equipmentId: string) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  await prisma.emergencyEquipment.delete({
    where: { id: equipmentId }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/emergencias`);
}

// ==========================================
// EMERGENCY CONTACTS
// ==========================================

export async function getEmergencyContacts(companyId: string) {
    try {
        return await prisma.emergencyContact.findMany({
            where: { 
                OR: [
                    { project: { companyId } },
                    { establishment: { companyId } }
                ]
            },
            include: { project: true, establishment: true },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching emergency contacts:", error);
        return [];
    }
}

export async function createEmergencyContact(companyId: string, data: any) {
    try {
        const contact = await prisma.emergencyContact.create({
            data: {
                projectId: data.projectId || null,
                establishmentId: data.establishmentId || null,
                name: data.name,
                phone: data.phone,
                type: data.type,
                routeContext: data.routeContext
            }
        });
        revalidatePath(`/portal/empresas/${companyId}/emergencias`);
        return { success: true, contact };
    } catch (error) {
        console.error("Error creating emergency contact:", error);
        return { success: false, error: "Error al guardar el contacto." };
    }
}

export async function deleteEmergencyContact(companyId: string, id: string) {
    try {
        await prisma.emergencyContact.delete({ where: { id } });
        revalidatePath(`/portal/empresas/${companyId}/emergencias`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting emergency contact:", error);
        return { success: false, error: "Error al eliminar el contacto." };
    }
}

export async function getProjectsForEmergency(companyId: string) {
    try {
        return await prisma.project.findMany({
            where: { companyId },
            orderBy: { name: 'asc' }
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
}
