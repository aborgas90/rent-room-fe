/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  async rewrites() {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://rent-room-service-be-954638770348.asia-southeast2.run.app";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${baseUrl.replace(/\/$/, "")}/api/v1/:path*`, // pastikan tidak double slash
      },
    ];
  },
};

export default nextConfig;
