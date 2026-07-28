"use server";

import { prisma } from "@/lib/prisma";

export async function logAction(data: {
  userId?: string;
  userName: string;
  userRole: string;
  companyId?: string;
  module: string;
  action: 'CREAR' | 'MODIFICAR' | 'ELIMINAR' | 'LOGIN' | 'ACCESO_DENEGADO';
  target: string;
  details?: any;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        userName: data.userName,
        userRole: data.userRole,
        companyId: data.companyId,
        module: data.module,
        action: data.action,
        target: data.target,
        details: data.details || {}
      }
    });
  } catch (error) {
    console.error("Failed to log action:", error);
  }
}

export async function getAuditLogs(timeRange: string) {
  try {
    let dateFilter = {};
    if (timeRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { gte: today };
    } else if (timeRange === '7days') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      dateFilter = { gte: d };
    } else if (timeRange === '30days') {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      dateFilter = { gte: d };
    }

    const whereClause = timeRange === 'all' ? {} : { timestamp: dateFilter };

    return await prisma.auditLog.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      include: {
        company: {
          select: { name: true }
        }
      }
    });
  } catch (error) {
    console.error("Failed to get audit logs:", error);
    return [];
  }
}
