"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function logAction(
  module: string,
  action: 'CREAR' | 'MODIFICAR' | 'ELIMINAR' | 'LOGIN' | 'ACCESO_DENEGADO' | 'LOGIN_FALLIDO',
  target: string,
  details?: any,
  companyId?: string,
  explicitUserName?: string,
  explicitUserRole?: string
) {
  try {
    const session = await getSession();
    const userName = explicitUserName || session?.user?.name || session?.user?.username || 'Usuario Desconocido';
    const userRole = explicitUserRole || session?.user?.role || 'User';

    // Determine severity
    let severity = 'INFO';
    if (action === 'ACCESO_DENEGADO' || action === 'ELIMINAR') {
      severity = 'CRITICAL';
    } else if (action === 'MODIFICAR') {
      severity = 'WARNING';
    }

    return await prisma.auditLog.create({
      data: {
        userName,
        userRole,
        module,
        action,
        target,
        severity,
        details: details || {},
        companyId
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
