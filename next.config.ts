import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Excludes /api/v1/* (widget-facing, CORS-controlled per lib/widget-auth.ts)
        // and /v1.js (the embeddable widget script) so third-party sites embedding
        // the widget snippet are never affected by these dashboard-page headers.
        source: "/((?!api/v1|v1.js).*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // The widget script is fetched by every visitor on every customer site.
        // Short max-age keeps a bug-fix rollout reaching visitors quickly;
        // stale-while-revalidate lets the CDN/browser serve the cached copy
        // instantly while it refetches in the background.
        source: "/v1.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
