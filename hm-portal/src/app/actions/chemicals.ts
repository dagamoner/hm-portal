"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getChemicalProducts(companyId: string) {
  try {
    const products = await prisma.chemicalProduct.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching chemical products:", error);
    return { success: false, error: "Error fetching chemical products" };
  }
}

export async function createChemicalProduct(companyId: string, data: any) {
  try {
    const product = await prisma.chemicalProduct.create({
      data: {
        companyId,
        name: data.name,
        casNumber: data.casNumber,
        commonUse: data.commonUse,
        warningWord: data.warningWord,
        pictograms: data.pictograms || [],
        hazardStatements: data.hazardStatements || [],
        precautionaryStatements: data.precautionaryStatements || [],
        fdsUrl: data.fdsUrl,
        fdsCompliant: data.fdsCompliant || false,
        fdsSections: data.fdsSections || {},
        storageLocation: data.storageLocation,
        incompatibilities: data.incompatibilities,
        ventilationRequired: data.ventilationRequired ?? true,
      },
    });

    // Check if it exists in SGA library, if not, add it for future use
    const existingLibraryItem = await prisma.sgaLibraryItem.findFirst({
      where: { name: { equals: data.name, mode: 'insensitive' } }
    });

    if (!existingLibraryItem) {
      await prisma.sgaLibraryItem.create({
        data: {
          name: data.name,
          casNumber: data.casNumber,
          warningWord: data.warningWord,
          pictograms: data.pictograms || [],
          fdsUrl: data.fdsUrl,
        }
      });
    }

    revalidatePath(`/portal/empresas/${companyId}/quimicos`);
    return { success: true, data: product };
  } catch (error) {
    console.error("Error creating chemical product:", error);
    return { success: false, error: "Error creating chemical product" };
  }
}

export async function updateChemicalProduct(companyId: string, id: string, data: any) {
  try {
    const product = await prisma.chemicalProduct.update({
      where: { id },
      data: {
        name: data.name,
        casNumber: data.casNumber,
        commonUse: data.commonUse,
        warningWord: data.warningWord,
        pictograms: data.pictograms,
        hazardStatements: data.hazardStatements,
        precautionaryStatements: data.precautionaryStatements,
        fdsUrl: data.fdsUrl,
        fdsCompliant: data.fdsCompliant,
        fdsSections: data.fdsSections,
        storageLocation: data.storageLocation,
        incompatibilities: data.incompatibilities,
        ventilationRequired: data.ventilationRequired,
      },
    });

    revalidatePath(`/portal/empresas/${companyId}/quimicos`);
    return { success: true, data: product };
  } catch (error) {
    console.error("Error updating chemical product:", error);
    return { success: false, error: "Error updating chemical product" };
  }
}

export async function deleteChemicalProduct(companyId: string, id: string) {
  try {
    await prisma.chemicalProduct.delete({
      where: { id },
    });

    revalidatePath(`/portal/empresas/${companyId}/quimicos`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting chemical product:", error);
    return { success: false, error: "Error deleting chemical product" };
  }
}
