'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
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

  // For all other admin pages, render with sidebar and header
  return (
    <AdminAuthCheck>
      <div className="min-h-screen pt-16 bg-gray-50">
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
            <AdminHeader />
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
      </div>
    </AdminAuthCheck>
  );
}
