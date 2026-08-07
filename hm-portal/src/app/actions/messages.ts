"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function sendMessage(companyId: string, content: string) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return { success: false, error: "No autorizado" };
    }

    const isClient = session.user.role === "CLIENT";

    const message = await prisma.internalMessage.create({
      data: {
        companyId,
        senderId: session.user.id,
        content,
        isFromClient: isClient,
        readByAdmin: !isClient, // Si lo envía el admin, el admin ya lo leyó.
        readByClient: isClient, // Si lo envía el cliente, el cliente ya lo leyó.
      },
      include: {
        sender: {
          select: { name: true, role: true }
        }
      }
    });

    revalidatePath("/portal", "layout");
    return { success: true, message };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "No se pudo enviar el mensaje" };
  }
}

export async function getCompanyChat(companyId: string) {
  try {
    const session = await getSession();
    if (!session?.user) return [];

    const messages = await prisma.internalMessage.findMany({
      where: { companyId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: {
          select: { name: true, role: true }
        },
        attendedBy: {
          select: { name: true, role: true }
        }
      }
    });

    return messages;
  } catch (error) {
    console.error("Error getting chat:", error);
    return [];
  }
}

export async function markMessagesAsRead(companyId: string) {
  try {
    const session = await getSession();
    if (!session?.user) return { success: false };

    const isClient = session.user.role === "CLIENT";

    if (isClient) {
      await prisma.internalMessage.updateMany({
        where: { companyId, readByClient: false },
        data: { readByClient: true }
      });
    } else {
      await prisma.internalMessage.updateMany({
        where: { companyId, readByAdmin: false },
        data: { 
          readByAdmin: true,
          attendedById: session.user.id
        }
      });
    }

    revalidatePath("/portal", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false };
  }
}

export async function markAllMessagesAsRead() {
  try {
    const session = await getSession();
    if (!session?.user) return { success: false };

    const isClient = session.user.role === "CLIENT";

    if (isClient) {
      if (session.user.companyId) {
        await prisma.internalMessage.updateMany({
          where: { companyId: session.user.companyId, readByClient: false },
          data: { readByClient: true }
        });
      }
    } else {
      await prisma.internalMessage.updateMany({
        where: { readByAdmin: false },
        data: { 
          readByAdmin: true,
          attendedById: session.user.id
        }
      });
    }

    revalidatePath("/portal", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error marking all messages as read:", error);
    return { success: false };
  }
}

export async function getUnreadMessagesCount() {
  try {
    const session = await getSession();
    if (!session?.user) return 0;

    const isClient = session.user.role === "CLIENT";

    if (isClient) {
      if (!session.user.companyId) return 0;
      
      return await prisma.internalMessage.count({
        where: {
          companyId: session.user.companyId,
          readByClient: false,
          isFromClient: false // Only count messages sent by admins
        }
      });
    } else {
      return await prisma.internalMessage.count({
        where: {
          readByAdmin: false,
          isFromClient: true // Only count messages sent by clients
        }
      });
    }
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

export async function getAllCommunications() {
  try {
    const session = await getSession();
    if (!session?.user || session.user.role === "CLIENT") return [];

    const companiesWithMessages = await prisma.company.findMany({
      where: {
        internalMessages: {
          some: {}
        }
      },
      select: {
        id: true,
        name: true,
        internalMessages: {
          orderBy: { createdAt: "desc" },
          take: 1, 
        },
        _count: {
          select: {
            internalMessages: {
              where: {
                readByAdmin: false,
                isFromClient: true
              }
            }
          }
        }
      }
    });

    return companiesWithMessages.map(c => ({
      companyId: c.id,
      companyName: c.name,
      lastMessage: c.internalMessages[0]?.content || "",
      lastMessageDate: c.internalMessages[0]?.createdAt || null,
      unreadCount: c._count.internalMessages
    })).sort((a, b) => {
      const dateA = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
      const dateB = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
      return dateB - dateA;
    });

  } catch (error) {
    console.error("Error getting all communications:", error);
    return [];
  }
}
