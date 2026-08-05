"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";

export async function getProjects(companyId: string) {
  await requireAuth(companyId);
  try {
    const projects = await prisma.project.findMany({
      where: { companyId },
      include: {
        workers: true,
        documents: { orderBy: { createdAt: "desc" } },
        psos: { include: { stages: { orderBy: { createdAt: "asc" } } } }
      },
      orderBy: { createdAt: "desc" },
    });
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getProjectById(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        workers: true,
        documents: { orderBy: { createdAt: "desc" } },
        psos: { include: { stages: { orderBy: { createdAt: "asc" } } } },
        company: true
      },
    });
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export async function createProject(companyId: string, formData: FormData) {
  await requireAuth(companyId);
  try {
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const clientName = formData.get("clientName") as string;
    const surfaceArea = parseFloat(formData.get("surfaceArea") as string) || 0;
    const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null;
    const endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null;
    const status = formData.get("status") as string || "Planificación";
    const description = formData.get("description") as string;

    const project = await prisma.project.create({
      data: {
        companyId,
        name,
        location,
        clientName,
        surfaceArea,
        startDate,
        endDate,
        status,
        description,
      },
    });

    revalidatePath(`/portal/empresas/${companyId}/obras`);
    return { success: true, project };
  } catch (error) {
    console.error("Error creating project:", error);
    return { success: false, error: "Error al crear la obra." };
  }
}

export async function updateProject(projectId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const clientName = formData.get("clientName") as string;
    const surfaceArea = parseFloat(formData.get("surfaceArea") as string) || 0;
    const startDate = formData.get("startDate") ? new Date(formData.get("startDate") as string) : null;
    const endDate = formData.get("endDate") ? new Date(formData.get("endDate") as string) : null;
    const status = formData.get("status") as string;
    const description = formData.get("description") as string;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        location,
        clientName,
        surfaceArea,
        startDate,
        endDate,
        status,
        description,
      },
    });

    revalidatePath(`/portal/empresas/${project.companyId}/obras`);
    return { success: true, project };
  } catch (error) {
    console.error("Error updating project:", error);
    return { success: false, error: "Error al actualizar la obra." };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const project = await prisma.project.delete({
      where: { id: projectId },
    });
    revalidatePath(`/portal/empresas/${project.companyId}/obras`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Error al eliminar la obra." };
  }
}

export async function addWorkerToProject(projectId: string, workerId: string) {
  try {
    await prisma.worker.update({
      where: { id: workerId },
      data: { projectId }
    });
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if(project) {
        revalidatePath(`/portal/empresas/${project.companyId}/obras/${projectId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error adding worker to project:", error);
    return { success: false, error: "Error al asignar trabajador." };
  }
}

export async function removeWorkerFromProject(projectId: string, workerId: string) {
  try {
    await prisma.worker.update({
      where: { id: workerId },
      data: { projectId: null }
    });
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if(project) {
        revalidatePath(`/portal/empresas/${project.companyId}/obras/${projectId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error removing worker from project:", error);
    return { success: false, error: "Error al desasignar trabajador." };
  }
}

export async function createProjectDocument(projectId: string, formData: FormData) {
  try {
    const type = formData.get("type") as string;
    const title = formData.get("title") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const status = formData.get("status") as string || "Presentado";
    const validUntil = formData.get("validUntil") ? new Date(formData.get("validUntil") as string) : null;

    const doc = await prisma.projectDocument.create({
      data: {
        projectId,
        type,
        title,
        fileUrl,
        status,
        validUntil,
      },
    });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project) {
      revalidatePath(`/portal/empresas/${project.companyId}/obras/${projectId}`);
    }
    return { success: true, doc };
  } catch (error) {
    console.error("Error creating project document:", error);
    return { success: false, error: "Error al crear el documento." };
  }
}

export async function deleteProjectDocument(docId: string) {
  try {
    const doc = await prisma.projectDocument.delete({
      where: { id: docId },
    });
    const project = await prisma.project.findUnique({ where: { id: doc.projectId } });
    if (project) {
      revalidatePath(`/portal/empresas/${project.companyId}/obras/${doc.projectId}`);
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting project document:", error);
    return { success: false, error: "Error al eliminar el documento." };
  }
}
