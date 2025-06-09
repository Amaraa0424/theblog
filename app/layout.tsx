import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { LoadingBar } from "@/components/LoadingBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://theblog-indol.vercel.app"),
  title: {
    default: "TheBlog",
    template: "%s | TheBlog",
  },
  description: "A modern blog platform for sharing your thoughts and ideas",
  keywords: ["blog", "writing", "articles", "thoughts", "ideas"],
  authors: [{ name: "Amaraa" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    images: ["/images/logo.jpg"],
    url: "https://theblog-indol.vercel.app",
    siteName: "TheBlog",
    title: "TheBlog",
    description: "A modern blog platform for sharing your thoughts and ideas",
  },
  twitter: {
    card: "summary_large_image",
    title: "TheBlog",
    description: "A modern blog platform for sharing your thoughts and ideas",
    creator: "@amaraa0424",
  },
  robots: {
    index: true,
    follow: true,
  },
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
            <ApolloWrapper>
              <LoadingBar />
              <div className="relative min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 container mx-auto px-4 py-8">
                  {children}
                </main>
                <footer className="border-t py-6 md:py-0">
                  <div className="container mx-auto flex h-14 items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Amaraa doesn&apos;t trust social media
                    </p>
                    <p className="text-sm text-muted-foreground">
                      © {new Date().getFullYear()} TheBlog. All rights reserved.
                    </p>
                  </div>
                </footer>
              </div>
              <Toaster richColors position="top-right" />
            </ApolloWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
