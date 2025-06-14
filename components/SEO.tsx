import { Metadata } from 'next';
import Script from 'next/script';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
}

export function generateSEOMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SEOProps): Metadata {
  const defaultTitle = "OurLab.fun - Where Ideas Come to Life";
  const defaultDescription = "A modern blog platform where ideas come to life. Share your thoughts, connect with others, and be part of a community that values authentic expression.";
  const defaultImage = "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923694/ourlabfun-high-resolution-logo_yodtqj.png";
  const baseUrl = "https://www.ourlab.fun";

  const seoTitle = title ? `${title} | OurLab.fun` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoUrl = url ? `${baseUrl}${url}` : baseUrl;

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: tags || ["blog", "writing", "articles", "thoughts", "ideas", "community"],
    authors: author ? [{ name: author }] : [{ name: "Amaraa" }],
    openGraph: {
      type,
      locale: "en_US",
      url: seoUrl,
      siteName: "OurLab.fun",
      title: seoTitle,
      description: seoDescription,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: title || "OurLab.fun - Modern Blog Platform",
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: [author || "Amaraa"],
        tags,
      }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@ourlab_fun",
      creator: "@amaraa0424",
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
    },
    alternates: {
      canonical: seoUrl,
    },
  };
}

export function StructuredData({ 
  type = 'website',
  title,
  description,
  image,
  url,
  publishedTime,
  modifiedTime,
  author,
  tags,
}: SEOProps) {
  const baseUrl = "https://www.ourlab.fun";
  const seoUrl = url ? `${baseUrl}${url}` : baseUrl;
  
  // Website structured data
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "OurLab.fun",
    "alternateName": "OurLab",
    "url": baseUrl,
    "description": "A modern blog platform where ideas come to life. Share your thoughts, connect with others, and be part of a community that values authentic expression.",
    "publisher": {
      "@type": "Organization",
      "name": "OurLab.fun",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923735/ourlabfun-high-resolution-logo-grayscale-transparent_bzoebw.png",
        "width": 800,
        "height": 600
      },
      "sameAs": [
        "https://www.facebook.com/ourlab.fun/",
        "https://twitter.com/ourlab_fun"
      ]
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  // Article structured data
  const articleStructuredData = type === 'article' ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image || "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923694/ourlabfun-high-resolution-logo_yodtqj.png",
    "url": seoUrl,
    "datePublished": publishedTime,
    "dateModified": modifiedTime || publishedTime,
    "author": {
      "@type": "Person",
      "name": author || "Amaraa",
      "url": `${baseUrl}/profile/${author?.toLowerCase().replace(/\s+/g, '-') || 'amaraa'}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "OurLab.fun",
      "url": baseUrl,
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/dolfbqzp3/image/upload/v1749923735/ourlabfun-high-resolution-logo-grayscale-transparent_bzoebw.png",
        "width": 800,
        "height": 600
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": seoUrl
    },
    "keywords": tags?.join(", ") || "blog, writing, articles, thoughts, ideas"
  } : null;

  // Breadcrumb structured data
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      ...(type === 'article' && title ? [{
        "@type": "ListItem",
        "position": 2,
        "name": "Posts",
        "item": `${baseUrl}/posts`
      }, {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": seoUrl
      }] : [])
    ]
  };

  return (
    <>
      {/* Website structured data */}
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
      />

      {/* Article structured data */}
      {articleStructuredData && (
        <Script
          id="article-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
      )}

      {/* Breadcrumb structured data */}
      <Script
        id="breadcrumb-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-Q2NLJPN3CP"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-Q2NLJPN3CP');
        `}
      </Script>
    </>
  );
} 