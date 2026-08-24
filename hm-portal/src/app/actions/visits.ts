'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

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
        date: new Date(data.date.includes('T') ? data.date : `${data.date}T12:00:00Z`),
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
      },
      include: {
        establishment: true,
        findings: true
      }
    });
    const session = await getSession();
    if (session?.user && session.user.role !== "CLIENT") {
      const company = await prisma.company.findUnique({ where: { id: companyId }});
      if (company && visit.establishment) {
        let dateStr = data.date;
        if (data.date && data.date.includes('-')) {
            const parts = data.date.split('-');
            dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        const findingsCount = visit.findings.length;
        
        let msg = `En fecha ${dateStr} se realiza la visita de Higienistas al establecimiento ${visit.establishment.name} de la empresa ${company.name}, en donde, en tareas de relevamiento de condiciones de Higiene y Seguridad en el trabajo, se detectaron ${findingsCount} desvíos / No Conformidades, y se realizó un acta de visita la cual contiene lo siguiente: "${visit.observations || 'Sin observaciones detalladas'}". A continuación se le eleva informe correspondiente para que tome las medidas correspondientes a fin de levantar dichas observaciones/desvíos/No conformidades.`;

        await prisma.internalMessage.create({
          data: {
            companyId,
            senderId: session.user.id,
            content: msg,
            isFromClient: false,
            readByAdmin: true,
            readByClient: false
          }
        });
      }
    }

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
