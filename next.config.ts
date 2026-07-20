import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.18.68", "localhost"],
  // Fix workspace root detection with multiple lockfiles
  turbopack: {
    root: "/home/majid/wmduo-next",
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.googleapis.com",
              "img-src 'self' data: blob: https://*.shopify.com https://cdn.shopify.com https://*.googleapis.com https://*.gstatic.com https://images.unsplash.com https://raw.githubusercontent.com",
              "font-src 'self' https://fonts.gstatic.com https://*.googleapis.com",
              "connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://images.unsplash.com https://raw.githubusercontent.com",
              "frame-src 'self' https://*.youtube.com https://*.facebook.com",
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              // "upgrade-insecure-requests",  // Dev only — remove for production HTTPS
            ].join("; "),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
