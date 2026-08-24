"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

// --- LIBRO HySL ---

export async function getSafetyBookEntries(companyId: string) {
    try {
        const entries = await prisma.safetyBookEntry.findMany({
            where: { companyId },
            orderBy: { folioNumber: 'desc' }
        });
        return entries;
    } catch (error) {
        console.error("Error fetching safety book entries:", error);
        return [];
    }
}

export async function createSafetyBookEntry(companyId: string, data: any) {
    try {
        // Obtenemos el último folio para autoincrementar
        const lastEntry = await prisma.safetyBookEntry.findFirst({
            where: { companyId },
            orderBy: { folioNumber: 'desc' }
        });
        
        const nextFolio = lastEntry ? lastEntry.folioNumber + 1 : 1;

        const entry = await prisma.safetyBookEntry.create({
            data: {
                companyId,
                folioNumber: nextFolio,
                date: new Date(data.date.includes('T') ? data.date : `${data.date}T12:00:00Z`),
                professional: data.professional,
                registryNumber: data.registryNumber,
                observations: data.observations,
                recommendations: data.recommendations,
                deadlines: data.deadlines,
                signature: true,
                signedBy: data.signedBy,
            }
        });
        
        const session = await getSession();
        if (session?.user && session.user.role !== "CLIENT") {
            const company = await prisma.company.findUnique({ where: { id: companyId }});
            if (company) {
                let dateStr = data.date;
                if (data.date && data.date.includes('-')) {
                    const parts = data.date.split('-');
                    dateStr = `${parts[2]}/${parts[1]}/${parts[0]}`;
                }
                
                let msg = `En el día de la fecha ${dateStr} se asienta el folio N° ${String(nextFolio).padStart(4, '0')} en el Libro Digital de Higiene y Seguridad de la empresa ${company.name}, estableciendo las siguientes observaciones: "${data.observations}". A continuación se eleva informe correspondiente para la toma de medidas a fin de regularizar lo observado.`;

                await prisma.internalMessage.create({
                    data: {
                        companyId,
                        senderId: session.user.id,
                        content: msg,
                        isFromClient: false,
                        readByAdmin: true,
                        readByClient: false
                    }
                });
            }
        }

        revalidatePath(`/portal`);
        return { success: true, entry };
    } catch (error) {
        console.error("Error creating safety book entry:", error);
        return { success: false, error: "Error al crear asiento en el libro." };
    }
}

// --- REPORTES GERENCIALES ---

export async function getManagementReports(companyId: string) {
    try {
        const reports = await prisma.managementReport.findMany({
            where: { companyId },
            orderBy: { createdAt: 'desc' }
        });
        return reports;
    } catch (error) {
        console.error("Error fetching management reports:", error);
        return [];
    }
}

export async function generateReportData(companyId: string, type: 'SEMANAL' | 'MENSUAL', periodDate: Date) {
    try {
        // Determinar inicio y fin del periodo
        const startDate = new Date(periodDate);
        const endDate = new Date(periodDate);
        
        if (type === 'MENSUAL') {
            startDate.setDate(1);
            startDate.setHours(0, 0, 0, 0);
            endDate.setMonth(endDate.getMonth() + 1);
            endDate.setDate(0);
            endDate.setHours(23, 59, 59, 999);
        } else {
            // Semana actual (lunes a domingo)
            const day = startDate.getDay();
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
            startDate.setDate(diff);
            startDate.setHours(0, 0, 0, 0);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
        }

        // Consultas
        const [incidentsCount, visitsCount, trainedCount] = await Promise.all([
            prisma.incident.count({
                where: { companyId, date: { gte: startDate, lte: endDate } }
            }),
            prisma.visit.count({
                where: { companyId, date: { gte: startDate, lte: endDate } }
            }),
            prisma.trainingRecord.count({
                where: { companyId, completionDate: { gte: startDate, lte: endDate } }
            })
        ]);

        return {
            workedHours: 0, // Placeholder si no hay registro de horas
            incidentsCount,
            inspectionsCount: visitsCount,
            trainedWorkers: trainedCount,
            startDate,
            endDate
        };
    } catch (error) {
        console.error("Error generating report data:", error);
        return null;
    }
}

export async function saveManagementReport(companyId: string, data: any) {
    try {
        const report = await prisma.managementReport.create({
            data: {
                companyId,
                type: data.type,
                period: data.period,
                workedHours: data.workedHours,
                incidentsCount: data.incidentsCount,
                inspectionsCount: data.inspectionsCount,
                trainedWorkers: data.trainedWorkers,
                generatedBy: data.generatedBy,
            }
        });
        
        revalidatePath(`/portal`);
        return { success: true, report };
    } catch (error) {
        console.error("Error saving report:", error);
        return { success: false, error: "Error al guardar reporte." };
    }
}
