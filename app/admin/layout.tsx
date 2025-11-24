'use client';

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

  // For all other admin pages, render with simple centered layout
  return (
    <AdminAuthCheck>
      {children}
    </AdminAuthCheck>
  );
}
