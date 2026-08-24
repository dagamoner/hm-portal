"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getEppDeliveries(companyId: string) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER', 'INSPECTOR', 'CLIENT']);
    
    const deliveries = await prisma.eppDelivery.findMany({
      where: { companyId },
      orderBy: { date: 'desc' },
      include: {
        worker: {
          include: {
            primaryRole: true
          }
        }
      }
    });
    
    return deliveries;
  } catch (error: any) {
    console.error("Error fetching EPP deliveries:", error);
    return { error: error.message || "Ha ocurrido un error inesperado." };
  }
}

export async function getEppDeliveryByWorker(workerId: string, companyId: string) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER', 'INSPECTOR', 'CLIENT']);
    
    const delivery = await prisma.eppDelivery.findFirst({
      where: { 
        workerId,
        companyId
      },
      orderBy: { date: 'desc' }
    });
    
    return delivery;
  } catch (error: any) {
    console.error("Error fetching worker EPP delivery:", error);
    return { error: error.message || "Ha ocurrido un error inesperado." };
  }
}

export async function saveEppDelivery(companyId: string, workerId: string, data: any) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER', 'INSPECTOR', 'CLIENT']);
    
    const existing = await prisma.eppDelivery.findFirst({
      where: { workerId, companyId },
      orderBy: { date: 'desc' }
    });
    
    let result;
    if (existing) {
      result = await prisma.eppDelivery.update({
        where: { id: existing.id },
        data: {
          date: new Date(data.date.includes('T') ? data.date : `${data.date}T12:00:00Z`),
          items: data.items,
          additionalInfo: data.additionalInfo || null,
          signed: data.signed || false
        }
      });
    } else {
      result = await prisma.eppDelivery.create({
        data: {
          workerId,
          companyId,
          date: new Date(data.date.includes('T') ? data.date : `${data.date}T12:00:00Z`),
          items: data.items,
          additionalInfo: data.additionalInfo || null,
          signed: data.signed || false
        }
      });
    }
    
    revalidatePath(`/portal/empresas/${companyId}/epp`);
    revalidatePath(`/portal/empresas/${companyId}/epp/${workerId}`);
    revalidatePath(`/portal/empresas/${companyId}/personal`);
    
    return result;
  } catch (error: any) {
    console.error("Error saving EPP delivery:", error);
    return { error: error.message || "Ha ocurrido un error inesperado." };
  }
}

export async function deleteEppDelivery(id: string, companyId: string) {
  try {
    await requireAuth(companyId, ['ADMIN', 'MANAGER', 'INSPECTOR', 'CLIENT']);
    
    await prisma.eppDelivery.delete({
      where: { id }
    });
    
    revalidatePath(`/portal/empresas/${companyId}/epp`);
    revalidatePath(`/portal/empresas/${companyId}/personal`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting EPP delivery:", error);
    return { error: error.message || "Ha ocurrido un error inesperado." };
  }
}
