'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoadingProvider from '@/components/LoadingProvider';
import { Toaster } from '@/components/ui/toaster';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingProvider>
          {!isAdminPage && <Navbar />}
          <main>{children}</main>
          {!isAdminPage && <Footer />}
        </LoadingProvider>
        <Toaster />
      </body>
    </html>
  );
}
