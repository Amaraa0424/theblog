import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LoadingBar } from "@/components/LoadingBar";
import { ConditionalLayout } from "@/components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ourlab.fun"),
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
    url: "https://ourlab.fun",
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
              <ConditionalLayout>
                  {children}
              </ConditionalLayout>
              <Toaster richColors position="top-right" />
            </ApolloWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
