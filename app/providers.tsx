'use client';

import { AuthProvider } from '@/lib/auth-context';
import { AdminAuthProvider } from '@/lib/admin-auth-context';
import { LanguageProvider } from '@/context/LanguageProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { usePathname } from 'next/navigation';

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <LanguageProvider>
      <AuthProvider>
        <AdminAuthProvider>
          {isAdminRoute ? (
            // Admin routes without main layout (no navbar/footer)
            children
          ) : (
            // Regular routes with navbar and footer
            <MainLayout>
              {children}
            </MainLayout>
          )}
        </AdminAuthProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
