'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import {
  Layout,
  Section,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  Grid,
  ToolsIcon,
  ArtisanIcon,
  UserIcon,
  StarIcon,
  CoinIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  BadgeIcon,
} from '@/components/ui';

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
  { slug: 'construccion', name: 'Construction & Building', nameEs: 'Construcción y Albañilería', icon: <ArtisanIcon size="md" />, emoji: '🏗️' },
  { slug: 'tecnologia', name: 'Technology & IT', nameEs: 'Tecnología e Informática', icon: <ToolsIcon size="md" />, emoji: '💻' },
  { slug: 'limpieza', name: 'Cleaning Services', nameEs: 'Servicios de Limpieza', icon: <ToolsIcon size="md" />, emoji: '🧹' },
  { slug: 'jardineria', name: 'Gardening & Landscaping', nameEs: 'Jardinería y Paisajismo', icon: <ToolsIcon size="md" />, emoji: '🌱' },
  { slug: 'plomeria', name: 'Plumbing', nameEs: 'Plomería', icon: <ToolsIcon size="md" />, emoji: '🔧' },
  { slug: 'electricidad', name: 'Electrical', nameEs: 'Electricidad', icon: <ToolsIcon size="md" />, emoji: '⚡' },
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
            priceModel: 'HOURLY' as 'HOURLY' | 'FIXED',
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
            priceModel: 'FIXED' as 'HOURLY' | 'FIXED',
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
            priceModel: 'FIXED' as 'HOURLY' | 'FIXED',
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
            priceModel: 'HOURLY' as 'HOURLY' | 'FIXED',
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
            priceModel: 'HOURLY' as 'HOURLY' | 'FIXED',
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
      <Layout variant="centered" showLogo={false}>
        <Card variant="temple" padding="xl">
          <div className="text-center">
            <div className="rounded-full h-12 w-12 border-4 border-jade-300 border-t-jade-700 mx-auto mb-4"></div>
            <p className="text-lg font-pixel text-jade-700 uppercase tracking-wide">
              Cargando Servicios...
            </p>
          </div>
        </Card>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout
      title={profile?.type === 'PROVIDER' ? 'Mis Servicios' : 'Mercado de Servicios'}
      subtitle={profile?.type === 'PROVIDER' ? 'Gestiona tus servicios y gana reputación' : 'Encuentra artesanos y profesionales verificados'}
      variant="marketplace"
    >
      {/* Header Navigation */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={() => router.push('/profile')}
          size="md"
          variant="ghost"
          leftIcon={<ArrowLeftIcon size="sm" />}
        >
          Volver
        </Button>
        {profile?.type === 'PROVIDER' && (
          <Button
            onClick={() => setShowCreateService(true)}
            size="md"
            variant="primary"
            leftIcon={<ToolsIcon size="sm" />}
          >
            Crear Servicio
          </Button>
        )}
      </div>

      {showCreateService && profile?.type === 'PROVIDER' && (
        <Section>
          <Card variant="temple" padding="lg">
            <CardHeader withBorder>
              <CardTitle aztec>
                <ToolsIcon size="lg" className="text-jade-700" />
                Crear Nuevo Servicio
              </CardTitle>
              <CardDescription>
                Agrega un servicio al mercado y comienza a construir tu reputación
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Category */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-900 text-high-contrast mb-3 uppercase tracking-wide">
                    Categoría
                  </label>
                  <select
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 text-base text-obsidian-900 bg-white border-4 border-obsidian-900 focus:ring-2 focus:ring-jade-500 focus:border-jade-600 focus:bg-jade-50 transition-colors touch-target text-high-contrast pixel-art"
                  >
                    {categories.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.emoji} {cat.nameEs}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-900 text-high-contrast mb-3 uppercase tracking-wide">
                    Título del Servicio
                  </label>
                  <input
                    type="text"
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="ej. Reparaciones de Casa y Albañilería"
                    className="w-full px-4 py-3 text-base text-obsidian-900 bg-white border-4 border-obsidian-900 focus:ring-2 focus:ring-jade-500 focus:border-jade-600 focus:bg-jade-50 transition-colors touch-target placeholder:text-stone-500 text-high-contrast pixel-art"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-900 text-high-contrast mb-3 uppercase tracking-wide">
                    Descripción
                  </label>
                  <textarea
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe tu servicio en detalle, experiencia y qué incluye"
                    rows={4}
                    className="w-full px-4 py-3 text-base text-obsidian-900 bg-white border-4 border-obsidian-900 focus:ring-2 focus:ring-jade-500 focus:border-jade-600 focus:bg-jade-50 transition-colors resize-none placeholder:text-stone-500 text-high-contrast pixel-art"
                  />
                </div>

                {/* Price Model */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-900 text-high-contrast mb-3 uppercase tracking-wide">
                    <CoinIcon size="sm" className="inline mr-2" />
                    Modelo de Precio
                  </label>
                  <Grid cols={2} gap="sm" className="mb-4">
                    <button
                      onClick={() => setServiceForm(prev => ({ ...prev, priceModel: 'HOURLY' }))}
                      className={`flex flex-col items-center gap-2 p-4 border-4 transition-all touch-target shadow-pixel-authentic pixel-art ${
                        serviceForm.priceModel === 'HOURLY'
                          ? 'bg-jade-100 border-obsidian-900 text-obsidian-900 text-high-contrast'
                          : 'bg-jade-50 border-obsidian-900 text-obsidian-900 hover:bg-jade-100'
                      }`}
                    >
                      <CoinIcon size="lg" />
                      <span className="font-pixel text-sm uppercase">Por Hora</span>
                    </button>
                    <button
                      onClick={() => setServiceForm(prev => ({ ...prev, priceModel: 'FIXED' }))}
                      className={`flex flex-col items-center gap-2 p-4 border-4 transition-all touch-target shadow-pixel-authentic pixel-art ${
                        serviceForm.priceModel === 'FIXED'
                          ? 'bg-teal-100 border-obsidian-900 text-obsidian-900 text-high-contrast'
                          : 'bg-teal-50 border-obsidian-900 text-obsidian-900 hover:bg-teal-100'
                      }`}
                    >
                      <CoinIcon size="lg" />
                      <span className="font-pixel text-sm uppercase">Precio Fijo</span>
                    </button>
                  </Grid>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-pixel font-bold text-obsidian-900 text-high-contrast">$</span>
                    <input
                      type="number"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      className="flex-1 px-4 py-3 text-lg font-mono text-obsidian-900 bg-white border-4 border-obsidian-900 focus:ring-2 focus:ring-jade-500 focus:border-jade-600 focus:bg-jade-50 transition-colors touch-target placeholder:text-stone-500 text-high-contrast pixel-art"
                    />
                    <Badge variant="gold" size="md">
                      USDC {serviceForm.priceModel === 'HOURLY' ? '/hora' : 'total'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex gap-3 w-full">
                <Button
                  onClick={() => setShowCreateService(false)}
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateService}
                  disabled={isSubmitting || !serviceForm.title || !serviceForm.description || !serviceForm.price}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? 'Creando...' : 'Crear Servicio'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Section>
      )}

      {/* Category Filter */}
      <Section title="Filtrar por Categoría">
        <Card variant="default" padding="md">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('')}
              className={`flex items-center gap-2 px-4 py-3 border-4 transition-all font-medium touch-target shadow-pixel-authentic pixel-art ${
                selectedCategory === ''
                  ? 'bg-jade-100 border-obsidian-900 text-obsidian-900 text-high-contrast'
                  : 'bg-jade-50 border-obsidian-900 text-obsidian-900 hover:bg-jade-100'
              }`}
            >
              <ToolsIcon size="sm" />
              <span className="font-pixel text-sm uppercase">Todos</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`flex items-center gap-2 px-4 py-3 border-4 transition-all font-medium touch-target shadow-pixel-authentic pixel-art ${
                  selectedCategory === cat.slug
                    ? 'bg-teal-100 border-obsidian-900 text-obsidian-900 text-high-contrast'
                    : 'bg-teal-50 border-obsidian-900 text-obsidian-900 hover:bg-teal-100'
                }`}
              >
                {cat.icon}
                <span className="font-pixel text-sm uppercase">{cat.nameEs}</span>
              </button>
            ))}
          </div>
        </Card>
      </Section>

      {/* Services List */}
      <Section title={`${selectedCategory ? categories.find(c => c.slug === selectedCategory)?.nameEs : 'Todos los Servicios'}`}>
        <div className="space-y-4">
          {isLoadingServices ? (
            <Card variant="temple" padding="xl">
              <div className="text-center">
                <div className="rounded-full h-8 w-8 border-4 border-jade-300 border-t-jade-700 mx-auto mb-4"></div>
                <p className="text-base font-pixel text-jade-700 uppercase tracking-wide">
                  Cargando servicios...
                </p>
              </div>
            </Card>
          ) : services.length === 0 ? (
            <Card variant="marketplace" padding="xl">
              <div className="text-center">
                <ToolsIcon size="2xl" className="text-stone-400 mx-auto mb-4" />
                <h3 className="text-lg font-pixel font-semibold text-obsidian-900 text-high-contrast uppercase tracking-wide mb-2">
                  No hay servicios
                </h3>
                <p className="text-base text-stone-600 mb-6">
                  {selectedCategory
                    ? `No encontramos servicios en la categoría ${categories.find(c => c.slug === selectedCategory)?.nameEs}`
                    : 'Aún no hay servicios publicados'
                  }
                </p>
                {profile?.type === 'PROVIDER' && (
                  <Button
                    onClick={() => setShowCreateService(true)}
                    variant="primary"
                    size="lg"
                    leftIcon={<ToolsIcon size="md" />}
                  >
                    Crear tu Primer Servicio
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            services.map((service) => (
              <Card key={service.id} variant="marketplace" padding="lg" hoverable>
                {/* Provider Info */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl">{service.provider.avatarEmoji}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-pixel font-semibold text-obsidian-900 text-high-contrast uppercase tracking-wide mb-1">
                      {service.provider.username}
                    </h3>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              size="xs"
                              filled={i < Math.floor(service.provider.reputationScore)}
                              className="text-gold-500"
                            />
                          ))}
                        </div>
                        <span className="font-medium text-obsidian-900 text-high-contrast">
                          {service.provider.reputationScore.toFixed(1)}
                        </span>
                      </div>
                      <span className="text-stone-500">•</span>
                      <span className="text-obsidian-900 text-high-contrast">{service.provider.totalReviews} reseñas</span>
                      <div className="flex gap-1">
                        {service.provider.badges.map((badge, index) => (
                          <span key={index} title={badge.title} className="text-lg">
                            {badge.iconUrl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="mb-6">
                  <h4 className="text-xl font-pixel font-bold text-obsidian-900 uppercase tracking-wide mb-3">
                    {service.title}
                  </h4>
                  <p className="text-base text-obsidian-900 text-high-contrast leading-relaxed mb-4">{service.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-pixel font-bold text-jade-700">
                        ${service.price}
                      </span>
                      <Badge variant="gold" size="md">
                        {service.currency} {service.priceModel === 'HOURLY' ? '/hora' : 'total'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {categories.find(c => c.slug === service.category)?.icon}
                      <span className="font-medium text-obsidian-900 text-high-contrast">
                        {categories.find(c => c.slug === service.category)?.nameEs}
                      </span>
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
                    leftIcon={<EyeIcon size="md" />}
                    rightIcon={<ArrowRightIcon size="sm" />}
                  >
                    Revelar Contacto
                  </Button>
                )}
                {/* Show button for testing even if you're a provider */}
                {profile?.type === 'PROVIDER' && service.ownerId !== user?.id && (
                  <Button
                    onClick={() => handleRevealContact(service.id, service.ownerId)}
                    variant="outline"
                    size="lg"
                    className="w-full"
                    leftIcon={<EyeIcon size="md" />}
                    rightIcon={<ArrowRightIcon size="sm" />}
                  >
                    Probar Pago-por-Revelar (Demo)
                  </Button>
                )}
                {service.ownerId === user?.id && (
                  <div className="text-center py-4">
                    <Badge variant="success" size="md">
                      <BadgeIcon size="xs" className="mr-1" />
                      Tu Servicio
                    </Badge>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </Section>
    </Layout>
  );
}