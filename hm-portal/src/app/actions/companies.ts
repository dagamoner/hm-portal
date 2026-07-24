"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCompanies() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: 'asc' }
    });
    return companies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function createCompany(formData: FormData) {
  try {
    await prisma.company.create({
      data: {
        name: formData.get("name") as string,
        owner: formData.get("owner") as string,
        taxId: formData.get("taxId") as string,
        address: formData.get("address") as string,
        workContact: formData.get("workContact") as string,
        insuranceART: formData.get("insuranceART") as string,
        establishmentsCount: Number(formData.get("establishmentsCount")) || 1,
        workersAdmin: Number(formData.get("workersAdmin")) || 0,
        workersOps: Number(formData.get("workersOps")) || 0,
        keyData: formData.get("keyData") as string || null,
        remarks: formData.get("remarks") as string || null,
        artUser: formData.get("artUser") as string || null,
        artPass: formData.get("artPass") as string || null,
        industry: formData.get("industry") as string,
        riskLevel: (formData.get("riskLevel") as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') || 'MEDIUM',
        status: formData.get("status") as string || 'Activa',
        safetyCompliance: Number(formData.get("safetyCompliance")) || 0,
      }
    });
    revalidatePath("/portal/empresas");
    return { success: true };
  } catch (error) {
    console.error("Error creating company:", error);
    return { error: "Failed to create company." };
  }
}

export async function updateCompany(id: string, formData: FormData) {
  try {
    await prisma.company.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        owner: formData.get("owner") as string,
        taxId: formData.get("taxId") as string,
        address: formData.get("address") as string,
        workContact: formData.get("workContact") as string,
        insuranceART: formData.get("insuranceART") as string,
        establishmentsCount: Number(formData.get("establishmentsCount")) || 1,
        workersAdmin: Number(formData.get("workersAdmin")) || 0,
        workersOps: Number(formData.get("workersOps")) || 0,
        keyData: formData.get("keyData") as string || null,
        remarks: formData.get("remarks") as string || null,
        artUser: formData.get("artUser") as string || null,
        artPass: formData.get("artPass") as string || null,
        industry: formData.get("industry") as string,
        riskLevel: (formData.get("riskLevel") as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') || 'MEDIUM',
        status: formData.get("status") as string || 'Activa',
        safetyCompliance: Number(formData.get("safetyCompliance")) || 0,
      }
    });
    revalidatePath("/portal/empresas");
    return { success: true };
  } catch (error) {
    console.error("Error updating company:", error);
    return { error: "Failed to update company." };
  }
}

export async function deleteCompany(id: string) {
  try {
    await prisma.company.delete({
      where: { id }
    });
    revalidatePath("/portal/empresas");
    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { error: "Failed to delete company." };
  }
}
