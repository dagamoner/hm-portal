"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getChecklistTemplates(companyId: string) {
  await requireAuth(companyId);
  return await prisma.checklistTemplate.findMany({
    where: {
      OR: [
        { companyId },
        { companyId: null }
      ]
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createChecklistTemplate(companyId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const template = await prisma.checklistTemplate.create({
    data: {
      companyId,
      name: data.name,
      type: data.type,
      categories: data.categories || [],
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/visitas`);
  return template;
}

export async function updateChecklistTemplate(companyId: string, templateId: string, data: any) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  const template = await prisma.checklistTemplate.update({
    where: { id: templateId },
    data: {
      name: data.name,
      type: data.type,
      categories: data.categories,
    }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/visitas`);
  return template;
}

export async function deleteChecklistTemplate(companyId: string, templateId: string) {
  await requireAuth(companyId, ["ADMIN", "MANAGER", "INSPECTOR"]);
  
  await prisma.checklistTemplate.delete({
    where: { id: templateId }
  });
  
  revalidatePath(`/portal/empresas/${companyId}/visitas`);
}
