'use client';

import { gql } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';
import { Hero } from '@/components/Hero';
import { LatestPosts } from '@/components/LatestPosts';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
  };
}

interface PostsData {
  posts: Post[];
}

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
      createdAt
      author {
        name
      }
    }
  }
`;

export default async function PostsPage() {
  const { data } = await getClient().query<PostsData>({
    query: GET_POSTS,
  });

  return (
    <main>
      <Hero />
      <LatestPosts />
    </main>
  );
} 