import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = "https://www.ourlab.fun";

  // Static pages - Updated for cache invalidation
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: "1.0",
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date().toISOString(),
      changeFrequency: "daily",
      priority: "0.8",
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: "0.5",
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: "0.5",
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date().toISOString(),
      changeFrequency: "monthly",
      priority: "0.5",
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.6",
    },
    {
      url: `${baseUrl}/profile/dashboard`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.5",
    },
    {
      url: `${baseUrl}/posts/new`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: "0.6",
    },
  ];

  interface SitemapEntry {
    url: string;
    lastModified: string;
    changeFrequency: string;
    priority: string;
  }

  let postPages: SitemapEntry[] = [];

  try {
    // Try to fetch posts dynamically
    const { gql } = await import("@apollo/client");
    const { getClient } = await import("@/lib/apollo-client");

    const GET_ALL_POSTS = gql`
      query GetAllPosts {
        publishedPosts {
          id
          createdAt
          updatedAt
        }
      }
    `;

    const client = getClient();
    const { data } = await client.query({
      query: GET_ALL_POSTS,
      fetchPolicy: "no-cache",
    });

    postPages =
      data?.publishedPosts?.map(
        (post: { id: string; createdAt: string; updatedAt?: string }) => ({
          url: `${baseUrl}/posts/${post.id}`,
          lastModified: new Date(
            post.updatedAt || post.createdAt
          ).toISOString(),
          changeFrequency: "weekly",
          priority: "0.7",
        })
      ) || [];
  } catch {
    console.log("Sitemap: Using static pages only (GraphQL not available)");
  }

  const allPages = [...staticPages, ...postPages];

  // Generate XML sitemap
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Robots-Tag": "noindex",
      "ETag": `"sitemap-${Date.now()}"`, // Force cache invalidation
    },
  });
}
