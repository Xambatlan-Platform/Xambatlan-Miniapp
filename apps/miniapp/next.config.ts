import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  experimental: {
    allowedRevalidateHeaderKeys: ['authorization', 'x-api-key'],
  },
  allowedDevOrigins: ['https://7dd17759b4f2.ngrok-free.app'], // Your ngrok URL
  reactStrictMode: false,
};

export default nextConfig;
