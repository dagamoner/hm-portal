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

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await new Promise(r => setTimeout(r, 1500)); // Anti-bruteforce delay
      return { error: "Credenciales inválidas" };
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
