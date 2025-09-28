import { auth } from '@/auth';
import ClientProviders from '@/providers';
import '@worldcoin/mini-apps-ui-kit-react/styles.css';
import type { Metadata } from 'next';
import { Inter, Orbitron, JetBrains_Mono } from 'next/font/google';
import './globals.css';

// Configure fonts for the Aztec/Maya theme
const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const orbitron = Orbitron({
  variable: '--font-pixel',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Xambatlán - Mercado de Confianza',
  description: 'La red de artesanos y profesionales verificados con World ID',
  keywords: ['World App', 'Mini App', 'servicios', 'artesanos', 'confianza', 'reputación'],
  authors: [{ name: 'Xambatlán Team' }],
  creator: 'Xambatlán',
  publisher: 'Xambatlán',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="es" className={`${inter.variable} ${orbitron.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ClientProviders session={session}>{children}</ClientProviders>
      </body>
    </html>
  );
}
