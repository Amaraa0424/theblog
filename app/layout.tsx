import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { ApolloProvider } from '@/components/providers/ApolloProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Blog',
  description: 'A modern blog platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-y-scroll`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ApolloProvider>
              <div className="relative min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8">
                  {children}
                </main>
                <footer className="border-t py-6 md:py-0">
                  <div className="container mx-auto flex h-14 items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Amaraa doesn't trust social media
                    </p>
                    <p className="text-sm text-muted-foreground">
                      © {new Date().getFullYear()} TheBlog. All rights reserved.
                    </p>
                  </div>
                </footer>
              </div>
              <Toaster />
            </ApolloProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
