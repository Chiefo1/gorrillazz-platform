/** @type {import('next').NextConfig} */

// Detect environment
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },

  async headers() {
    return [
      {
        source: "/(.*)", // Apply CSP to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: isDev
              ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' wss: https:;"
              : "default-src 'self' data: blob: https://va.vercel-scripts.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' wss: https:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
