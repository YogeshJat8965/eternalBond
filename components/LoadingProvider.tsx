'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import PageLoader from './PageLoader';
import { AnimatePresence } from 'framer-motion';

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Immediately hide loader when pathname changes (page has loaded)
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    // Show loader on any link click
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      
      if (link && link.href && !link.target && link.href.includes(window.location.origin)) {
        // Check if it's not the current page
        const linkUrl = new URL(link.href);
        if (linkUrl.pathname !== pathname) {
          setLoading(true);
        }
      }
    };

    // Add click listener to document
    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <PageLoader />}
      </AnimatePresence>
      {children}
    </>
  );
}
