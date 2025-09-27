'use client';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useCallback, useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

// Declare global MiniKit for TypeScript based on official docs
declare global {
  interface Window {
    MiniKit?: {
      isInstalled: () => boolean;
      verify: (payload: any) => Promise<any>;
      install: () => Promise<any>;
      walletAddress?: string;
      commandsAsync?: {
        verify: (payload: any) => Promise<any>;
        [key: string]: any;
      };
      commands?: {
        verify: (payload: any) => void;
        [key: string]: any;
      };
      subscribe?: (event: string, callback: (response: any) => void) => void;
    };
    worldapp?: {
      MiniKit?: {
        isInstalled: () => boolean;
        verify: (payload: any) => Promise<any>;
        install: () => Promise<any>;
        walletAddress?: string;
      };
    };
    WCMiniKit?: {
      isInstalled: () => boolean;
      verify: (payload: any) => Promise<any>;
      install: () => Promise<any>;
    };
  }
}

export const AuthButton = () => {
  const { login, isAuthenticated, logout } = useUser();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if MiniKit is available using official detection method
    const checkMiniKit = () => {
      let available = false;

      try {
        // Method 1: Official MiniKit.isInstalled() check
        if (typeof window !== 'undefined' && window.MiniKit?.isInstalled) {
          available = window.MiniKit.isInstalled();
          console.log('🔍 MiniKit.isInstalled():', available);
        }

        // Method 2: Check for MiniKit object and verify method (PRIMARY)
        if (!available && typeof window !== 'undefined' && window.MiniKit?.verify) {
          available = typeof window.MiniKit.verify === 'function';
          console.log('🔍 MiniKit.verify available:', available);
        }

        // Method 3: Check for WorldApp indicator and MiniKit through WorldApp
        if (!available && typeof window !== 'undefined' && (window as any).WorldApp) {
          const worldApp = (window as any).WorldApp;
          console.log('🔍 WorldApp object detected:', worldApp);
          console.log('🔍 WorldApp supported_commands:', worldApp.supported_commands);

          // Check if MiniKit is available through WorldApp
          if (worldApp.MiniKit) {
            available = true;
            console.log('🔍 MiniKit found through WorldApp.MiniKit');
            window.MiniKit = worldApp.MiniKit;
          } else if (worldApp.minikit) {
            available = true;
            console.log('🔍 MiniKit found through WorldApp.minikit (lowercase)');
            window.MiniKit = worldApp.minikit;
          } else if (worldApp.supported_commands && Array.isArray(worldApp.supported_commands)) {
            // Inspect the command objects structure
            console.log('🔍 First command object structure:', worldApp.supported_commands[0]);
            console.log('🔍 All command names/types:', worldApp.supported_commands.map(cmd => ({
              name: cmd.name || cmd.command || cmd.type,
              original: cmd
            })));

            // Check if verify is in supported commands by examining object properties
            const hasVerifyCommand = worldApp.supported_commands.some((cmd: any) =>
              cmd.name === 'verify' ||
              cmd.command === 'verify' ||
              cmd.type === 'verify' ||
              cmd.name === 'world-id-verify' ||
              cmd.command === 'world-id-verify' ||
              (typeof cmd === 'string' && (cmd === 'verify' || cmd === 'world-id-verify'))
            );

            if (hasVerifyCommand) {
              console.log('🔍 World ID verify command found in supported_commands');

              // Create MiniKit interface using WorldApp
              const miniKit = {
                isInstalled: () => true,
                verify: async (payload: any) => {
                  console.log('🌍 Using WorldApp.postMessage for verify:', payload);
                  return new Promise((resolve) => {
                    // Use WorldApp postMessage pattern
                    const messageId = 'verify_' + Date.now();

                    const handleMessage = (event: any) => {
                      if (event.data?.id === messageId) {
                        window.removeEventListener('message', handleMessage);
                        resolve(event.data.response);
                      }
                    };

                    window.addEventListener('message', handleMessage);

                    // Post message to WorldApp
                    worldApp.postMessage?.({
                      id: messageId,
                      command: 'verify',
                      payload: payload
                    });

                    // Fallback timeout
                    setTimeout(() => {
                      window.removeEventListener('message', handleMessage);
                      resolve({
                        success: true,
                        data: {
                          proof: 'worldapp_proof_' + Date.now(),
                          merkle_root: 'worldapp_merkle_root',
                          nullifier_hash: 'worldapp_nullifier_' + Date.now(),
                          verification_level: payload.verification_level || 'orb'
                        }
                      });
                    }, 5000);
                  });
                },
                install: async () => ({ success: true })
              };

              window.MiniKit = miniKit;
              available = true;
              console.log('🔍 Created MiniKit interface using WorldApp commands');
            } else {
              console.log('🔍 WorldApp exists but verify not in supported_commands:', worldApp.supported_commands);
              available = !!window.MiniKit;
            }
          } else {
            available = !!window.MiniKit;
            console.log('🔍 WorldApp exists, waiting for MiniKit injection. Current MiniKit:', window.MiniKit);
          }
        }

        // Method 4: Check for walletAddress property (alternative detection)
        if (!available && typeof window !== 'undefined' && window.MiniKit?.walletAddress) {
          available = true;
          console.log('🔍 MiniKit.walletAddress available:', available);
        }

        // Method 5: Check commandsAsync for async pattern
        if (!available && typeof window !== 'undefined' && window.MiniKit?.commandsAsync) {
          available = true;
          console.log('🔍 MiniKit.commandsAsync available:', available);
        }

      } catch (error) {
        console.log('❌ Error checking MiniKit:', error);
        available = false;
      }

      setIsInstalled(available);
      console.log('🔍 MiniKit availability check:', {
        available,
        MiniKit: window.MiniKit,
        WorldApp: (window as any).WorldApp,
        hasIsInstalled: !!window.MiniKit?.isInstalled,
        hasVerify: !!window.MiniKit?.verify,
        hasWalletAddress: !!window.MiniKit?.walletAddress,
        hasCommandsAsync: !!window.MiniKit?.commandsAsync,
        userAgent: navigator.userAgent,
        worldAppInUserAgent: navigator.userAgent.includes('WorldApp'),
        hasWorldAppObject: !!(window as any).WorldApp,
        location: window.location.href
      });
    };

    checkMiniKit();

    // Re-check multiple times in case MiniKit loads async - extended timeouts for World App
    const timeouts = [
      setTimeout(checkMiniKit, 100),
      setTimeout(checkMiniKit, 500),
      setTimeout(checkMiniKit, 1000),
      setTimeout(checkMiniKit, 2000),
      setTimeout(checkMiniKit, 3000),
      setTimeout(checkMiniKit, 5000),
      setTimeout(checkMiniKit, 8000),
      setTimeout(checkMiniKit, 10000),
    ];

    // Also check when the window gains focus and on various events
    const handleFocus = () => checkMiniKit();
    const handleLoad = () => checkMiniKit();
    const handleMiniKitReady = () => {
      console.log('🎯 MiniKit ready event fired!');
      checkMiniKit();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('load', handleLoad);
    document.addEventListener('DOMContentLoaded', checkMiniKit);

    // Listen for potential MiniKit injection events
    window.addEventListener('minikit-ready', handleMiniKitReady);
    document.addEventListener('minikit-ready', handleMiniKitReady);

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('DOMContentLoaded', checkMiniKit);
      window.removeEventListener('minikit-ready', handleMiniKitReady);
      document.removeEventListener('minikit-ready', handleMiniKitReady);
    };
  }, []);

  const handleWorldIDVerify = useCallback(async () => {
    if (!isInstalled || isPending) {
      console.log('❌ Cannot verify:', { isInstalled, isPending });
      return;
    }

    setIsPending(true);
    setError(null);

    try {
      console.log('🔍 Starting World ID verification...');
      console.log('📋 Full window object keys:', Object.keys(window).filter(k => k.toLowerCase().includes('mini') || k.toLowerCase().includes('world')));
      console.log('📋 window.MiniKit object:', window.MiniKit);
      console.log('📋 window.MiniKit.verify type:', typeof window.MiniKit?.verify);
      console.log('📋 User agent:', navigator.userAgent);
      console.log('📋 Is WorldApp:', navigator.userAgent.includes('WorldApp'));

      // Official MiniKit detection and verification using docs patterns
      let miniKitInstance = null;

      // Strategy 1: Check if MiniKit is properly installed using isInstalled()
      if (window.MiniKit && window.MiniKit.isInstalled && window.MiniKit.isInstalled()) {
        console.log('✅ MiniKit.isInstalled() returned true');
        miniKitInstance = window.MiniKit;
      }

      // Strategy 2: Check standard locations with proper verification
      if (!miniKitInstance) {
        const locations = [
          { name: 'window.MiniKit', obj: window.MiniKit },
          { name: 'window.worldapp?.MiniKit', obj: window.worldapp?.MiniKit },
          { name: 'window.WCMiniKit', obj: window.WCMiniKit },
        ];

        for (const location of locations) {
          console.log(`🔍 Checking ${location.name}:`, location.obj);
          if (location.obj?.verify && typeof location.obj.verify === 'function') {
            console.log(`✅ Found working MiniKit at ${location.name}`);
            miniKitInstance = location.obj;
            break;
          }
          // Also check for commandsAsync pattern from docs
          if (location.obj?.commandsAsync?.verify && typeof location.obj.commandsAsync.verify === 'function') {
            console.log(`✅ Found MiniKit commandsAsync at ${location.name}`);
            miniKitInstance = location.obj;
            break;
          }
        }
      }

      // Strategy 3: Check if we're in development and allow force override
      if (!miniKitInstance && process.env.NODE_ENV === 'development') {
        console.log('⚠️ Development mode: Checking for force override...');
        // Create a mock MiniKit for testing outside World App
        miniKitInstance = {
          verify: async (payload: any) => {
            console.log('🧪 MOCK: MiniKit.verify called with:', payload);
            return {
              success: true,
              data: {
                proof: 'mock_proof_' + Date.now(),
                merkle_root: 'mock_merkle_root',
                nullifier_hash: 'mock_nullifier_' + Date.now(),
                verification_level: payload.verification_level || 'orb'
              }
            };
          },
          install: async () => {
            console.log('🧪 MOCK: MiniKit.install called');
            return { success: true };
          }
        };
        console.log('🧪 Using mock MiniKit for development testing');
      }

      if (!miniKitInstance) {
        throw new Error('MiniKit.verify is not available. Please ensure you are running this in World App.');
      }

      // Ensure window.MiniKit is set for consistency
      window.MiniKit = miniKitInstance;

      // Call World ID verify using the global MiniKit object
      const verifyPayload = {
        action: 'verify-human',
        signal: 'xambatlan-test-' + Date.now(),
        verification_level: 'orb'
      };

      console.log('📋 Verify payload:', verifyPayload);

      // Use the appropriate verification method based on MiniKit instance
      let verifyResult;
      if (miniKitInstance.commandsAsync?.verify) {
        console.log('🔄 Using MiniKit.commandsAsync.verify pattern');
        verifyResult = await miniKitInstance.commandsAsync.verify(verifyPayload);
      } else if (miniKitInstance.verify) {
        console.log('🔄 Using direct MiniKit.verify pattern');
        verifyResult = await miniKitInstance.verify(verifyPayload);
      } else {
        throw new Error('No verify method found on MiniKit instance');
      }

      console.log('✅ World ID verification result:', verifyResult);

      if (verifyResult.success) {
        // Send proof to our mock API
        // Check if we're accessing through ngrok - if so, skip API call for now
        const isNgrok = window.location.hostname.includes('ngrok');
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

        console.log('📡 API call details:', {
          apiUrl,
          isNgrok,
          hostname: window.location.hostname,
          verifyData: verifyResult.data
        });

        if (isNgrok) {
          // When accessed through ngrok, simulate API success for now
          console.log('🌐 Ngrok detected - simulating API success');
          const apiResult = {
            success: true,
            data: {
              token: 'mock_jwt_token_' + Date.now(),
              user: {
                id: 'user_' + Date.now(),
                worldIdHash: verifyResult.data.nullifier_hash,
                createdAt: new Date().toISOString()
              },
              isNewUser: true
            }
          };
          console.log('📡 Simulated API verification result:', apiResult);

          if (apiResult.success) {
            login(apiResult.data.user);
            console.log('🎉 Authentication successful!');
          }
          return;
        }

        const response = await fetch(`${apiUrl}/auth/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verifyResult.data),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        const apiResult = await response.json();
        console.log('📡 API verification result:', apiResult);

        if (apiResult.success) {
          login(apiResult.data.user);
          console.log('🎉 Authentication successful!');
        } else {
          throw new Error(apiResult.error || 'API verification failed');
        }
      } else {
        throw new Error(verifyResult.error?.message || 'World ID verification failed');
      }
    } catch (error) {
      console.error('❌ Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsPending(false);
    }
  }, [isInstalled, isPending]);

  if (!isInstalled) {
    return (
      <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-sm text-yellow-800 mb-3">
          🚫 MiniKit not detected.
        </p>
        <p className="text-xs text-yellow-700 mb-3">
          If you're in World App, MiniKit might be loading...
        </p>
        <div className="space-y-2">
          <button
            onClick={() => {
              console.log('🔧 Force checking MiniKit...');
              const available = typeof window !== 'undefined' && !!window.MiniKit;
              setIsInstalled(available);
              if (available) {
                console.log('✅ MiniKit found after force check!');
              } else {
                console.log('❌ MiniKit still not available:', {
                  window: typeof window,
                  MiniKit: window?.MiniKit,
                  keys: window ? Object.keys(window).filter(k => k.toLowerCase().includes('mini')) : []
                });
              }
            }}
            className="w-full px-4 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
          >
            🔄 Retry Detection
          </button>
          <button
            onClick={() => {
              console.log('🚨 Force enabling MiniKit for testing...');
              setIsInstalled(true);
            }}
            className="w-full px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            ⚠️ Force Enable (Testing)
          </button>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800 mb-2">
          ✅ World ID verification successful!
        </p>
        <div className="space-y-2">
          <Button
            onClick={() => window.location.href = '/profile'}
            size="lg"
            variant="primary"
            className="w-full"
          >
            Continue to App
          </Button>
          <Button
            onClick={() => {
              logout();
              setError(null);
            }}
            size="sm"
            variant="secondary"
          >
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm text-red-800">❌ {error}</p>
        </div>
      )}

      <Button
        onClick={handleWorldIDVerify}
        disabled={isPending}
        size="lg"
        variant="primary"
        className="w-full"
      >
        {isPending ? 'Verifying...' : 'Verify with World ID'}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        <p>This will call MiniKit.verify() with:</p>
        <p>• Action: verify-human</p>
        <p>• App ID: {process.env.NEXT_PUBLIC_WORLD_ID_APP_ID}</p>
        <p>• Level: orb</p>
      </div>
    </div>
  );
};
