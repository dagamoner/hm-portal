'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getStandardActions(companyId: string) {
  try {
    return await prisma.standardAction.findMany({
      where: { companyId },
      orderBy: { title: 'asc' }
    });
  } catch (error: any) {
    return [];
  }
}

export async function createStandardAction(companyId: string, title: string, description: string) {
  try {
    const action = await prisma.standardAction.create({
      data: { companyId, title, description }
    });
    revalidatePath(`/portal/empresas/${companyId}/visitas`);
    return action;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateStandardAction(id: string, title: string, description: string) {
  try {
    const action = await prisma.standardAction.update({
      where: { id },
      data: { title, description }
    });
    return action;
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteStandardAction(id: string) {
  try {
    await prisma.standardAction.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

