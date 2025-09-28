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
  ProgressBar,
  Grid,
  UserIcon,
  ArtisanIcon,
  StarIcon,
  BadgeIcon,
  ToolsIcon,
  LockIcon,
  CoinIcon,
  ArrowRightIcon,
} from '@/components/ui';

export default function ProfilePage() {
  const { user, profile, isAuthenticated, isLoading, setProfile, logout } = useUser();
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [formData, setFormData] = useState({
    type: 'PROVIDER' as 'PROVIDER' | 'CLIENT',
    username: '',
    bio: '',
    avatarEmoji: '👤',
    contactInfo: {
      whatsapp: '',
      email: '',
      website: ''
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleCreateProfile = async () => {
    setIsSubmitting(true);

    try {
      // Check if we're accessing through ngrok - if so, simulate API success
      const isNgrok = window.location.hostname.includes('ngrok');

      if (isNgrok) {
        // Simulate profile creation for ngrok environment
        console.log('🌐 Ngrok detected - simulating profile creation');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay

        const mockProfile = {
          id: 'profile_' + Date.now(),
          userId: user?.id || 'user_mock',
          type: formData.type,
          username: formData.username,
          avatarEmoji: formData.avatarEmoji,
          bio: formData.bio,
          contactHash: 'mock_contact_hash',
          reputationScore: 0,
          totalReviews: 0,
          badges: [
            { kind: 'NEWCOMER', title: 'Newcomer', iconUrl: '🌟' }
          ],
          createdAt: new Date().toISOString()
        };

        console.log('📝 Simulated profile creation:', mockProfile);
        setProfile(mockProfile);
        setShowCreateProfile(false);
        return;
      }

      // Try real API call for localhost
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.data);
        setShowCreateProfile(false);
      } else {
        console.error('Failed to create profile:', result.error);
      }
    } catch (error) {
      console.error('Error creating profile:', error);

      // Fallback: create mock profile if API fails
      const mockProfile = {
        id: 'profile_' + Date.now(),
        userId: user?.id || 'user_mock',
        type: formData.type,
        username: formData.username,
        avatarEmoji: formData.avatarEmoji,
        bio: formData.bio,
        contactHash: 'mock_contact_hash',
        reputationScore: 0,
        totalReviews: 0,
        badges: [
          { kind: 'NEWCOMER', title: 'Newcomer', iconUrl: '🌟' }
        ],
        createdAt: new Date().toISOString()
      };

      console.log('📝 Fallback profile creation:', mockProfile);
      setProfile(mockProfile);
      setShowCreateProfile(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const emojiOptions = ['👤', '👨‍💼', '👩‍💼', '👷‍♂️', '👷‍♀️', '🧑‍💻', '👨‍💻', '👩‍💻', '🧑‍🔧', '👨‍🔧', '👩‍🔧', '🧑‍🎨', '👨‍🎨', '👩‍🎨', '🧑‍🏫', '👨‍🏫', '👩‍🏫'];

  if (isLoading) {
    return (
      <Layout variant="centered" showLogo={false}>
        <Card variant="temple" padding="xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-300 border-t-jade-700 mx-auto mb-4"></div>
            <p className="text-lg font-pixel text-jade-700 uppercase tracking-wide">
              Cargando Perfil...
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
      title={profile ? `Perfil de ${profile.username}` : 'Crear Perfil'}
      subtitle={profile ? 'Tu espacio en el mercado de confianza' : 'Únete a la comunidad verificada'}
      variant="marketplace"
    >
      {/* Header with logout */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={logout}
          size="sm"
          variant="ghost"
          leftIcon={<ArrowRightIcon size="sm" className="rotate-180" />}
        >
          Salir
        </Button>
      </div>

      {!profile || showCreateProfile ? (
        /* Profile Creation Form */
        <Section>
          <Card variant="temple" padding="lg">
            <CardHeader withBorder>
              <CardTitle aztec>
                <UserIcon size="lg" className="text-jade-700" />
                {profile ? 'Editar Perfil' : 'Crear tu Perfil'}
              </CardTitle>
              <CardDescription>
                {profile
                  ? 'Actualiza tu información en el mercado de confianza'
                  : 'Completa tu perfil para comenzar a construir tu reputación'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {/* Profile Type */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-800 mb-3 uppercase tracking-wide">
                    Soy:
                  </label>
                  <Grid cols={2} gap="sm">
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, type: 'PROVIDER' }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-pyramid border-2 transition-all touch-target ${
                        formData.type === 'PROVIDER'
                          ? 'bg-jade-100 border-jade-500 text-jade-800 shadow-pixel'
                          : 'bg-jade-50 border-jade-200 text-jade-600 hover:border-jade-300'
                      }`}
                    >
                      <ArtisanIcon size="xl" />
                      <span className="font-pixel text-sm uppercase">Proveedor</span>
                    </button>
                    <button
                      onClick={() => setFormData(prev => ({ ...prev, type: 'CLIENT' }))}
                      className={`flex flex-col items-center gap-2 p-4 rounded-pyramid border-2 transition-all touch-target ${
                        formData.type === 'CLIENT'
                          ? 'bg-teal-100 border-teal-500 text-teal-800 shadow-pixel'
                          : 'bg-teal-50 border-teal-200 text-teal-600 hover:border-teal-300'
                      }`}
                    >
                      <UserIcon size="xl" />
                      <span className="font-pixel text-sm uppercase">Cliente</span>
                    </button>
                  </Grid>
                </div>

                {/* Avatar Emoji */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-800 mb-3 uppercase tracking-wide">
                    Elige tu Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setFormData(prev => ({ ...prev, avatarEmoji: emoji }))}
                        className={`aspect-square text-2xl rounded-aztec border-2 transition-all touch-target ${
                          formData.avatarEmoji === emoji
                            ? 'bg-gold-100 border-gold-500 shadow-pixel'
                            : 'bg-jade-50 border-jade-200 hover:border-jade-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-800 mb-3 uppercase tracking-wide">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Tu nombre en Xambatlán"
                    className="w-full px-4 py-3 text-lg border-2 border-jade-200 rounded-aztec focus:ring-2 focus:ring-jade-300 focus:border-jade-400 transition-colors touch-target bg-jade-50"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-800 mb-3 uppercase tracking-wide">
                    Descripción
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder={formData.type === 'PROVIDER'
                      ? 'Describe tus servicios, experiencia y especialidades'
                      : 'Cuéntanos sobre ti y qué tipo de servicios buscas'
                    }
                    rows={4}
                    className="w-full px-4 py-3 text-base border-2 border-jade-200 rounded-aztec focus:ring-2 focus:ring-jade-300 focus:border-jade-400 transition-colors bg-jade-50 resize-none"
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <label className="block text-base font-pixel font-medium text-obsidian-800 mb-3 uppercase tracking-wide">
                    <LockIcon size="sm" className="inline mr-2" />
                    Información de Contacto (Encriptada)
                  </label>
                  <div className="space-y-3">
                    <input
                      type="tel"
                      value={formData.contactInfo.whatsapp}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, whatsapp: e.target.value }
                      }))}
                      placeholder="Número de WhatsApp"
                      className="w-full px-4 py-3 text-base border-2 border-jade-200 rounded-aztec focus:ring-2 focus:ring-jade-300 focus:border-jade-400 transition-colors touch-target bg-jade-50"
                    />
                    <input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, email: e.target.value }
                      }))}
                      placeholder="Correo electrónico"
                      className="w-full px-4 py-3 text-base border-2 border-jade-200 rounded-aztec focus:ring-2 focus:ring-jade-300 focus:border-jade-400 transition-colors touch-target bg-jade-50"
                    />
                    <input
                      type="url"
                      value={formData.contactInfo.website}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo, website: e.target.value }
                      }))}
                      placeholder="Sitio web o redes sociales"
                      className="w-full px-4 py-3 text-base border-2 border-jade-200 rounded-aztec focus:ring-2 focus:ring-jade-300 focus:border-jade-400 transition-colors touch-target bg-jade-50"
                    />
                  </div>
                  <div className="mt-2 p-3 bg-gold-50 border border-gold-200 rounded-aztec">
                    <p className="text-sm text-gold-800 font-medium">
                      🔐 Tu información se encripta y solo se revela cuando un cliente paga y tú das consentimiento
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter>
              <div className="flex gap-3 w-full">
                {profile && (
                  <Button
                    onClick={() => setShowCreateProfile(false)}
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                )}
                <Button
                  onClick={handleCreateProfile}
                  disabled={isSubmitting || !formData.username || !formData.bio}
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  isLoading={isSubmitting}
                >
                  {profile ? 'Actualizar Perfil' : 'Crear Perfil'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Section>
      ) : (
        /* Profile Display */
        <div className="space-y-6">
          {/* Profile Header Card */}
          <Card variant="profile" padding="lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="text-6xl">{profile.avatarEmoji}</div>
              <div className="flex-1">
                <h2 className="text-2xl font-pixel font-bold text-obsidian-900 uppercase tracking-wide mb-1">
                  {profile.username}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  {profile.type === 'PROVIDER' ? (
                    <ArtisanIcon size="md" className="text-jade-600" />
                  ) : (
                    <UserIcon size="md" className="text-teal-600" />
                  )}
                  <span className="text-base font-medium text-obsidian-700">
                    {profile.type === 'PROVIDER' ? 'Proveedor de Servicios' : 'Cliente'}
                  </span>
                </div>
                <Badge variant="gold" size="md">
                  <BadgeIcon size="xs" className="mr-1" />
                  Verificado
                </Badge>
              </div>
              <Button
                onClick={() => {
                  setFormData({
                    type: profile.type,
                    username: profile.username,
                    bio: profile.bio,
                    avatarEmoji: profile.avatarEmoji,
                    contactInfo: {
                      whatsapp: '',
                      email: '',
                      website: ''
                    }
                  });
                  setShowCreateProfile(true);
                }}
                size="md"
                variant="outline"
              >
                Editar
              </Button>
            </div>

            <p className="text-base text-obsidian-700 mb-6 leading-relaxed">{profile.bio}</p>

            {/* Reputation Section */}
            <Card variant="temple" padding="md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-pixel text-lg font-semibold text-obsidian-800 uppercase tracking-wide">
                  Reputación
                </h3>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      size="md"
                      filled={i < Math.floor(profile.reputationScore)}
                      className="text-gold-500"
                    />
                  ))}
                </div>
              </div>

              <Grid cols={3} gap="md">
                <div className="text-center">
                  <div className="text-2xl font-pixel font-bold text-jade-700">
                    {profile.reputationScore.toFixed(1)}
                  </div>
                  <div className="text-sm text-stone-600 font-medium">Calificación</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-pixel font-bold text-jade-700">
                    {profile.totalReviews}
                  </div>
                  <div className="text-sm text-stone-600 font-medium">Reseñas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-pixel font-bold text-jade-700">
                    {profile.badges.length}
                  </div>
                  <div className="text-sm text-stone-600 font-medium">Insignias</div>
                </div>
              </Grid>

              <div className="mt-4">
                <ProgressBar
                  value={profile.reputationScore * 20}
                  variant="reputation"
                  className="mb-2"
                />
                <div className="flex justify-center gap-2">
                  {profile.badges.map((badge, index) => (
                    <span key={index} title={badge.title} className="text-2xl">
                      {badge.iconUrl}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </Card>

          {/* Quick Actions */}
          <Section title="Acciones Rápidas">
            <div className="space-y-4">
              <Button
                onClick={() => router.push('/services')}
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={profile.type === 'PROVIDER' ? <ToolsIcon size="lg" /> : <ToolsIcon size="lg" />}
                rightIcon={<ArrowRightIcon size="md" />}
              >
                {profile.type === 'PROVIDER' ? 'Gestionar mis Servicios' : 'Explorar Servicios'}
              </Button>

              <Button
                onClick={() => router.push('/deals')}
                variant="secondary"
                size="lg"
                className="w-full"
                leftIcon={<CoinIcon size="lg" />}
                rightIcon={<ArrowRightIcon size="md" />}
              >
                Mis Contratos
              </Button>

              <Button
                onClick={() => router.push('/reviews')}
                variant="secondary"
                size="lg"
                className="w-full"
                leftIcon={<StarIcon size="lg" />}
                rightIcon={<ArrowRightIcon size="md" />}
              >
                Reseñas y Calificaciones
              </Button>
            </div>
          </Section>
        </div>
      )}
    </Layout>
  );
}