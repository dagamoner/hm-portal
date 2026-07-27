"use server";

import { prisma } from "@/lib/prisma";

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

    // Aquí a futuro se pueden agregar alertas de incidentes, mediciones pendientes, etc.
    // Ejemplo:
    // const pendingIncidents = await prisma.incident.findMany({ where: { status: 'Abierto' } })
    // y agregarlos al array de notifications

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}
