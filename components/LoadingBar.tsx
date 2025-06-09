'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function LoadingBar() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
        <div className="bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-lg border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  );
}