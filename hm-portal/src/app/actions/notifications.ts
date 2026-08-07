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
    // Buscar documentos vencidos o por vencer
    const documents = await prisma.document.findMany({
      where: {
        status: {
          in: ['VENCIDO', 'POR_VENCER']
        }
      },
      include: {
        company: {
          select: { name: true, id: true }
        }
      },
      orderBy: {
        expirationDate: 'asc'
      },
      take: 20
    });

    const notifications: NotificationAlert[] = documents.map(doc => ({
      id: doc.id,
      title: `Documento ${doc.status === 'VENCIDO' ? 'Vencido' : 'Por Vencer'}`,
      message: `El documento "${doc.title}" de ${doc.company.name} ${doc.status === 'VENCIDO' ? 'ha vencido' : 'está por vencer'}.`,
      type: doc.status === 'VENCIDO' ? 'error' : 'warning',
      link: `/portal/empresas/${doc.company.id}/documentacion`,
      date: doc.expirationDate
    }));

    // Obtener notificaciones de mensajes no leídos
    const session = await getSession();
    if (session?.user) {
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
    }

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
