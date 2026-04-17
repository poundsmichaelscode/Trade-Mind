import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/signup", "/status", "/api/auth/store", "/api/auth/clear"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("tm_access")?.value;
  const { pathname } = request.nextUrl;
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/analytics", "/history", "/insights", "/pricing", "/profile", "/trade/:path*", "/login", "/signup", "/status", "/api/auth/:path*"],
};
