import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/3288",
        has: [{ type: "host", value: "(?:www\\.)?auryes\\.vn" }],
        destination: "https://3288.site",
        permanent: true,
      },
      {
        source: "/3288/:path*",
        has: [{ type: "host", value: "(?:www\\.)?auryes\\.vn" }],
        destination: "https://3288.site/:path*",
        permanent: true,
      },
      {
        source: "/3288",
        has: [{ type: "host", value: "3288.site" }],
        destination: "https://3288.site",
        permanent: true,
      },
      {
        source: "/3288/:path*",
        has: [{ type: "host", value: "3288.site" }],
        destination: "https://3288.site/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "host", value: "3288.site" }],
          destination: "/3288",
        },
        {
          source:
            "/:path((?!_next$|_next/|api$|api/|3288$|3288/|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$|manifest\\.webmanifest$|icon\\.|apple-icon\\.).*)",
          has: [{ type: "host", value: "3288.site" }],
          destination: "/3288/:path",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
