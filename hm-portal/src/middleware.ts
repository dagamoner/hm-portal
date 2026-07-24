import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/portal"];
const publicRoutes = ["/login", "/", "/contacto"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  const cookie = request.cookies.get("mh_session")?.value;
  let session = null;
  
  if (cookie) {
    try {
      session = await decrypt(cookie);
    } catch (e) {
      session = null;
    }
  }

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (path === "/login" && session?.user) {
    return NextResponse.redirect(new URL("/portal/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|images|.*\\\\.png$).*)'],
};
