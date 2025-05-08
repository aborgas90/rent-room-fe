import { NextResponse } from "next/server";

function parseJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
  } catch {
    return null;
  }
}

const protectedRoutes = [
  { path: "/dashboard/kamar", roles: ["admin", "super_admin"] },
  { path: "/dashboard/pengguna", roles: ["admin", "super_admin"] },
  { path: "/dashboard/laporan", roles: ["admin", "super_admin"] },
  { path: "/dashboard/laporan-pengaduan", roles: ["super_admin"] },
];

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const url = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", url));
  }

  const decoded = parseJwt(token);
  const roles = decoded?.roles || [];

  // Cari rule yang cocok
  const matchedRoute = protectedRoutes.find((route) =>
    url.pathname.startsWith(route.path)
  );

  if (
    matchedRoute &&
    !matchedRoute.roles.some((role) => roles.includes(role))
  ) {
    return NextResponse.redirect(new URL("/unauthorized", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
