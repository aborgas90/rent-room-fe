/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FILE_BASE_URL: process.env.NEXT_PUBLIC_FILE_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_FILE_BASE_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
