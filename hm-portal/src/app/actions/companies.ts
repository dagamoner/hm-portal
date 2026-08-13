"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

async function calculateRealCompliance(companyId: string): Promise<number> {
  const [workers, inspections, incidents, docsCount] = await Promise.all([
    prisma.worker.findMany({ where: { companyId } }),
    prisma.inspection.findMany({ where: { companyId } }),
    prisma.incident.findMany({ where: { companyId } }),
    prisma.document.count({ where: { companyId } })
  ]);

  let workerScore = 0;
  if (workers.length > 0) {
    const workersWithEpp = workers.filter(w => {
      if (!w.laborData) return false;
      const data = typeof w.laborData === 'string' ? JSON.parse(w.laborData) : (w.laborData as any);
      return data.eppDelivered === 'Sí';
    });
    workerScore = (workersWithEpp.length / workers.length) * 30;
  }

  let inspectionScore = 0;
  if (inspections.length > 0) {
    const avgScore = inspections.reduce((acc, ins) => acc + (ins.score || 0), 0) / inspections.length;
    inspectionScore = (avgScore / 100) * 30;
  }

  let incidentScore = 20;
  if (incidents.length > 0) {
    const closedIncidents = incidents.filter(i => i.status.toLowerCase() === 'cerrado' || i.status.toLowerCase() === 'resuelto');
    incidentScore = (closedIncidents.length / incidents.length) * 20;
  }

  let docScore = docsCount > 0 ? 20 : 0;

  return Math.round(workerScore + inspectionScore + incidentScore + docScore);
}

export async function getCompanies() {
  const user = await requireAuth(); 
  
  try {
    let companies: any[] = [];
    if (user.role === 'ADMIN' || user.hasGlobalAccess) {
      companies = await prisma.company.findMany({
        include: { establishments: true },
        orderBy: { name: 'asc' }
      });
    } else if (['MANAGER', 'INSPECTOR'].includes(user.role)) {
      const allowedCompanyIds = user.assignedCompanyIds || [];
      companies = await prisma.company.findMany({
        where: { id: { in: allowedCompanyIds } },
        include: { establishments: true },
        orderBy: { name: 'asc' }
      });
    } else {
      const clientCompanyIds = [...(user.assignedCompanyIds || [])];
      if (user.companyId && !clientCompanyIds.includes(user.companyId)) {
        clientCompanyIds.push(user.companyId);
      }
      
      if (clientCompanyIds.length > 0) {
        companies = await prisma.company.findMany({
          where: { id: { in: clientCompanyIds } },
          include: { establishments: true },
          orderBy: { name: 'asc' }
        });
      } else {
        companies = [];
      }
    }

    const enhancedCompanies = await Promise.all(
      companies.map(async (company) => {
        const [realCompliance, realWorkerCount, realAuditCount] = await Promise.all([
          calculateRealCompliance(company.id),
          prisma.worker.count({ where: { companyId: company.id } }),
          prisma.inspection.count({ where: { companyId: company.id } })
        ]);
        
        // Optional: Update it in DB asynchronously without blocking to keep data somewhat in sync
        prisma.company.update({
          where: { id: company.id },
          data: { safetyCompliance: realCompliance }
        }).catch(() => {});

        return { ...company, safetyCompliance: realCompliance, realWorkerCount, realAuditCount };
      })
    );

    return enhancedCompanies;
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
    if (!company) return null;

    const realCompliance = await calculateRealCompliance(company.id);
    return { ...company, safetyCompliance: realCompliance };
  } catch (error) {
    console.error("Error fetching company by id:", error);
    return null;
  }
}

export async function createCompany(formData: FormData) {
  const user = await requireAuth(undefined, ['ADMIN', 'MANAGER', 'INSPECTOR']); 
  try {
    const estsJSON = formData.get("establishmentsJSON") as string;
    let establishments = [];
    if (estsJSON) {
      establishments = JSON.parse(estsJSON);
    }
    const estsCount = establishments.length > 0 ? establishments.length : (Number(formData.get("establishmentsCount")) || 1);

    const company = await prisma.company.create({
      data: {
        name: formData.get("name") as string,
        legalName: formData.get("legalName") as string || null,
        owner: formData.get("owner") as string,
        taxId: formData.get("taxId") as string,
        address: formData.get("address") as string,
        workContact: formData.get("workContact") as string,
        insuranceART: formData.get("insuranceART") as string,
        selfInsured: formData.get("selfInsured") === "on" || formData.get("selfInsured") === "true",
        establishmentsCount: estsCount,
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
        disabledModules: formData.getAll('disabledModules') as string[],
      }
    });

    if (establishments.length > 0) {
      for (const est of establishments) {
        await prisma.establishment.create({
          data: {
            companyId: company.id,
            name: est.name,
            address: est.address,
            staffing: JSON.stringify({ workersAdmin: est.workersAdmin, workersOps: est.workersOps, total: (est.workersAdmin || 0) + (est.workersOps || 0) }),
            regulatoryRegime: JSON.stringify({ activities: est.activities }),
          }
        });
      }
    }

    // Logic for assigning users
    if (user.role === 'ADMIN') {
      const assignedUsers = formData.getAll('assignedUsers') as string[];
      for (const userId of assignedUsers) {
        const u = await prisma.user.findUnique({ where: { id: userId } });
        if (u) {
          const currentList = u.assignedCompanyIds || [];
          if (!currentList.includes(company.id)) {
            await prisma.user.update({
              where: { id: userId },
              data: { assignedCompanyIds: { push: company.id } }
            });
          }
        }
      }
    } else {
      // MANAGER or INSPECTOR automatically get assigned
      const currentUser = await prisma.user.findUnique({ where: { id: user.id } });
      if (currentUser) {
        const currentList = currentUser.assignedCompanyIds || [];
        if (!currentList.includes(company.id)) {
          await prisma.user.update({
            where: { id: user.id },
            data: { assignedCompanyIds: { push: company.id } }
          });
        }
      }
    }

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
    const estsJSON = formData.get("establishmentsJSON") as string;
    let establishments = [];
    if (estsJSON) {
      establishments = JSON.parse(estsJSON);
    }
    const estsCount = establishments.length > 0 ? establishments.length : (Number(formData.get("establishmentsCount")) || 1);

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
        establishmentsCount: estsCount,
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
        disabledModules: formData.getAll('disabledModules') as string[],
      }
    });

    if (establishments.length > 0) {
      // For simplicity in sync: delete existing establishments created here?
      // No, better to just let the Risk Manager handle edits of existing ones.
      // But if we want to sync, we might need a way to track IDs.
      // Assuming new establishments don't have an ID, or we just add them if they don't have an ID.
      for (const est of establishments) {
        if (!est.id) {
          await prisma.establishment.create({
            data: {
              companyId: id,
              name: est.name,
              address: est.address,
              staffing: JSON.stringify({ workersAdmin: est.workersAdmin, workersOps: est.workersOps, total: (est.workersAdmin || 0) + (est.workersOps || 0) }),
              regulatoryRegime: JSON.stringify({ activities: est.activities }),
            }
          });
        } else {
          await prisma.establishment.update({
            where: { id: est.id },
            data: {
              name: est.name,
              address: est.address,
              staffing: JSON.stringify({ workersAdmin: est.workersAdmin, workersOps: est.workersOps, total: (est.workersAdmin || 0) + (est.workersOps || 0) }),
              regulatoryRegime: JSON.stringify({ activities: est.activities }),
            }
          });
        }
      }
    }

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
