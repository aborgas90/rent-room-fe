/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FILE_BASE_URL: process.env.NEXT_PUBLIC_FILE_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/:path*`,
      },
    ];
  },
  experimental: {
    appDir: true, // <- tambahkan ini supaya Next.js pakai folder `app/` sebagai route root
  },
};

export default nextConfig;
