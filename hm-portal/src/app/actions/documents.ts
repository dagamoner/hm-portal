"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDocumentsByCompany(companyId: string) {
  try {
    const documents = await prisma.document.findMany({
      where: { companyId },
      orderBy: { uploadDate: 'desc' }
    });
    return documents;
  } catch (error) {
    console.error("Error fetching documents:", error);
    return [];
  }
}

export async function createDocument(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as 'LEGAL' | 'PERSONAL' | 'ACTIVOS' | 'PROCEDIMIENTOS';
    const companyId = formData.get("companyId") as string;
    const expirationDateStr = formData.get("expirationDate") as string;
    // Process file upload or drive link
    const file = formData.get("file") as File | null;
    const driveUrl = formData.get("driveUrl") as string | null;
    let fileUrl = null;
    
    if (driveUrl && driveUrl.trim() !== '') {
      fileUrl = driveUrl.trim();
    } else if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      fileUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
    }

    let expirationDate = null;
    let status: 'VIGENTE' | 'POR_VENCER' | 'VENCIDO' = 'VIGENTE';

    if (expirationDateStr) {
      expirationDate = new Date(expirationDateStr);
      const now = new Date();
      const diffTime = expirationDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        status = 'VENCIDO';
      } else if (diffDays <= 30) {
        status = 'POR_VENCER';
      }
    }

    await prisma.document.create({
      data: {
        title,
        category,
        companyId,
        expirationDate,
        status,
        fileUrl
      }
    });

    revalidatePath(`/portal/empresas/${companyId}/documentacion`);
    return { success: true };
  } catch (error) {
    console.error("Error creating document:", error);
    return { error: "Ocurrió un error al cargar el documento." };
  }
}

export async function updateDocumentFile(id: string, companyId: string, formData: FormData) {
  try {
    const file = formData.get("file") as File | null;
    const driveUrl = formData.get("driveUrl") as string | null;
    let fileUrl = null;

    if (driveUrl && driveUrl.trim() !== '') {
      fileUrl = driveUrl.trim();
    } else if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');
      fileUrl = `data:${file.type || 'application/octet-stream'};base64,${base64}`;
    } else {
      return { error: "No se seleccionó ningún archivo o enlace válido." };
    }

    await prisma.document.update({
      where: { id },
      data: { fileUrl, uploadDate: new Date() } // Update date when file changes
    });

    revalidatePath(`/portal/empresas/${companyId}/documentacion`);
    return { success: true };
  } catch (error) {
    console.error("Error updating document file:", error);
    return { error: "Ocurrió un error al reemplazar el archivo." };
  }
}

export async function deleteDocument(id: string, companyId: string) {
  try {
    await prisma.document.delete({ where: { id } });
    revalidatePath(`/portal/empresas/${companyId}/documentacion`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting document:", error);
    return { error: "Ocurrió un error al eliminar el documento." };
  }
}
