'use client';

import { useState, useEffect } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface Review {
  id: string;
  dealId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ReviewsPage() {
  const { user, profile, isAuthenticated, isLoading } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'given'>('received');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && profile) {
      fetchReviews();
    }
  }, [isAuthenticated, profile, activeTab]);

  const fetchReviews = async () => {
    if (!profile) return;

    setIsLoadingReviews(true);
    try {
      // Check if we're accessing through ngrok - if so, use mock data
      const isNgrok = window.location.hostname.includes('ngrok');

      if (isNgrok) {
        console.log('🌐 Ngrok detected - using mock reviews');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

        // Mock reviews data (empty for now)
        setReviews([]);
        return;
      }

      // Try real API call for localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/reviews/${profile.id}`);
      const result = await response.json();

      if (result.success) {
        // Filter reviews based on active tab
        const filteredReviews = result.data.reviews.filter((review: Review) => {
          if (activeTab === 'received') {
            return review.toUserId === profile.userId;
          } else {
            return review.fromUserId === profile.userId;
          }
        });
        setReviews(filteredReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ));
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

  if (!isAuthenticated || !profile) {
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
          <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
        </div>

        {/* Reputation Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {profile.reputationScore.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(profile.reputationScore))}
            </div>
            <p className="text-gray-600">
              Based on {profile.totalReviews} review{profile.totalReviews !== 1 ? 's' : ''}
            </p>

            {/* Badges */}
            {profile.badges.length > 0 && (
              <div className="mt-4 flex justify-center space-x-2">
                {profile.badges.map((badge, index) => (
                  <div
                    key={index}
                    title={badge.title}
                    className="flex items-center space-x-1 bg-purple-50 border border-purple-200 rounded-full px-3 py-1"
                  >
                    <span>{badge.iconUrl}</span>
                    <span className="text-sm text-purple-700 font-medium">{badge.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab('received')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-l-lg ${
                activeTab === 'received'
                  ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📥 Received
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`flex-1 px-4 py-3 text-sm font-medium rounded-r-lg ${
                activeTab === 'given'
                  ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📤 Given
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {isLoadingReviews ? (
            <div className="text-center py-8">
              <div className="rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-lg">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No {activeTab} reviews yet
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'received'
                  ? 'Complete some deals to receive reviews from clients and providers'
                  : 'Complete some deals to leave reviews for others'
                }
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
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{review.text}</p>

                <div className="text-sm text-gray-500">
                  Deal #{review.dealId.slice(0, 8)}
                  {activeTab === 'received' ? ' • From client' : ' • To provider'}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <h3 className="text-sm font-semibold text-purple-800 mb-2">Building Trust:</h3>
          <div className="space-y-1 text-sm text-purple-700">
            <div className="flex items-center space-x-2">
              <span>⭐</span>
              <span>Complete deals to earn reviews and build reputation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🏆</span>
              <span>High ratings unlock special badges and benefits</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔗</span>
              <span>Reviews are linked to World ID for authenticity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}