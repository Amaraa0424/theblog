import { getClient } from '@/lib/apollo-server';
import { gql } from '@apollo/client';
import { MetadataRoute } from 'next';

const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      id
      updatedAt
    }
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all posts
  const { data } = await getClient().query({
    query: GET_ALL_POSTS,
  });

  // Create sitemap entries for blog posts
  const posts = data.posts.map((post: { id: string; updatedAt: string }) => ({
    url: `https://theblog-indol.vercel.app/posts/${post.id}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Add static routes
  const routes = [
    {
      url: 'https://theblog-indol.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: 'https://theblog-indol.vercel.app/posts',
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ];

  return [...routes, ...posts];
} 