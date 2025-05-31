import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TheBlog',
  description: 'A modern blog platform built with Next.js and GraphQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t py-6 md:py-0 container mx-auto">
              <div className="container flex h-14 items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Built with Next.js, GraphQL, and shadcn/ui
                </p>
                <p className="text-sm text-muted-foreground">
                  © {new Date().getFullYear()} TheBlog. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
