'use client';

import { useState, useEffect } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface Deal {
  id: string;
  serviceId: string;
  clientId: string;
  providerId: string;
  onChain: boolean;
  amount: number;
  currency: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  escrowTx?: string;
  createdAt: string;
}

export default function DealsPage() {
  const { user, profile, isAuthenticated, isLoading } = useUser();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoadingDeals, setIsLoadingDeals] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDeals();
    }
  }, [isAuthenticated]);

  const fetchDeals = async () => {
    setIsLoadingDeals(true);
    try {
      // Check if we're accessing through ngrok - if so, use mock data
      const isNgrok = window.location.hostname.includes('ngrok');

      if (isNgrok) {
        console.log('🌐 Ngrok detected - using mock deals');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

        // Mock deals data (empty for now)
        setDeals([]);
        return;
      }

      // Try real API call for localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/deals`);
      const result = await response.json();

      if (result.success) {
        setDeals(result.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch deals:', error);
      setDeals([]);
    } finally {
      setIsLoadingDeals(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'ACTIVE': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'COMPLETED': return 'text-green-600 bg-green-50 border-green-200';
      case 'CANCELLED': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'DISPUTED': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'ACTIVE': return '🔄';
      case 'COMPLETED': return '✅';
      case 'CANCELLED': return '❌';
      case 'DISPUTED': return '⚠️';
      default: return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-md mx-auto pt-4">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <Button
            onClick={() => router.push('/profile')}
            size="sm"
            variant="secondary"
          >
            ← Back
          </Button>
          <h1 className="text-xl font-bold text-gray-900">My Deals</h1>
        </div>

        {/* Deals List */}
        <div className="space-y-4">
          {isLoadingDeals ? (
            <div className="text-center py-8">
              <div className="rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading deals...</p>
            </div>
          ) : deals.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No deals yet</h3>
              <p className="text-gray-600 mb-6">
                Start by browsing services and connecting with providers
              </p>
              <Button
                onClick={() => router.push('/services')}
                variant="primary"
                size="lg"
              >
                Browse Services
              </Button>
            </div>
          ) : (
            deals.map((deal) => (
              <div key={deal.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStatusIcon(deal.status)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">Deal #{deal.id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(deal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount:</span>
                    <span className="font-semibold">${deal.amount} {deal.currency}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm">
                      {deal.onChain ? '🔗 On-chain Escrow' : '📝 Off-chain Agreement'}
                    </span>
                  </div>

                  {deal.escrowTx && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Escrow Tx:</span>
                      <span className="text-sm font-mono text-purple-600">
                        {deal.escrowTx.slice(0, 8)}...{deal.escrowTx.slice(-6)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {deal.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => console.log('Confirm deal:', deal.id)}
                      >
                        ✅ Confirm
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => console.log('Cancel deal:', deal.id)}
                      >
                        ❌ Cancel
                      </Button>
                    </div>
                  )}

                  {deal.status === 'ACTIVE' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => console.log('Mark complete:', deal.id)}
                    >
                      ✅ Mark as Complete
                    </Button>
                  )}

                  {deal.status === 'COMPLETED' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => router.push(`/reviews/create?dealId=${deal.id}`)}
                    >
                      ⭐ Leave Review
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-2">Deal Types:</h3>
          <div className="space-y-1 text-sm text-purple-700">
            <div className="flex items-center space-x-2">
              <span>🔗</span>
              <span>On-chain: Funds held in smart contract escrow</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>📝</span>
              <span>Off-chain: Agreement hash stored for disputes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}