import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  experimental: {
    allowedRevalidateHeaderKeys: ['authorization', 'x-api-key'],
  },
  allowedDevOrigins: ['https://527a74b84f75.ngrok-free.app'], // Your ngrok URL
  reactStrictMode: false,
};

export default nextConfig;
