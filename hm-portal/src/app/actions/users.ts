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
