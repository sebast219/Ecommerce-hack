import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';
import { Providers } from './providers';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { WebVitals } from './web-vitals';
import { Toaster } from 'sonner';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ecommerce Hak 6',
  description: 'Plataforma especializada en herramientas de ciberseguridad',
  keywords: ['ecommerce', 'ciberseguridad', 'herramientas', 'pentesting', 'seguridad informática'],
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <WebVitals />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 h-full">{children}</main>
            <Footer />
            <ScrollToTop />
            <SpeedInsights />
          </div>
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
