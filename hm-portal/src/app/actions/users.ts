"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { requireAuth } from "@/lib/auth";

export async function getUsers() {
  await requireAuth(undefined, ['ADMIN']); // Only ADMIN can view all users
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
  await requireAuth(undefined, ['ADMIN']); // Only ADMIN can create users directly for now
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const role = formData.get("role") as 'ADMIN' | 'MANAGER' | 'INSPECTOR' | 'CLIENT';
    const companyId = formData.get("companyId") as string;
    const dni = formData.get("dni") as string;
    const phone = formData.get("phone") as string;
    const hasGlobalAccess = formData.get("hasGlobalAccess") === 'true';
    const assignedCompanyIds = formData.getAll("assignedCompanyIds") as string[];

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
        dni: dni || null,
        phone: phone || null,
        hasGlobalAccess,
        assignedCompanyIds,
        needsPasswordChange: (role || 'CLIENT') === 'CLIENT',
      }
    });
    
    const { logAction } = await import("./auditoria");
    await logAction('Usuarios', 'CREAR', `Usuario creado: ${username}`, { role }, companyId || undefined);

    revalidatePath("/portal/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { error: "Ocurrió un error al crear el usuario." };
  }
}

export async function deleteUser(id: string) {
  await requireAuth(undefined, ['ADMIN']); // Only ADMIN can delete a user
  try {
    // Avoid deleting the main admin
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.username === 'admin') {
      return { error: "No se puede eliminar al administrador principal." };
    }

    await prisma.user.delete({ where: { id } });
    
    const { logAction } = await import("./auditoria");
    await logAction('Usuarios', 'ELIMINAR', `Usuario eliminado: ${user?.username || id}`, {}, user?.companyId || undefined);

    revalidatePath("/portal/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "Ocurrió un error al eliminar el usuario." };
  }
}

export async function updateUser(id: string, formData: FormData) {
  await requireAuth(undefined, ['ADMIN']);
  try {
    const name = formData.get("name") as string;
    const role = formData.get("role") as 'ADMIN' | 'MANAGER' | 'INSPECTOR' | 'CLIENT';
    const companyId = formData.get("companyId") as string;
    const dni = formData.get("dni") as string;
    const phone = formData.get("phone") as string;
    const hasGlobalAccess = formData.get("hasGlobalAccess") === 'true';
    const assignedCompanyIds = formData.getAll("assignedCompanyIds") as string[];

    // Default main admin can't have its role changed
    const user = await prisma.user.findUnique({ where: { id } });
    if (user?.username === 'admin' && role !== 'ADMIN') {
      return { error: "No se puede cambiar el rol del administrador principal." };
    }

    await prisma.user.update({
      where: { id },
      data: {
        name,
        role: user?.username === 'admin' ? 'ADMIN' : (role || 'CLIENT'),
        companyId: companyId || null,
        dni: dni || null,
        phone: phone || null,
        hasGlobalAccess,
        assignedCompanyIds,
      }
    });
    
    const { logAction } = await import("./auditoria");
    await logAction('Usuarios', 'MODIFICAR', `Usuario modificado: ${user?.username || id}`, { role }, companyId || undefined);

    revalidatePath("/portal/usuarios");
    return { success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { error: "Ocurrió un error al actualizar el usuario." };
  }
}

export async function resetUserPassword(id: string, newPassword?: string) {
  await requireAuth(undefined, ['ADMIN']);
  try {
    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) return { error: "Usuario no encontrado" };

    const passwordToSet = newPassword || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(passwordToSet, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        failedLogins: 0,
        lockedUntil: null,
        needsPasswordChange: targetUser.role === 'CLIENT'
      }
    });

    return { success: true, newPassword: passwordToSet };
  } catch (error) {
    console.error("Error resetting password:", error);
    return { error: "Ocurrió un error al restablecer la contraseña." };
  }
}

export async function getUsersWithAuditStats() {
  try {
    await requireAuth(undefined, ['ADMIN']);
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

export async function updateUserProfile(data: { name: string; email: string; dni: string; phone: string }) {
  const session = await requireAuth();
  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "Usuario no encontrado" };

    if (data.email && data.email !== user.email) {
      const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
      if (existingEmail && existingEmail.id !== user.id) {
        return { error: "El correo electrónico ya está en uso." };
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        email: data.email || null,
        dni: data.dni || null,
        phone: data.phone || null,
      }
    });

    const { logAction } = await import("./auditoria");
    await logAction('Perfil', 'MODIFICAR', 'El usuario actualizó sus datos de perfil', {}, user.companyId || undefined);

    revalidatePath("/portal/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Ocurrió un error al actualizar el perfil." };
  }
}

export async function changeUserPassword(currentPassword: string, newPassword: string) {
  const session = await requireAuth();
  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "Usuario no encontrado" };

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return { error: "La contraseña actual es incorrecta." };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
        needsPasswordChange: false
      }
    });

    const { logAction } = await import("./auditoria");
    await logAction('Perfil', 'MODIFICAR', 'El usuario cambió su contraseña voluntariamente', {}, user.companyId || undefined);

    // Update the session
    const { encrypt } = await import("@/lib/auth");
    const { cookies } = await import("next/headers");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const newSession = await encrypt({ user: { ...user, password: hashedPassword }, expires });
    const cookieStore = await cookies();
    cookieStore.set("mh_session", newSession, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Ocurrió un error al cambiar la contraseña." };
  }
}

export async function reportSystemIssue(message: string) {
  const session = await requireAuth();
  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return { error: "Usuario no encontrado" };

    const { logAction } = await import("./auditoria");
    await logAction(
      'SOPORTE_TECNICO', 
      'CREAR', 
      `Problema técnico reportado: ${message}`, 
      { originalMessage: message, severity: 'CRITICAL' }, 
      user.companyId || undefined
    );

    return { success: true };
  } catch (error) {
    console.error("Error reporting issue:", error);
    return { error: "Ocurrió un error al enviar el reporte." };
  }
}
