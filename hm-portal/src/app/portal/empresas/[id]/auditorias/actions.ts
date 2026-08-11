"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createInspection(
  companyId: string, 
  templateId: string, 
  title: string, 
  location: string, 
  date: string
) {
  const template = await prisma.checklistTemplate.findUnique({
    where: { id: templateId }
  });

  if (!template) {
    throw new Error("Plantilla no encontrada");
  }

  // The items will start as the template's categories (cloned structure)
  // Inside the category, items will be mapped to have an answer field
  const templateCategories = (template.categories as any[]) || [];
  
  const initialItems = templateCategories.map((cat: any) => ({
    categoryName: cat.name || "General",
    questions: (cat.items || []).map((q: any) => ({
      id: crypto.randomUUID(),
      question: typeof q === 'string' ? q : q.question || q.name,
      answer: null, // "CUMPLE", "NO_CUMPLE", "NO_APLICA"
      observation: ""
    }))
  }));

  const inspection = await prisma.inspection.create({
    data: {
      title,
      location,
      date: new Date(date),
      status: "En Progreso",
      score: 0,
      companyId,
      items: JSON.stringify(initialItems),
    }
  });

  revalidatePath(`/portal/empresas/${companyId}/auditorias`);
  return inspection.id;
}

export async function updateInspectionStatus(inspectionId: string, status: string, companyId: string) {
  await prisma.inspection.update({
    where: { id: inspectionId },
    data: { status }
  });
  revalidatePath(`/portal/empresas/${companyId}/auditorias`);
  revalidatePath(`/portal/empresas/${companyId}/auditorias/${inspectionId}`);
}

export async function deleteInspection(inspectionId: string, companyId: string) {
  await prisma.inspection.delete({
    where: { id: inspectionId }
  });
  revalidatePath(`/portal/empresas/${companyId}/auditorias`);
}

export async function saveInspectionAnswers(
  inspectionId: string, 
  items: any, 
  score: number,
  companyId: string
) {
  await prisma.inspection.update({
    where: { id: inspectionId },
    data: { 
      items: JSON.stringify(items),
      score,
      status: "En Progreso" // keep in progress until explicitly finished
    }
  });
  revalidatePath(`/portal/empresas/${companyId}/auditorias/${inspectionId}`);
}
