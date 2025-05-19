import { NextResponse } from "next/server";

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1];
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error("JWT Parse Error:", error);
    return null;
  }
}

const protectedRoutes = [
  { path: "/dashboard/kamar", roles: ["admin", "super_admin"] },
  { path: "/dashboard/pengguna", roles: ["admin", "super_admin"] },
  { path: "/dashboard/laporan-keuangan", roles: ["admin", "super_admin"] },
  { path: "/dashboard/laporan-pengaduan", roles: ["super_admin", "admin"] },
  { path: "/dashboard/pengaduan", roles: ["super_admin", "member"] },
  {
    path: "/dashboard/pembayaran",
    roles: ["super_admin", "member", "out_member"],
  },
  {
    path: "/dashboard/pembayaran/:id",
    roles: ["super_admin", "member", "out_member", "admin"],
  },
  {
    path: "/dashboard/booking-approval",
    roles: ["super_admin", "out_member", "admin"],
  },
  {
    path: "/dashboard/riwayat-transaksi",
    roles: ["super_admin", "out_member", "admin", "member"],
  },
  {
    path: "/dashboard",
    roles: ["super_admin", "out_member", "admin", "member"],
  },
];

export function middleware(request) {
  const allCookies = request.cookies.getAll();
  console.log("All Cookies:", allCookies);

  const token = request.cookies.get("token")?.value;
  console.log("Token Retrieved:", token);

  const url = request.nextUrl;
  console.log("Request Path:", url.pathname);

  if (!token) {
    console.warn("No Token Found! Redirecting to /auth/login");
    return NextResponse.redirect(new URL("/auth/login", url));
  }

  const decoded = parseJwt(token);
  console.log("Decoded JWT:", decoded);

  const roles = decoded?.roles || [];
  console.log("User Roles:", roles);

  const matchedRoute = protectedRoutes.find((route) =>
    url.pathname.startsWith(route.path)
  );
  console.log("Matched Route:", matchedRoute);

  if (matchedRoute) {
    console.log("Protected Route Detected:", matchedRoute.path);
    const hasAccess = matchedRoute.roles.some((role) => roles.includes(role));
    console.log("Has Access:", hasAccess);

    if (!hasAccess) {
      console.warn("User Unauthorized! Redirecting to /unauthorized");
      return NextResponse.redirect(new URL("/unauthorized", url));
    }
  } else {
    console.log("Public Route - No Protection Applied");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
