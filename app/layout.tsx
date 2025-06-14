import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ApolloWrapper } from "@/lib/apollo-wrapper";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { LoadingBar } from "@/components/LoadingBar";
import { ConditionalLayout } from "@/components/ConditionalLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { StructuredData } from "@/components/SEO";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ourlab.fun"),
  title: {
    default: "OurLab.fun - Where Ideas Come to Life",
    template: "%s | OurLab.fun",
  },
  description: "A modern blog platform where ideas come to life. Share your thoughts, connect with others, and be part of a community that values authentic expression. Discover amazing stories from writers and thinkers worldwide.",
  keywords: [
    "blog", 
    "writing", 
    "articles", 
    "thoughts", 
    "ideas", 
    "community", 
    "stories", 
    "writers", 
    "thinkers", 
    "authentic expression", 
    "ourlab.fun",
    "modern blog platform",
    "content creation",
    "storytelling"
  ],
  authors: [{ name: "Amaraa", url: "https://www.ourlab.fun" }],
  creator: "Amaraa",
  publisher: "OurLab.fun",
  category: "Technology",
  classification: "Blog Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.ourlab.fun",
    siteName: "OurLab.fun",
    title: "OurLab.fun - Where Ideas Come to Life",
    description: "A modern blog platform where ideas come to life. Share your thoughts, connect with others, and be part of a community that values authentic expression.",
    images: [
      {
        url: "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923694/ourlabfun-high-resolution-logo_yodtqj.png",
        width: 1200,
        height: 630,
        alt: "OurLab.fun - Modern Blog Platform",
        type: "image/png",
      },
      {
        url: "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923735/ourlabfun-high-resolution-logo-grayscale-transparent_bzoebw.png",
        width: 800,
        height: 600,
        alt: "OurLab.fun Logo",
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ourlab_fun",
    creator: "@amaraa0424",
    title: "OurLab.fun - Where Ideas Come to Life",
    description: "A modern blog platform where ideas come to life. Share your thoughts, connect with others, and discover amazing stories.",
    images: [
      {
        url: "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923694/ourlabfun-high-resolution-logo_yodtqj.png",
        alt: "OurLab.fun - Modern Blog Platform",
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
    yandex: "your-yandex-verification-code", // Replace with actual verification code
    yahoo: "your-yahoo-verification-code", // Replace with actual verification code
  },
  alternates: {
    canonical: "https://www.ourlab.fun",
    languages: {
      "en-US": "https://www.ourlab.fun",
    },
  },
  other: {
    "theme-color": "#000000",
    "color-scheme": "light dark",
    "twitter:image": "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923694/ourlabfun-high-resolution-logo_yodtqj.png",
    "twitter:image:alt": "OurLab.fun - Modern Blog Platform",
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData type="website" />
      </head>
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
              <ScrollToTop />
              <Toaster richColors position="top-right" />
            </ApolloWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
