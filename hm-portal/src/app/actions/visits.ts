'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// =====================================
// ESTABLISHMENTS (For visits)
// =====================================

export async function getEstablishments(companyId: string) {
  try {
    return await prisma.establishment.findMany({
      where: { companyId },
      orderBy: { name: 'asc' }
    });
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

// =====================================
// VISITS
// =====================================

export async function getVisits(companyId: string) {
  try {
    return await prisma.visit.findMany({
      where: { companyId },
      include: {
        establishment: true,
        findings: true
      },
      orderBy: { date: 'desc' }
    });
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function getVisitById(id: string) {
  try {
    return await prisma.visit.findUnique({
      where: { id },
      include: {
        establishment: true,
        findings: true
      }
    });
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function createVisit(companyId: string, data: any) {
  try {
    const visit = await prisma.visit.create({
      data: {
        companyId,
        establishmentId: data.establishmentId,
        date: new Date(data.date),
        visitNumber: data.visitNumber ? parseInt(data.visitNumber) : null,
        inspectorName: data.inspectorName,
        observations: data.observations,
        recommendedTrainings: data.recommendedTrainings,
        checklistData: data.checklistData,
        // Create findings directly if passed
        findings: data.findings && data.findings.length > 0 ? {
          create: data.findings.map((finding: any) => ({
            companyId,
            description: finding.description,
            hazardLevel: finding.hazardLevel || 'Medio',
            deadline: finding.deadline ? new Date(finding.deadline) : null
          }))
        } : undefined
      }
    });
    
    revalidatePath(`/portal/empresas/${companyId}/visitas`);
    return visit;
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

// =====================================
// FINDINGS (DESVÍOS)
// =====================================

export async function getFindings(companyId: string) {
  try {
    return await prisma.visitFinding.findMany({
      where: { companyId },
      include: {
        visit: {
          include: {
            establishment: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function updateFindingStatus(id: string, status: string, actionPlan?: string) {
  try {
    const data: any = { status };
    if (actionPlan) data.actionPlan = actionPlan;
    if (status === 'CERRADO') data.resolutionDate = new Date();
    
    const finding = await prisma.visitFinding.update({
      where: { id },
      data,
      include: {
        visit: true
      }
    });
    
    if (finding.companyId) {
      revalidatePath(`/portal/empresas/${finding.companyId}/visitas`);
    }
    return finding;
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}
