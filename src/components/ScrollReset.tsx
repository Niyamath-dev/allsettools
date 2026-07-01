// src/components/ScrollReset.tsx
"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const ScrollReset: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Force immediate scroll position reset to top on navigation
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};
