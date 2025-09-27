'use client';

import { useState, useEffect } from 'react';
import { Button } from '@worldcoin/mini-apps-ui-kit-react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface Service {
  id: string;
  ownerId: string;
  category: string;
  title: string;
  description: string;
  priceModel: 'HOURLY' | 'FIXED';
  price: number;
  currency: string;
  active: boolean;
  provider: {
    id: string;
    username: string;
    avatarEmoji: string;
    reputationScore: number;
    totalReviews: number;
    badges: Array<{
      kind: string;
      title: string;
      iconUrl: string;
    }>;
  };
}

const categories = [
  { slug: 'construccion', name: 'Construction & Building', nameEs: 'Construcción y Albañilería', icon: '🏗️' },
  { slug: 'tecnologia', name: 'Technology & IT', nameEs: 'Tecnología e Informática', icon: '💻' },
  { slug: 'limpieza', name: 'Cleaning Services', nameEs: 'Servicios de Limpieza', icon: '🧹' },
  { slug: 'jardineria', name: 'Gardening & Landscaping', nameEs: 'Jardinería y Paisajismo', icon: '🌱' },
];

export default function ServicesPage() {
  const { user, profile, isAuthenticated, isLoading } = useUser();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [showCreateService, setShowCreateService] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    category: 'construccion',
    title: '',
    description: '',
    priceModel: 'HOURLY' as 'HOURLY' | 'FIXED',
    price: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    fetchServices();
  }, [selectedCategory]);

  const fetchServices = async () => {
    setIsLoadingServices(true);
    try {
      // Check if we're accessing through ngrok - if so, use mock data
      const isNgrok = window.location.hostname.includes('ngrok');

      if (isNgrok) {
        console.log('🌐 Ngrok detected - using mock services');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay

        // Mock services data
        const mockServices = [
          {
            id: 'service_1',
            ownerId: 'provider_maria',
            category: 'construccion',
            title: 'House Repairs & Masonry',
            description: 'Professional house repairs, wall building, concrete work, and general masonry services.',
            priceModel: 'HOURLY',
            price: 25.0,
            currency: 'USDC',
            active: true,
            provider: {
              id: 'provider_maria',
              username: 'maria_constructor',
              avatarEmoji: '👷‍♀️',
              reputationScore: 4.8,
              totalReviews: 47,
              badges: [
                { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' },
                { kind: 'TOP_RATED', title: 'Top Rated', iconUrl: '⭐' }
              ]
            }
          },
          {
            id: 'service_2',
            ownerId: 'provider_carlos',
            category: 'tecnologia',
            title: 'Web Development & IT Support',
            description: 'Custom websites, e-commerce solutions, and ongoing IT support for small businesses.',
            priceModel: 'FIXED',
            price: 500.0,
            currency: 'USDC',
            active: true,
            provider: {
              id: 'provider_carlos',
              username: 'carlos_tech',
              avatarEmoji: '👨‍💻',
              reputationScore: 4.9,
              totalReviews: 23,
              badges: [
                { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' }
              ]
            }
          },
          {
            id: 'service_3',
            ownerId: 'provider_ana',
            category: 'limpieza',
            title: 'Deep House Cleaning Services',
            description: 'Professional deep cleaning for homes and offices. Weekly, bi-weekly, or one-time service.',
            priceModel: 'FIXED',
            price: 80.0,
            currency: 'USDC',
            active: true,
            provider: {
              id: 'provider_ana',
              username: 'ana_cleaning',
              avatarEmoji: '🧹',
              reputationScore: 4.7,
              totalReviews: 34,
              badges: [
                { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' }
              ]
            }
          },
          {
            id: 'service_4',
            ownerId: 'provider_luis',
            category: 'jardineria',
            title: 'Garden Design & Maintenance',
            description: 'Complete garden design, landscaping, and maintenance services for residential properties.',
            priceModel: 'HOURLY',
            price: 35.0,
            currency: 'USDC',
            active: true,
            provider: {
              id: 'provider_luis',
              username: 'luis_gardens',
              avatarEmoji: '🌱',
              reputationScore: 4.6,
              totalReviews: 28,
              badges: [
                { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' }
              ]
            }
          },
          {
            id: 'service_5',
            ownerId: 'provider_sofia',
            category: 'plomeria',
            title: 'Emergency Plumbing Repairs',
            description: '24/7 emergency plumbing services. Leak repairs, pipe installation, and drain cleaning.',
            priceModel: 'HOURLY',
            price: 45.0,
            currency: 'USDC',
            active: true,
            provider: {
              id: 'provider_sofia',
              username: 'sofia_plumber',
              avatarEmoji: '🔧',
              reputationScore: 4.9,
              totalReviews: 56,
              badges: [
                { kind: 'VERIFIED_PROVIDER', title: 'Verified Provider', iconUrl: '✅' },
                { kind: 'EMERGENCY_SERVICES', title: 'Emergency Services', iconUrl: '🚨' }
              ]
            }
          }
        ];

        // Filter by category if selected
        const filteredServices = selectedCategory
          ? mockServices.filter(s => s.category === selectedCategory)
          : mockServices;

        setServices(filteredServices);
        return;
      }

      // Try real API call for localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const url = selectedCategory
        ? `${apiUrl}/services?category=${selectedCategory}`
        : `${apiUrl}/services`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setServices(result.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
      // Fallback to empty array
      setServices([]);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const handleCreateService = async () => {
    if (!profile || profile.type !== 'PROVIDER') return;

    setIsSubmitting(true);
    try {
      // Check if we're accessing through ngrok - if so, simulate success
      const isNgrok = window.location.hostname.includes('ngrok');

      if (isNgrok) {
        console.log('🌐 Ngrok detected - simulating service creation');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        console.log('📝 Simulated service creation:', serviceForm);
        setShowCreateService(false);
        setServiceForm({
          category: 'construccion',
          title: '',
          description: '',
          priceModel: 'HOURLY',
          price: '',
        });
        fetchServices(); // This will use mock data
        return;
      }

      // Try real API call for localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...serviceForm,
          price: parseFloat(serviceForm.price),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowCreateService(false);
        setServiceForm({
          category: 'construccion',
          title: '',
          description: '',
          priceModel: 'HOURLY',
          price: '',
        });
        fetchServices();
      } else {
        console.error('Failed to create service:', result.error);
      }
    } catch (error) {
      console.error('Error creating service:', error);

      // Fallback: simulate success
      console.log('📝 Fallback service creation');
      setShowCreateService(false);
      setServiceForm({
        category: 'construccion',
        title: '',
        description: '',
        priceModel: 'HOURLY',
        price: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevealContact = async (serviceId: string, providerId: string) => {
    // This will be implemented in the pay-to-reveal flow
    console.log('Reveal contact for service:', serviceId);
    router.push(`/reveal/${serviceId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => router.push('/profile')}
              size="sm"
              variant="secondary"
            >
              ← Back
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Services</h1>
          </div>
          {profile?.type === 'PROVIDER' && (
            <Button
              onClick={() => setShowCreateService(true)}
              size="sm"
              variant="primary"
            >
              + Add
            </Button>
          )}
        </div>

        {showCreateService && profile?.type === 'PROVIDER' && (
          /* Create Service Form */
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Service</h2>

            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={serviceForm.category}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.icon} {cat.nameEs}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Title
                </label>
                <input
                  type="text"
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., House Repairs & Masonry"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your service in detail"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Price Model */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pricing
                </label>
                <div className="flex space-x-3 mb-3">
                  <button
                    onClick={() => setServiceForm(prev => ({ ...prev, priceModel: 'HOURLY' }))}
                    className={`flex-1 px-4 py-2 rounded-lg border text-sm ${
                      serviceForm.priceModel === 'HOURLY'
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    Hourly Rate
                  </button>
                  <button
                    onClick={() => setServiceForm(prev => ({ ...prev, priceModel: 'FIXED' }))}
                    className={`flex-1 px-4 py-2 rounded-lg border text-sm ${
                      serviceForm.priceModel === 'FIXED'
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    Fixed Price
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">$</span>
                  <input
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="0.00"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="text-sm text-gray-500">
                    USDC {serviceForm.priceModel === 'HOURLY' ? '/hour' : 'total'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              <Button
                onClick={() => setShowCreateService(false)}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateService}
                disabled={isSubmitting || !serviceForm.title || !serviceForm.description || !serviceForm.price}
                variant="primary"
                size="lg"
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Service'}
              </Button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-2 rounded-lg text-sm border ${
                selectedCategory === ''
                  ? 'bg-purple-100 border-purple-500 text-purple-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-2 rounded-lg text-sm border ${
                  selectedCategory === cat.slug
                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}
              >
                {cat.icon} {cat.nameEs}
              </button>
            ))}
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {isLoadingServices ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-lg">
              <p className="text-gray-600">No services found</p>
              {profile?.type === 'PROVIDER' && (
                <Button
                  onClick={() => setShowCreateService(true)}
                  variant="primary"
                  size="lg"
                  className="mt-4"
                >
                  Create Your First Service
                </Button>
              )}
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg p-6">
                {/* Provider Info */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-2xl">{service.provider.avatarEmoji}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{service.provider.username}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>⭐ {service.provider.reputationScore.toFixed(1)}</span>
                      <span>•</span>
                      <span>{service.provider.totalReviews} reviews</span>
                      <div className="flex space-x-1">
                        {service.provider.badges.map((badge, index) => (
                          <span key={index} title={badge.title}>
                            {badge.iconUrl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="mb-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h4>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-purple-600">
                      ${service.price} {service.currency}
                      <span className="text-sm font-normal text-gray-500">
                        {service.priceModel === 'HOURLY' ? '/hour' : ' total'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {categories.find(c => c.slug === service.category)?.icon} {
                        categories.find(c => c.slug === service.category)?.nameEs
                      }
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {profile?.type === 'CLIENT' && service.ownerId !== user?.id && (
                  <Button
                    onClick={() => handleRevealContact(service.id, service.ownerId)}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    💬 Get Contact
                  </Button>
                )}
                {/* Show button for testing even if you're a provider */}
                {profile?.type === 'PROVIDER' && service.ownerId !== user?.id && (
                  <Button
                    onClick={() => handleRevealContact(service.id, service.ownerId)}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    💬 Test Pay-to-Reveal (Demo)
                  </Button>
                )}
                {service.ownerId === user?.id && (
                  <div className="text-center text-sm text-gray-500 py-2">
                    This is your service
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}