import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.ourlab.fun';
  
  const robotsTxt = `# Global rules
User-agent: *
Allow: /
Allow: /posts/
Allow: /api/
Disallow: /api/auth/
Disallow: /_next/
Disallow: /*?* 
Crawl-delay: 1

# Google-specific rules
User-agent: Googlebot
Allow: /
Allow: /*.js$
Allow: /*.css$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.gif$
Allow: /*.svg$

# Google Image
User-agent: Googlebot-Image
Allow: /
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.png$
Allow: /*.webp$
Allow: /*.svg$

# Google Mobile
User-agent: Googlebot-Mobile
Allow: /

# Google AdSense
User-agent: Mediapartners-Google
Allow: /

# Prevent duplicate content issues
User-agent: *
Disallow: /*?utm_
Disallow: /*?source=
Disallow: /*?ref=
Disallow: /api/preview

# Host directive (helps with canonical URLs)
Host: ${baseUrl}

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
} 