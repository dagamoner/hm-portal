"use server";

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

// ==========================================
// TRAINING PLANS
// ==========================================

export async function getTrainingPlans(companyId: string) {
  try {
    await requireAuth(companyId);
    return await prisma.trainingPlan.findMany({
      where: { companyId },
      include: {
        trainings: {
          include: {
            records: true
          }
        }
      },
      orderBy: { year: 'desc' }
    });
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function getTrainingPlanByYear(companyId: string, year: number) {
  try {
    await requireAuth(companyId);
    return await prisma.trainingPlan.findUnique({
      where: {
        companyId_year: {
          companyId,
          year
        }
      },
      include: {
        trainings: {
          include: {
            records: true
          },
          orderBy: { monthIndex: 'asc' }
        }
      }
    });
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function createTrainingPlan(companyId: string, year: number) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);
    const existing = await getTrainingPlanByYear(companyId, year);
    if (existing) return existing;

    const plan = await prisma.trainingPlan.create({
      data: {
        companyId,
        year
      }
    });
    
    return plan;
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

// ==========================================
// TRAININGS
// ==========================================

export async function createTraining(companyId: string, data: any) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);
    const training = await prisma.training.create({
      data: {
        companyId,
        planId: data.planId,
        title: data.title,
        description: data.description,
        monthIndex: data.monthIndex,
        type: data.type,
        priority: data.priority,
        externalLink: data.externalLink,
        status: data.status || 'Bloqueada'
      }
    });
    
    revalidatePath(`/portal/empresas/${companyId}/capacitaciones`);
    return training;
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function updateTraining(id: string, companyId: string, data: any) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER', 'INSPECTOR']);
    const training = await prisma.training.update({
      where: { id },
      data
    });
    
    revalidatePath(`/portal/empresas/${companyId}/capacitaciones`);
    return training;
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function deleteTraining(id: string, companyId: string) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);
    await prisma.training.delete({
      where: { id }
    });
    
    revalidatePath(`/portal/empresas/${companyId}/capacitaciones`);
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function getTrainingDetails(id: string) {
  try {
    const trainingInfo = await prisma.training.findUnique({ where: { id }, select: { companyId: true }});
    if (trainingInfo) {
      await requireAuth(trainingInfo.companyId);
    }
    return await prisma.training.findUnique({
      where: { id },
      include: {
        records: {
          include: {
            worker: true
          }
        },
        plan: true
      }
    });
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

// ==========================================
// TRAINING RECORDS (WORKERS)
// ==========================================

export async function syncTrainingRecords(trainingId: string, companyId: string) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER']);
    // 1. Get all workers for this company
    const workers = await prisma.worker.findMany({
      where: { companyId }
    });
    
    // 2. Get existing records for this training
    const existingRecords = await prisma.trainingRecord.findMany({
      where: { trainingId }
    });
    const existingWorkerIds = existingRecords.map(r => r.workerId);
    
    // 3. Create missing records
    const missingWorkers = workers.filter(w => !existingWorkerIds.includes(w.id));
    
    if (missingWorkers.length > 0) {
      await prisma.trainingRecord.createMany({
        data: missingWorkers.map(w => ({
          trainingId,
          workerId: w.id,
          companyId
        }))
      });
    }
    
    return await getTrainingDetails(trainingId);
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

export async function saveTrainingRecords(records: any[], companyId: string) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER', 'INSPECTOR']);
    // We update each record sequentially or via transaction
    const updates = records.map(record => {
      return prisma.trainingRecord.update({
        where: { id: record.id },
        data: {
          completed: record.completed,
          hasExam: record.hasExam,
          approved: record.approved,
          score: (record.score !== null && record.score !== undefined && record.score !== '') ? parseFloat(record.score) : null,
          certificateId: record.certificateId,
          completionDate: record.completionDate ? new Date(record.completionDate) : null,
          expirationDate: record.completionDate ? new Date(new Date(record.completionDate).setFullYear(new Date(record.completionDate).getFullYear() + 1)) : null
        }
      });
    });
    
    await prisma.$transaction(updates);
    revalidatePath(`/portal/empresas/${companyId}/capacitaciones`);
    // Assuming we could also just revalidate everything in the portal
    revalidatePath(`/portal/empresas/${companyId}/capacitaciones/[trainingId]`, 'page');
  } catch (error: any) {
        console.error("Action Error:", error);
        return { error: error.message || "Ha ocurrido un error inesperado." };
    }
}

// ==========================================
// DASHBOARD STATS
// ==========================================

export async function getTrainingDashboardStats(companyId: string) {
  try {
    await requireAuth(companyId);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // 1-12
    
    const plan = await prisma.trainingPlan.findUnique({
      where: { companyId_year: { companyId, year: currentYear } },
      include: {
        trainings: {
          include: {
            records: true
          }
        }
      }
    });
    
    if (!plan) return null;
    
    const totalTrainings = plan.trainings.length;
    let completedTrainings = 0;
    
    // We removed auto-unlocking because the user explicitly wants to control the status.
    
    plan.trainings.forEach(t => {
      if (t.status === 'Completada') completedTrainings++;
    });
    
    const compliancePercentage = totalTrainings > 0 ? Math.round((completedTrainings / totalTrainings) * 100) : 0;
    
    // Expiring records (yellow)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const allRecords = await prisma.trainingRecord.findMany({
      where: { 
        companyId,
        completed: true,
        expirationDate: { not: null }
      },
      include: {
        worker: true,
        training: true
      }
    });
    
    const expiredRecords = allRecords.filter(r => r.expirationDate && r.expirationDate < new Date());
    const expiringSoonRecords = allRecords.filter(r => r.expirationDate && r.expirationDate >= new Date() && r.expirationDate <= thirtyDaysFromNow);

    return {
      totalTrainings,
      completedTrainings,
      compliancePercentage,
      expiredAlerts: expiredRecords.length,
      expiringAlerts: expiringSoonRecords.length
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}
