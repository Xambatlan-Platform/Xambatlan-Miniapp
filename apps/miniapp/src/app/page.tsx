'use client';

import { AuthButton } from '@/components/AuthButton';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to profile
  }
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌟 Xambatlán
          </h1>
          <p className="text-gray-600">
            Trust-ranking Mini App for World App
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🧪 Frontend Testing Mode
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Mock API Running</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Next.js Mini App Ready</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">
                App ID: {process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}
              </span>
            </div>
          </div>
        </div>

        {/* Authentication Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🆔 World ID Authentication
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Test the World ID verification flow with your app ID.
          </p>
          <AuthButton />
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🚀 Coming Soon
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">👥</span>
                <span className="text-sm font-medium">Profile Management</span>
              </div>
              <span className="text-xs text-gray-500">Mock Ready</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🛍️</span>
                <span className="text-sm font-medium">Service Directory</span>
              </div>
              <span className="text-xs text-gray-500">Mock Ready</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🔒</span>
                <span className="text-sm font-medium">Pay-to-Reveal</span>
              </div>
              <span className="text-xs text-gray-500">Mock Ready</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">💰</span>
                <span className="text-sm font-medium">Escrow Deals</span>
              </div>
              <span className="text-xs text-gray-500">Mock Ready</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⭐</span>
                <span className="text-sm font-medium">Reputation System</span>
              </div>
              <span className="text-xs text-gray-500">Mock Ready</span>
            </div>
          </div>
        </div>

        {/* Test Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">
            📱 Testing Instructions
          </h4>
          <ol className="text-xs text-blue-700 space-y-1">
            <li>1. <strong>QR Code:</strong> Visit /test page for QR code to scan</li>
            <li>2. <strong>Direct URL:</strong> https://7dd17759b4f2.ngrok-free.app/</li>
            <li>3. <strong>World App:</strong> Use App ID {process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}</li>
            <li>4. <strong>Debug:</strong> Check browser console for MiniKit info</li>
          </ol>
          <div className="mt-3">
            <a
              href="/test"
              className="inline-block px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
            >
              📱 Get QR Code
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Built with Next.js 15 + MiniKit + World ID</p>
          <p>Frontend Testing Environment v1.0</p>
        </div>
      </div>
    </main>
  );
}
