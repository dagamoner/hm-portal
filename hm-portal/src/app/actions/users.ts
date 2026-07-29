"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: { company: true },
      orderBy: { name: 'asc' }
    });
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function createUser(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as 'ADMIN' | 'MANAGER' | 'INSPECTOR' | 'CLIENT';
    const companyId = formData.get("companyId") as string;

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return { error: "El nombre de usuario ya está en uso." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        role: role || 'CLIENT',
        companyId: companyId || null,
      }
    });
    
    revalidatePath("/portal/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Ocurrió un error al crear el usuario." };
  }
}

export async function deleteUser(id: string) {
  try {
    // Avoid deleting the main admin
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.username === 'admin') {
      return { error: "No se puede eliminar al administrador principal." };
    }

    await prisma.user.delete({ where: { id } });
    revalidatePath("/portal/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Ocurrió un error al eliminar el usuario." };
  }
}

export async function getUsersWithAuditStats() {
  try {
    const users = await prisma.user.findMany({
      include: { company: true },
      orderBy: { name: 'asc' }
    });

    const enrichedUsers = await Promise.all(users.map(async (user) => {
      const lastLoginLog = await prisma.auditLog.findFirst({
        where: {
          action: 'LOGIN',
          userName: user.name
        },
        orderBy: { timestamp: 'desc' }
      });
      
      const actionsCount = await prisma.auditLog.count({
        where: {
          userName: user.name
        }
      });

      // Active if logged in within last 30 days
      const isActive = lastLoginLog 
        ? (new Date().getTime() - new Date(lastLoginLog.timestamp).getTime()) < 30 * 24 * 60 * 60 * 1000 
        : false;

      return {
        ...user,
        lastLogin: lastLoginLog?.timestamp || null,
        totalActions: actionsCount,
        isActive
      };
    }));

    return enrichedUsers;
  } catch (error) {
    console.error("Error fetching users with stats:", error);
    return [];
  }
}
