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
      title="Mercado de Confianza"
      subtitle="La red de artesanos y profesionales verificados"
      variant="marketplace"
    >
      {/* Status Card */}
      <Section>
        <Card variant="temple" padding="lg">
          <CardHeader>
            <CardTitle aztec>
              <ShieldIcon size="lg" className="text-jade-700" />
              Sistema Activo
            </CardTitle>
            <CardDescription>
              Plataforma verificada con World ID y tecnología blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIndicator status="verified" />
                  <span className="text-base font-medium text-obsidian-800">
                    API Conectada
                  </span>
                </div>
                <Badge variant="success">Activo</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIndicator status="online" />
                  <span className="text-base font-medium text-obsidian-800">
                    Mini App Lista
                  </span>
                </div>
                <Badge variant="success">Funcionando</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <StatusIndicator status="verified" />
                  <span className="text-base font-medium text-obsidian-800">
                    World ID Verificado
                  </span>
                </div>
                <Badge variant="default">
                  {process.env.NEXT_PUBLIC_WORLD_ID_APP_ID?.slice(0, 8)}...
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Authentication Section */}
      <Section>
        <Card variant="profile" padding="lg">
          <CardHeader>
            <CardTitle aztec>
              <UserIcon size="lg" className="text-jade-700" />
              Ingresa a Xambatlán
            </CardTitle>
            <CardDescription>
              Verifica tu identidad humana con World ID para acceder al mercado de confianza
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AuthButton />
              <p className="text-sm text-stone-600 text-center">
                Autenticación segura • Sin contraseñas • Identidad verificada
              </p>
            </div>
          </CardContent>
        </Card>
      </Section>

      {/* Features Preview */}
      <Section title="Funciones Principales">
        <div className="space-y-4">
          <Card variant="marketplace" padding="md" hoverable>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-jade-100 rounded-pyramid">
                  <UserIcon size="lg" className="text-jade-700" />
                </div>
                <div>
                  <h4 className="font-pixel text-base font-semibold text-obsidian-800 uppercase">
                    Perfiles Verificados
                  </h4>
                  <p className="text-sm text-stone-600">
                    Crea tu reputación con World ID
                  </p>
                </div>
              </div>
              <Badge variant="gold">Disponible</Badge>
            </div>
          </Card>

          <Card variant="marketplace" padding="md" hoverable>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 rounded-pyramid">
                  <ToolsIcon size="lg" className="text-teal-600" />
                </div>
                <div>
                  <h4 className="font-pixel text-base font-semibold text-obsidian-800 uppercase">
                    Directorio de Servicios
                  </h4>
                  <p className="text-sm text-stone-600">
                    Encuentra artesanos y profesionales
                  </p>
                </div>
              </div>
              <Badge variant="gold">Disponible</Badge>
            </div>
          </Card>

          <Card variant="marketplace" padding="md" hoverable>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gold-100 rounded-pyramid">
                  <LockIcon size="lg" className="text-gold-600" />
                </div>
                <div>
                  <h4 className="font-pixel text-base font-semibold text-obsidian-800 uppercase">
                    Pago por Contacto
                  </h4>
                  <p className="text-sm text-stone-600">
                    Accede a info de contacto con consentimiento
                  </p>
                </div>
              </div>
              <Badge variant="gold">Disponible</Badge>
            </div>
          </Card>

          <Card variant="marketplace" padding="md" hoverable>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-coral-100 rounded-pyramid">
                  <CoinIcon size="lg" className="text-coral-600" />
                </div>
                <div>
                  <h4 className="font-pixel text-base font-semibold text-obsidian-800 uppercase">
                    Contratos Seguros
                  </h4>
                  <p className="text-sm text-stone-600">
                    Escrow con pagos en crypto
                  </p>
                </div>
              </div>
              <Badge variant="gold">Disponible</Badge>
            </div>
          </Card>

          <Card variant="marketplace" padding="md" hoverable>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-jade-100 rounded-pyramid">
                  <StarIcon size="lg" className="text-jade-700" filled />
                </div>
                <div>
                  <h4 className="font-pixel text-base font-semibold text-obsidian-800 uppercase">
                    Sistema de Reputación
                  </h4>
                  <p className="text-sm text-stone-600">
                    Calificaciones y badges on-chain
                  </p>
                </div>
              </div>
              <Badge variant="gold">Disponible</Badge>
            </div>
          </Card>
        </div>
      </Section>

      {/* Test Instructions */}
      <Card variant="default" padding="md">
        <CardHeader>
          <CardTitle className="text-sm font-pixel">
            Instrucciones de Prueba
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-stone-600">
            <p><strong>QR Code:</strong> Visita la página /test para escanear</p>
            <p><strong>World App:</strong> Usa el App ID configurado</p>
            <p><strong>Debug:</strong> Revisa la consola del navegador</p>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm">
              <a href="/test">📱 Obtener QR</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center mt-8 text-sm text-stone-500">
        <p className="font-pixel text-xs uppercase tracking-wide">
          Xambatlán • Mercado de Confianza Descentralizado
        </p>
        <p className="text-xs">
          Construido con Next.js 15 + MiniKit + World ID + Blockchain
        </p>
      </div>
    </Layout>
  );
}
