'use client';

import { AuthButton } from '@/components/AuthButton';
import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  Layout,
  Section,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  StatusIndicator,
  Badge,
  UserIcon,
  ToolsIcon,
  LockIcon,
  CoinIcon,
  StarIcon,
  ShieldIcon,
} from '@/components/ui';

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
      <Layout variant="centered" showLogo={false}>
        <Card variant="temple" padding="xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-jade-300 border-t-jade-700 mx-auto mb-4"></div>
            <p className="text-lg font-pixel text-jade-700 uppercase tracking-wide">
              Cargando...
            </p>
          </div>
        </Card>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to profile
  }

  return (
    <Layout
      title="🏛️ XAMBATLÁN 🏛️"
      subtitle="El Gran Mercado Digital de Tenochtitlán"
      description="Donde la confianza ancestral encuentra la tecnología moderna"
      variant="temple"
      className="bg-temple-gradient min-h-screen"
    >
      {/* Sacred Temple Status - Digital Tenochtitlán */}
      <Section className="mb-8">
        <Card variant="tenochtitlan" padding="2xl" hoverable className="border-4 border-obsidian-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <ShieldIcon size="4xl" variant="aztec" className="text-jade-700" />
            </div>
            <CardTitle className="text-4xl font-aztec text-obsidian-900 uppercase tracking-widest mb-4">
              🏮 TEMPLO SAGRADO 🏮
            </CardTitle>
            <CardDescription className="text-xl text-obsidian-700 font-bold">
              La Gran Plaza Digital donde artesanos y clientes se encuentran bajo la protección divina
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Temple Guardian Status */}
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center justify-between p-4 bg-jade-100 border-4 border-obsidian-900 shadow-pixel-authentic">
                <div className="flex items-center gap-4">
                  <StatusIndicator status="verified" size="lg" />
                  <span className="text-lg font-bold text-obsidian-900 font-pixel uppercase text-high-contrast">
                    🛡️ Guardianes Activos
                  </span>
                </div>
                <Badge variant="success" size="lg" className="font-pixel">PROTEGIDO</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-quetzal-100 border-4 border-obsidian-900 shadow-pixel-authentic">
                <div className="flex items-center gap-4">
                  <StatusIndicator status="online" size="lg" />
                  <span className="text-lg font-bold text-obsidian-900 font-pixel uppercase text-high-contrast">
                    🌟 Mercado Abierto
                  </span>
                </div>
                <Badge variant="info" size="lg" className="font-pixel">COMERCIANDO</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gold-100 border-4 border-obsidian-900 shadow-pixel-authentic">
                <div className="flex items-center gap-4">
                  <StatusIndicator status="verified" size="lg" />
                  <span className="text-lg font-bold text-obsidian-900 font-pixel uppercase text-high-contrast">
                    🏺 World ID Bendecido
                  </span>
                </div>
                <Badge variant="warning" size="lg" className="font-pixel">SAGRADO</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Sacred Authentication Altar */}
      <Section>
        <Card variant="obsidian" padding="2xl" hoverable className="border-4 border-obsidian-900 bg-gradient-to-b from-obsidian-100 to-jade-50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <UserIcon size="3xl" variant="aztec" className="text-jade-700" />
            </div>
            <CardTitle className="text-3xl font-aztec text-obsidian-900 uppercase tracking-widest mb-4">
              🌅 RITUAL DE ENTRADA 🌅
            </CardTitle>
            <CardDescription className="text-lg text-obsidian-700 font-bold mb-6">
              Presenta tu World ID ante los guardianes del templo para acceder al mercado sagrado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="w-full">
                <AuthButton />
              </div>

              <div className="text-center pt-6 border-t-4 border-obsidian-900 shadow-pixel-authentic">
                <p className="text-base text-obsidian-900 font-bold text-high-contrast">
                  🔮 Una vez verificado, tendrás acceso a todos los poderes del gran mercado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Temple Features - Sacred Powers */}
      <Section>
        <Card variant="temple" padding="xl" hoverable className="border-4 border-obsidian-900">
          <CardHeader>
            <CardTitle className="text-2xl font-aztec text-obsidian-900 uppercase tracking-widest text-center mb-6">
              🏛️ PODERES DEL TEMPLO 🏛️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Artisan Power */}
              <div className="p-6 bg-gradient-to-br from-jade-50 to-jade-100 border-4 border-obsidian-900 shadow-pixel-authentic pixel-art">
                <div className="text-center mb-4">
                  <ToolsIcon size="2xl" variant="aztec" className="text-jade-700 mx-auto mb-3 pixel-art" />
                  <h3 className="text-xl font-pixel font-bold text-obsidian-900 uppercase text-high-contrast">
                    🔨 ARTESANOS MAESTROS
                  </h3>
                </div>
                <p className="text-base text-obsidian-900 text-center font-semibold text-high-contrast">
                  Ofrece tus habilidades sagradas al pueblo con precios justos y transparentes
                </p>
              </div>

              {/* Payment Power */}
              <div className="p-6 bg-gradient-to-br from-gold-50 to-gold-100 border-4 border-obsidian-900 shadow-pixel-authentic pixel-art">
                <div className="text-center mb-4">
                  <CoinIcon size="2xl" variant="aztec" className="text-gold-600 mx-auto mb-3 pixel-art" />
                  <h3 className="text-xl font-pixel font-bold text-obsidian-900 uppercase text-high-contrast">
                    💰 PAGOS SAGRADOS
                  </h3>
                </div>
                <p className="text-base text-obsidian-900 text-center font-semibold text-high-contrast">
                  Intercambia valor con la bendición de los dioses usando monedas digitales
                </p>
              </div>

              {/* Trust Power */}
              <div className="p-6 bg-gradient-to-br from-quetzal-50 to-quetzal-100 border-4 border-obsidian-900 shadow-pixel-authentic pixel-art">
                <div className="text-center mb-4">
                  <StarIcon size="2xl" variant="aztec" className="text-quetzal-600 mx-auto mb-3 pixel-art" filled />
                  <h3 className="text-xl font-pixel font-bold text-obsidian-900 uppercase text-high-contrast">
                    ⭐ REPUTACIÓN ETERNA
                  </h3>
                </div>
                <p className="text-base text-obsidian-900 text-center font-semibold text-high-contrast">
                  Construye tu legado con reseñas inmutables grabadas en la piedra digital
                </p>
              </div>

              {/* Protection Power */}
              <div className="p-6 bg-gradient-to-br from-coral-50 to-coral-100 border-4 border-obsidian-900 shadow-pixel-authentic pixel-art">
                <div className="text-center mb-4">
                  <LockIcon size="2xl" variant="aztec" className="text-coral-600 mx-auto mb-3 pixel-art" />
                  <h3 className="text-xl font-pixel font-bold text-obsidian-900 uppercase text-high-contrast">
                    🛡️ PROTECCIÓN DIVINA
                  </h3>
                </div>
                <p className="text-base text-obsidian-900 text-center font-semibold text-high-contrast">
                  Tus secretos permanecen seguros bajo el amparo de la criptografía ancestral
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </Layout>
  );
}
