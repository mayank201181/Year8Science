import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/season1", destination: "/season1/index.html" },
      { source: "/tv", destination: "/season1/index.html" },
      { source: "/sitcom", destination: "/sitcom/index.html" },
    ];
  },
};

export default nextConfig;
