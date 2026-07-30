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

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user, expires });
    
    const cookieStore = await cookies();
    cookieStore.set("mh_session", session, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

  } catch (error) {
    return { error: "Ha ocurrido un error en el servidor" };
  }
  
  redirect("/portal/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("mh_session");
  redirect("/login");
}
