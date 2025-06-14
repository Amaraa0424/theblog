'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the analytics dashboard
    router.replace('/profile/dashboard');
  }, [router]);

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to your analytics dashboard...</p>
        </div>
      </div>
    </div>
  );
} 