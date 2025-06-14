import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.ourlab.fun';
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
  ];

  // During build time, we can't fetch from the GraphQL API
  // So we'll return static pages only
  if (process.env.NODE_ENV === 'production' && !process.env.RUNTIME_SITEMAP) {
    return staticPages;
  }

  try {
    // Only try to fetch posts if we're in development or runtime
    const { gql } = await import('@apollo/client');
    const { getClient } = await import('@/lib/apollo-client');
    
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
      fetchPolicy: 'no-cache',
    });

    const postPages = data?.publishedPosts?.map((post: { id: string; createdAt: string; updatedAt?: string }) => ({
      url: `${baseUrl}/posts/${post.id}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    return [...staticPages, ...postPages];
  } catch {
    console.log('Sitemap: Using static pages only (GraphQL not available during build)');
    return staticPages;
  }
} 