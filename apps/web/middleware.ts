import { NextRequest, NextResponse } from "next/server";

const publicPaths = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("tm_access")?.value;
  const { pathname } = request.nextUrl;
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/analytics", "/history", "/insights", "/pricing", "/profile", "/trade/:path*", "/login", "/signup"],
};
