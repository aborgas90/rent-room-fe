// middleware.js
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const protectedRoutes = ["/dashboard"];

  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard"], // routes to protect
};
