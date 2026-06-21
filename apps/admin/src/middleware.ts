import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kscsystem-jwt-secret-change-in-production-2026"
);

const ADMIN_COOKIE_NAME = "kscsystem_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  let payload: { role?: string } | null = null;
  if (token) {
    try {
      const { payload: p } = await jwtVerify(token, JWT_SECRET);
      payload = p as { role?: string };
    } catch {
      payload = null;
    }
  }

  const isLoggedIn = payload?.role === "superadmin";

  // Zalogowany na /login → przekieruj do panelu
  if (pathname === "/login") {
    if (isLoggedIn) {
      const home = request.nextUrl.clone();
      home.pathname = "/";
      home.search = "";
      return NextResponse.redirect(home);
    }
    return NextResponse.next();
  }

  // Pozostałe trasy wymagają sesji superadmina
  if (!isLoggedIn) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    if (pathname !== "/") loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // "/" musi byc jawnie — przy basePath "/admin" matcher z grupą nie łapie gołego /admin (root),
  // przez co dashboard renderował się bez sesji. Patrz: auth bypass na /admin.
  matcher: ["/", "/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
