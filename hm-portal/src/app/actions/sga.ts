"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSgaLibrary() {
  try {
    const items = await prisma.sgaLibraryItem.findMany({
      orderBy: { name: 'asc' }
    });
    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching SGA library:", error);
    return { success: false, error: "Error al cargar la biblioteca SGA" };
  }
}

export async function createSgaLibraryItem(data: { name: string; pictograms: string[]; fdsUrl?: string; labelUrl?: string }) {
  try {
    const item = await prisma.sgaLibraryItem.create({
      data: {
        name: data.name,
        pictograms: JSON.stringify(data.pictograms),
        fdsUrl: data.fdsUrl,
        labelUrl: data.labelUrl,
      }
    });
    revalidatePath("/portal/settings"); // Or wherever the library is
    return { success: true, data: item };
  } catch (error) {
    console.error("Error creating SGA item:", error);
    return { success: false, error: "Error al crear elemento SGA" };
  }
}
