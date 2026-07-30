import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

const secretKey = process.env.JWT_SECRET || "super_secret_mh_key_2026";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("mh_session")?.value;
  if (!session) return null;
  
  try {
    return await decrypt(session);
  } catch (error) {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("mh_session")?.value;
  if (!session) return;

  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const res = NextResponse.next();
  res.cookies.set({
    name: "mh_session",
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

export async function requireAuth(companyId?: string, allowedRoles?: string[]) {
  const session = await getSession();
  
  if (!session || !session.user) {
    throw new Error("No autorizado. Debes iniciar sesión.");
  }

  const user = session.user;

  // Role validation
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      throw new Error("Acceso denegado. No tienes los permisos necesarios para realizar esta acción.");
    }
  }

  // IDOR / Company validation
  // Internal roles (ADMIN, MANAGER, INSPECTOR) have universal access
  if (!['ADMIN', 'MANAGER', 'INSPECTOR'].includes(user.role)) {
    if (companyId && user.companyId !== companyId) {
      throw new Error("Acceso denegado. No perteneces a esta empresa.");
    }
  }

  return user;
}
