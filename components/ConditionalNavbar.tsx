// components/ConditionalNavbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/Navbar";

export function ConditionalNavbar() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.includes('/sign-in') || pathname?.includes('/sign-up');

  if (isAuthRoute) {
    return null;
  }

  return <Navbar />;
}