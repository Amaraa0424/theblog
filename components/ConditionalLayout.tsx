'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { VerificationBanner } from '@/components/VerificationBanner';
import { BeautifulFooter } from '@/components/BeautifulFooter';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Define routes that should have clean layout (no header/footer)
  const authRoutes = [
    '/login',
    '/signup', 
    '/register',
    '/forgot-password',
    '/verify-email'
  ];
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // For auth routes, return clean layout
  if (isAuthRoute) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }
  
  // For regular routes, return full layout with header/footer
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <VerificationBanner />
        {children}
      </main>
      <BeautifulFooter />
    </div>
  );
} 