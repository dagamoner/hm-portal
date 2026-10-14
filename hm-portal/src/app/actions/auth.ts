"use server";

import { encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Usuario y contraseña son requeridos" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      await new Promise(r => setTimeout(r, 1500)); // Anti-bruteforce delay
      return { error: "Credenciales inválidas" };
    }

    // A. Verificar si la cuenta está bloqueada
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return { error: "Tu cuenta ha sido bloqueada temporalmente por demasiados intentos fallidos. Intenta de nuevo en 24 horas." };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await new Promise(r => setTimeout(r, 1500)); // Anti-bruteforce delay
      
      // B. Incrementar intentos fallidos
      const newFailedLogins = (user.failedLogins || 0) + 1;
      let lockedUntil = null;
      
      if (newFailedLogins >= 5) {
        lockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLogins: newFailedLogins, lockedUntil }
      });
      
      if (lockedUntil) {
        return { error: "Demasiados intentos fallidos. Tu cuenta ha sido bloqueada por 24 horas." };
      }
      
      return { error: `Credenciales inválidas. Te quedan ${5 - newFailedLogins} intento(s).` };
    }

    // C. Resetear intentos si el login es exitoso
    if (user.failedLogins > 0 || user.lockedUntil) {
      await prisma.user.update({
        where: { id: user.id },
        data: { failedLogins: 0, lockedUntil: null }
      });
    }

    // Create session (only include necessary fields to keep JWT size under 4KB)
    const { password: _, signatureUrl: __, ...safeUser } = user;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: safeUser, expires });
    
    const cookieStore = await cookies();
    cookieStore.set("mh_session", session, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    // Log the action (need to import logAction at the top or dynamically)
    const { logAction } = await import("./auditoria");
    await logAction('Acceso', 'LOGIN', 'Inicio de sesión', {}, user.companyId || undefined, user.name || user.username, user.role);

  } catch (error) {
    return { error: "Ha ocurrido un error en el servidor" };
  }
  
  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("mh_session");
  redirect("/login");
}

export async function updatePassword(userId: string, newPassword: string, newUsername?: string) {
  try {
    if (newUsername && newUsername.trim()) {
      const trimmedUsername = newUsername.trim();
      const existing = await prisma.user.findFirst({
        where: {
          username: trimmedUsername,
          id: { not: userId }
        }
      });
      if (existing) {
        return { error: "El nombre de usuario ya está en uso por otra persona." };
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updateData: any = { 
      password: hashedPassword,
      needsPasswordChange: false
    };

    if (newUsername && newUsername.trim()) {
      updateData.username = newUsername.trim();
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Update the session safely (excluding large fields)
    const { password: _, signatureUrl: __, ...safeUser } = user;
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session = await encrypt({ user: safeUser, expires });
    const cookieStore = await cookies();
    cookieStore.set("mh_session", session, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

    return { success: true };
  } catch (error) {
    return { error: "Error al actualizar las credenciales" };
  }
}
