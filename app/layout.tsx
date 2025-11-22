import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingProvider from '@/components/LoadingProvider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KalyanautsavaMat',
  description: 'Join thousands of happy couples who found love through KalyanautsavaMat matrimonial service.',
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </LoadingProvider>
        <Toaster />
      </body>
    </html>
  );
}
