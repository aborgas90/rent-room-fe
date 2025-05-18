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
  { path: "/dashboard/laporan-keuangan", roles: ["admin", "super_admin"] },
  { path: "/dashboard/laporan-pengaduan", roles: ["super_admin"] },
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
];

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  console.log("All cookies:", request.cookies.getAll());
  const url = request.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", url));
  }

  console.log(token, "token");
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
