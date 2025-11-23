'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminAuthCheck from '@/components/admin/AdminAuthCheck';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // If it's the login page, render without sidebar and header
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin pages, render with sidebar only (no header)
  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-h-screen">
            <main className="flex-1 p-6 flex items-center justify-center">
              <div className="w-full">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </AdminAuthCheck>
  );
}
