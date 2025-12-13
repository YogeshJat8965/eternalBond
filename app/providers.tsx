'use client';

import { AuthProvider } from '@/lib/auth-context';
import { LanguageProvider } from '@/context/LanguageProvider';
import { MainLayout } from '@/components/layout/MainLayout';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainLayout>
          {children}
        </MainLayout>
      </AuthProvider>
    </LanguageProvider>
  );
}
