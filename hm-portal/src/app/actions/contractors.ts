'use server';

import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { logAction } from './auditoria';
import { revalidatePath } from 'next/cache';

// =======================
// PROJECTS
// =======================

export async function getProjects(companyId: string) {
    await requireAuth(companyId);
    return await prisma.project.findMany({
        where: { companyId },
        include: {
            projectContractors: {
                include: {
                    contractor: true,
                    safetyPrograms: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createProject(companyId: string, data: any) {
    await requireAuth(companyId);
    const project = await prisma.project.create({
        data: {
            companyId,
            name: data.name,
            location: data.location,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            status: data.status || 'Activo',
            description: data.description
        }
    });
    
    await logAction('Contratistas', 'CREAR', `Proyecto: ${project.name}`, { id: project.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return project;
}

export async function updateProject(companyId: string, projectId: string, data: any) {
    await requireAuth(companyId);
    const project = await prisma.project.update({
        where: { id: projectId },
        data: {
            name: data.name,
            location: data.location,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            status: data.status,
            description: data.description
        }
    });
    await logAction('Contratistas', 'MODIFICAR', `Proyecto: ${project.name}`, { id: project.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return project;
}

export async function deleteProject(companyId: string, projectId: string) {
    await requireAuth(companyId);
    const project = await prisma.project.delete({
        where: { id: projectId }
    });
    await logAction('Contratistas', 'ELIMINAR', `Proyecto: ${project.name}`, { id: project.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return project;
}

// =======================
// CONTRACTORS
// =======================

export async function getContractors(companyId: string) {
    await requireAuth(companyId);
    return await prisma.contractor.findMany({
        where: { companyId },
        include: {
            documents: true,
            projectContractors: {
                include: {
                    project: true
                }
            }
        },
        orderBy: { name: 'asc' }
    });
}

export async function createContractor(companyId: string, data: any) {
    await requireAuth(companyId);
    const contractor = await prisma.contractor.create({
        data: {
            companyId,
            name: data.name,
            cuit: data.cuit,
            art: data.art,
            contactName: data.contactName,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone
        }
    });
    
    await logAction('Contratistas', 'CREAR', `Contratista: ${contractor.name}`, { id: contractor.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return contractor;
}

export async function updateContractor(companyId: string, contractorId: string, data: any) {
    await requireAuth(companyId);
    const contractor = await prisma.contractor.update({
        where: { id: contractorId },
        data: {
            name: data.name,
            cuit: data.cuit,
            art: data.art,
            contactName: data.contactName,
            contactEmail: data.contactEmail,
            contactPhone: data.contactPhone
        }
    });
    
    await logAction('Contratistas', 'MODIFICAR', `Contratista: ${contractor.name}`, { id: contractor.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return contractor;
}

export async function deleteContractor(companyId: string, contractorId: string) {
    await requireAuth(companyId);
    const contractor = await prisma.contractor.delete({
        where: { id: contractorId }
    });
    await logAction('Contratistas', 'ELIMINAR', `Contratista: ${contractor.name}`, { id: contractor.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return contractor;
}

export async function assignContractorToProject(companyId: string, projectId: string, contractorId: string, data: any) {
    await requireAuth(companyId);
    const assignment = await prisma.projectContractor.create({
        data: {
            projectId,
            contractorId,
            role: data.role || 'Subcontratista',
            noticeOfWork: data.noticeOfWork,
            noticeDate: data.noticeDate ? new Date(data.noticeDate) : null
        }
    });
    await logAction('Contratistas', 'MODIFICAR', `Contratista ID: ${contractorId} a Proyecto ID: ${projectId}`, { assignmentId: assignment.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return assignment;
}

// =======================
// SAFETY PROGRAMS
// =======================

export async function createSafetyProgram(companyId: string, data: any) {
    await requireAuth(companyId);
    const program = await prisma.safetyProgram.create({
        data: {
            projectContractorId: data.projectContractorId,
            title: data.title,
            resolution: data.resolution || '35/1998',
            status: data.status || 'Pendiente',
            approvalDate: data.approvalDate ? new Date(data.approvalDate) : null,
            validUntil: data.validUntil ? new Date(data.validUntil) : null,
            notes: data.notes
        }
    });
    await logAction('Contratistas', 'CREAR', `Prog. Seguridad: ${program.title}`, { id: program.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return program;
}

export async function updateSafetyProgramStatus(companyId: string, programId: string, status: string) {
    await requireAuth(companyId);
    const program = await prisma.safetyProgram.update({
        where: { id: programId },
        data: { status }
    });
    await logAction('Contratistas', 'MODIFICAR', `Estado Prog. Seguridad: ${program.title} a ${status}`, { id: program.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return program;
}

// =======================
// DOCUMENTS
// =======================

export async function uploadContractorDocument(companyId: string, data: any) {
    await requireAuth(companyId);
    const doc = await prisma.contractorDocument.create({
        data: {
            contractorId: data.contractorId,
            name: data.name,
            type: data.type,
            fileUrl: data.fileUrl,
            status: 'Pendiente',
            notes: data.notes
        }
    });
    await logAction('Contratistas', 'CREAR', `Doc: ${doc.name}`, { id: doc.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return doc;
}

export async function updateContractorDocumentStatus(companyId: string, docId: string, status: string) {
    await requireAuth(companyId);
    const doc = await prisma.contractorDocument.update({
        where: { id: docId },
        data: { status }
    });
    await logAction('Contratistas', 'MODIFICAR', `Estado Documento: ${doc.name} a ${status}`, { id: doc.id }, companyId);
    revalidatePath(`/portal/empresas/${companyId}/contratistas`);
    return doc;
}
