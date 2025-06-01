'use client';

import { gql, useQuery } from '@apollo/client';
import { BlogLayout } from '@/components/blog-layout';
import type { Post } from '@/lib/types';

// interface Post {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   author: {
//     name: string;
//   };
// }

// interface PostsData {
//   posts: Post[];
// }

// const GET_POSTS = gql`
//   query GetPosts {
//     posts {
//       id
//       title
//       content
//       createdAt
//       author {
//         name
//       }
//     }
//   }
// `;

const GET_INITIAL_POSTS = gql`
  query GetInitialPosts {
    publishedPosts(orderBy: { createdAt: desc }) {
      id
      title
      subtitle
      content
      image
      published
      createdAt
      category {
        id
        name
      }
      author {
        id
        name
        avatar
      }
      likes {
        id
        user {
          id
        }
      }
    }
  }
`;

export default function PostsPage() {
  const { data, loading, error } = useQuery<{ publishedPosts: Post[] }>(GET_INITIAL_POSTS);

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error.message}</div>;

  return <BlogLayout initialPosts={data?.publishedPosts || []} />;
}
