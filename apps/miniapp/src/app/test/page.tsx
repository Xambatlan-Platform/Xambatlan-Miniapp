'use client';

import { AuthButton } from '@/components/AuthButton';
import { useState } from 'react';

export default function TestPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const appId = process.env.NEXT_PUBLIC_WORLD_ID_APP_ID;
  const ngrokUrl = 'https://7dd17759b4f2.ngrok-free.app';

  // CORRECT World App URL formats from official docs
  const worldAppDeepLink = `worldapp://mini-app?app_id=${appId}&path=/`;
  const worldAppUniversalLink = `https://world.org/mini-app?app_id=${appId}&path=/`;

  // For testing - we need to register our ngrok URL as the Mini App URL in World ID portal
  const testingNgrokUrl = ngrokUrl;

  // Direct portal link provided by user
  const directPortalLink = 'https://world.org/mini-app?app_id=app_f9d136c94bb262ec8d183d844e8298cf&draft_id=meta_a9594db8cca78f624a522a3a074e3e10';

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🧪 Xambatlán Testing
          </h1>
          <p className="text-sm text-gray-600">
            Scan QR code with your phone camera
          </p>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            📱 Test with World App
          </h2>

          {/* QR Code Container - Deep Link Format */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-2">🔗 Deep Link QR Code (Try this first)</p>
            <div className="w-48 h-48 mx-auto bg-white p-2 rounded border mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(worldAppDeepLink)}`}
                alt="Deep Link QR Code for World App"
                className="w-full h-full"
              />
            </div>
            <p className="text-xs text-gray-600 mb-2">🌐 Web URL QR Code (Alternative)</p>
            <div className="w-48 h-48 mx-auto bg-white p-2 rounded border">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(worldAppUniversalLink)}`}
                alt="Universal Link QR Code for World App"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Instructions */}
          <div className="text-left space-y-2 text-sm text-gray-600">
            <p><strong>Method 1 - QR Scan:</strong></p>
            <p>• Scan QR code with your phone camera</p>
            <p>• Tap "Open in World App" when prompted</p>
            <p><strong>Method 2 - Manual:</strong></p>
            <p>• Open World App → Mini Apps → Enter App ID: {appId}</p>
            <p>• Or copy and share the URL below</p>
          </div>

          {/* Copy URL Buttons */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => copyToClipboard(worldAppDeepLink, 'deep')}
              className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              {copied === 'deep' ? '✅ Copied!' : '📋 Copy Deep Link URL'}
            </button>
            <button
              onClick={() => copyToClipboard(worldAppUniversalLink, 'web')}
              className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              {copied === 'web' ? '✅ Copied!' : '📋 Copy Web URL'}
            </button>
          </div>

          {/* App Details */}
          <div className="mt-4 p-3 bg-blue-50 rounded text-xs text-blue-800">
            <p><strong>App ID:</strong> {appId}</p>
            <p><strong>URL:</strong> {ngrokUrl}</p>
            <p><strong>Deep Link:</strong> {worldAppDeepLink}</p>
            <p><strong>Universal Link:</strong> {worldAppUniversalLink}</p>
          </div>
        </div>

        {/* DIRECT WORLD PORTAL LINK */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            🎯 DIRECT WORLD PORTAL LINK (READY!)
          </h3>
          <div className="text-sm text-green-700 space-y-2">
            <p><strong>✅ Your app is already configured! Use this direct link:</strong></p>
            <a
              href="https://world.org/mini-app?app_id=app_f9d136c94bb262ec8d183d844e8298cf&draft_id=meta_a9594db8cca78f624a522a3a074e3e10"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 bg-green-100 rounded text-green-800 hover:bg-green-200 font-mono text-xs break-all"
            >
              https://world.org/mini-app?app_id=app_f9d136c94bb262ec8d183d844e8298cf&draft_id=meta_a9594db8cca78f624a522a3a074e3e10
            </a>
            <div className="mt-4 flex justify-center">
              <div className="w-32 h-32 bg-white p-2 rounded border">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(directPortalLink)}`}
                  alt="Direct Portal QR Code"
                  className="w-full h-full"
                />
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(directPortalLink, 'portal')}
              className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 mt-2"
            >
              {copied === 'portal' ? '✅ Copied!' : '📋 Copy Portal Link'}
            </button>
            <p className="mt-3 text-xs"><strong>This QR code/link should work directly in World App!</strong></p>
          </div>
        </div>

        {/* Direct Testing Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔍 Direct Testing (if already in World App)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            If you're already viewing this in World App, test directly:
          </p>
          <AuthButton />
        </div>

        {/* Status Information */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            ⚙️ Testing Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Mock API Ready (port 3001)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Mini App Running (port 3000)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">Ngrok Tunnel Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-600">World ID App Configured</span>
            </div>
          </div>
        </div>

        {/* Alternative URLs */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            🔗 Alternative Testing Methods
          </h4>
          <div className="text-xs text-yellow-700 space-y-2">
            <p><strong>Direct World App URL:</strong></p>
            <p className="font-mono bg-yellow-100 p-1 rounded break-all text-xs">
              {worldAppDeepLink}
            </p>
            <p><strong>Universal Link:</strong></p>
            <p className="font-mono bg-yellow-100 p-1 rounded break-all text-xs">
              {worldAppUniversalLink}
            </p>
            <p><strong>Or visit:</strong> https://docs.world.org/mini-apps/quick-start/testing</p>
            <p>Enter App ID: <code className="bg-yellow-100 px-1 rounded">{appId}</code></p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>🌟 Xambatlán Testing Environment</p>
          <p>Ready for World ID verification testing</p>
        </div>
      </div>
    </main>
  );
}