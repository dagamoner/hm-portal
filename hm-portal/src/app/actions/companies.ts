"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function getCompanies() {
  const user = await requireAuth(); 
  
  try {
    if (user.role === 'ADMIN' || user.hasGlobalAccess) {
      const companies = await prisma.company.findMany({
        orderBy: { name: 'asc' }
      });
      return companies;
    } else if (['MANAGER', 'INSPECTOR'].includes(user.role)) {
      const allowedCompanyIds = user.assignedCompanyIds || [];
      const companies = await prisma.company.findMany({
        where: { id: { in: allowedCompanyIds } },
        orderBy: { name: 'asc' }
      });
      return companies;
    } else {
      if (!user.companyId) return [];
      const company = await prisma.company.findUnique({
        where: { id: user.companyId }
      });
      return company ? [company] : [];
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
    return [];
  }
}

export async function getCompanyById(id: string) {
  await requireAuth(id); // User must belong to this company (or be ADMIN)
  try {
    const company = await prisma.company.findUnique({
      where: { id }
    });
    return company;
  } catch (error) {
    console.error("Error fetching company by id:", error);
    return null;
  }
}

export async function createCompany(formData: FormData) {
  await requireAuth(undefined, ['ADMIN']); // Only ADMIN can create a new company
  try {
    await prisma.company.create({
      data: {
        name: formData.get("name") as string,
        legalName: formData.get("legalName") as string || null,
        owner: formData.get("owner") as string,
        taxId: formData.get("taxId") as string,
        address: formData.get("address") as string,
        workContact: formData.get("workContact") as string,
        insuranceART: formData.get("insuranceART") as string,
        selfInsured: formData.get("selfInsured") === "on" || formData.get("selfInsured") === "true",
        establishmentsCount: Number(formData.get("establishmentsCount")) || 1,
        workersAdmin: Number(formData.get("workersAdmin")) || 0,
        workersOps: Number(formData.get("workersOps")) || 0,
        keyData: formData.get("keyData") as string || null,
        remarks: formData.get("remarks") as string || null,
        artUser: formData.get("artUser") as string || null,
        artPass: formData.get("artPass") as string || null,
        industry: formData.get("industry") as string,
        secondaryActivity: formData.get("secondaryActivity") as string || null,
        activityCode: formData.get("activityCode") as string || null,
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
  await requireAuth(id, ['ADMIN', 'MANAGER']); // Only ADMIN/MANAGER can update company profile
  try {
    await prisma.company.update({
      where: { id },
      data: {
        name: formData.get("name") as string,
        legalName: formData.get("legalName") as string || null,
        owner: formData.get("owner") as string,
        taxId: formData.get("taxId") as string,
        address: formData.get("address") as string,
        workContact: formData.get("workContact") as string,
        insuranceART: formData.get("insuranceART") as string,
        selfInsured: formData.get("selfInsured") === "on" || formData.get("selfInsured") === "true",
        establishmentsCount: Number(formData.get("establishmentsCount")) || 1,
        workersAdmin: Number(formData.get("workersAdmin")) || 0,
        workersOps: Number(formData.get("workersOps")) || 0,
        keyData: formData.get("keyData") as string || null,
        remarks: formData.get("remarks") as string || null,
        artUser: formData.get("artUser") as string || null,
        artPass: formData.get("artPass") as string || null,
        industry: formData.get("industry") as string,
        secondaryActivity: formData.get("secondaryActivity") as string || null,
        activityCode: formData.get("activityCode") as string || null,
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
  await requireAuth(id, ['ADMIN']); // Only ADMIN can delete a company
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
