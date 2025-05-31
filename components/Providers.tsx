'use client';

import { SessionProvider } from 'next-auth/react';
import { ApolloWrapper } from './ApolloWrapper';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <ApolloWrapper>{children}</ApolloWrapper>
      </SessionProvider>
    </ThemeProvider>
  );
} 