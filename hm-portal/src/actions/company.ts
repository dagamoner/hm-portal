"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCompany(formData: FormData) {
  const name = formData.get("name") as string;
  const taxId = formData.get("taxId") as string;
  const industry = formData.get("industry") as string;
  const riskLevel = formData.get("riskLevel") as string;
  const address = formData.get("address") as string;

  if (!name || !taxId) {
    throw new Error("Nombre y CUIT son obligatorios");
  }

  await prisma.company.create({
    data: {
      name,
      taxId,
      industry,
      riskLevel,
      address,
    },
  });

  revalidatePath("/portal/companies");
  redirect("/portal/companies");
}
