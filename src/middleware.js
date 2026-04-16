import { NextResponse } from "next/server";

export function middleware(request) {
  const authCookie = request.cookies.get("admin-auth");

  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isLoginRoute = pathname === "/adminLogin";

  // Not Logged In → Block Dashboard
  if (isDashboardRoute && !authCookie) {
    return NextResponse.redirect(new URL("/adminLogin", request.url));
  }

  // Logged In → Prevent Login Page Access
  if (isLoginRoute && authCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/adminLogin"],
};