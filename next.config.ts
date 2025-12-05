import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable body size limit for streaming
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  // External packages for server components (Next.js 16+)
  serverExternalPackages: ['@anthropic-ai/sdk']
};

export default nextConfig;
