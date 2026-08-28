"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export type NotificationAlert = {
  id: string;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  link: string;
  date: Date | null;
};

export async function getSystemNotifications(): Promise<NotificationAlert[]> {
  try {
    const session = await getSession();
    if (!session?.user) return [];

    const companyId = session.user.role === 'CLIENT' ? session.user.companyId : undefined;
    const whereCompany = companyId ? { companyId } : {};

    // 1. Documentos vencidos o por vencer
    const documents = await prisma.document.findMany({
      where: {
        ...whereCompany,
        status: {
          in: ['VENCIDO', 'POR_VENCER']
        }
      },
      include: { company: { select: { name: true, id: true } } },
      orderBy: { expirationDate: 'asc' },
      take: 10
    });

    const notifications: NotificationAlert[] = documents.map(doc => ({
      id: doc.id,
      title: `Documento ${doc.status === 'VENCIDO' ? 'Vencido' : 'Por Vencer'}`,
      message: `El documento "${doc.title}" de ${doc.company.name} ${doc.status === 'VENCIDO' ? 'ha vencido' : 'está por vencer'}.`,
      type: doc.status === 'VENCIDO' ? 'error' : 'warning',
      link: `/portal/empresas/${doc.company.id}/documentacion`,
      date: doc.expirationDate
    }));

    // 2. Desvíos de Alto Riesgo Vencidos o por vencer
    const now = new Date();
    const inTwoDays = new Date();
    inTwoDays.setDate(inTwoDays.getDate() + 2);

    const findings = await prisma.visitFinding.findMany({
      where: {
        ...whereCompany,
        status: { not: 'CERRADO' },
        hazardLevel: 'ALTO',
        deadline: { lte: inTwoDays, not: null }
      },
      include: { company: true },
      take: 10
    });

    findings.forEach(f => {
      const isVencido = f.deadline! < now;
      notifications.push({
        id: `finding-${f.id}`,
        title: isVencido ? 'Desvío de Alto Riesgo Vencido' : 'Desvío de Alto Riesgo por vencer',
        message: `Desvío crítico en ${f.company.name} ${isVencido ? 'venció el' : 'vence el'} ${f.deadline!.toLocaleDateString()}.`,
        type: isVencido ? 'error' : 'warning',
        link: `/portal/empresas/${f.company.id}/visitas`,
        date: f.deadline
      });
    });

    // 3. Visitas programadas (Hoy o Mañana)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowEnd = new Date(todayStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 2); // Hasta el fin de mañana

    const visits = await prisma.visit.findMany({
      where: {
        ...(companyId ? { establishment: { companyId } } : {}),
        date: { gte: todayStart, lt: tomorrowEnd }
      },
      include: { establishment: { include: { company: true } } },
      take: 10
    });

    visits.forEach(v => {
      const isToday = v.date < new Date(todayStart.getTime() + 86400000);
      notifications.push({
        id: `visit-${v.id}`,
        title: 'Visita Programada',
        message: `Tienes una visita programada para ${isToday ? 'hoy' : 'mañana'} en ${v.establishment.company.name}.`,
        type: 'info',
        link: `/portal/empresas/${v.establishment.companyId}/visitas`,
        date: v.date
      });
    });

    // 4. Mensajes no leídos
    const isClient = session.user.role === "CLIENT";
    const unreadMessagesCount = isClient && session.user.companyId
      ? await prisma.internalMessage.count({
          where: { companyId: session.user.companyId, readByClient: false, isFromClient: false }
        })
      : await prisma.internalMessage.count({
          where: { readByAdmin: false, isFromClient: true }
        });

    if (unreadMessagesCount > 0) {
      notifications.push({
        id: 'unread-messages',
        title: `Nuevos Mensajes`,
        message: `Tienes ${unreadMessagesCount} mensaje(s) sin leer.`,
        type: 'info',
        link: isClient ? `/portal/empresas/${session.user.companyId}` : `/portal/settings/log-auditoria?tab=comunicaciones`,
        date: new Date()
      });
    }

    // Ordenar notificaciones por fecha más reciente
    notifications.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return b.date.getTime() - a.date.getTime();
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
