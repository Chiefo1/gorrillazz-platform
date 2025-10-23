/** @type {import('next').NextConfig} */

// Detect environment
const isDev = process.env.NODE_ENV === "development";

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async headers() {
    return [
      {
        source: "/(.*)", // Apply CSP to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: isDev
              // 🧪 Development: allow eval + inline for hot reload, devtools, etc.
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com; object-src 'none'; base-uri 'self';"
              // 🔐 Production: secure CSP, no eval or inline scripts
              : "script-src 'self' https://va.vercel-scripts.com; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
