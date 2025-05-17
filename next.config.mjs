/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_FILE_BASE_URL: process.env.NEXT_PUBLIC_FILE_BASE_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        // proxikan ke backend tanpa menambah `/api/v1` lagi karena sudah ada di source
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
