import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable body size limit for streaming
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  // Increase API route timeout for long-running streams
  serverComponentsExternalPackages: ['@anthropic-ai/sdk']
};

export default nextConfig;
