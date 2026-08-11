"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateHHT(companyId: string, hht: number) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company) throw new Error("Empresa no encontrada");

  let parsedKeyData = {};
  if (company.keyData) {
    try {
      parsedKeyData = JSON.parse(company.keyData);
    } catch (e) {
      parsedKeyData = {};
    }
  }

  const updatedKeyData = {
    ...parsedKeyData,
    hhtMensuales: hht
  };

  await prisma.company.update({
    where: { id: companyId },
    data: {
      keyData: JSON.stringify(updatedKeyData)
    }
  });

  revalidatePath(`/portal/empresas/${companyId}/siniestralidad`);
  return { success: true };
}
