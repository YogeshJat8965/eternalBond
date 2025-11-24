'use client';

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

  // If it's the login page, render without any wrapper
  if (isLoginPage) {
    return <>{children}</>;
  }

  // For all other admin pages, render with header
  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        {children}
      </div>
    </AdminAuthCheck>
  );
}
