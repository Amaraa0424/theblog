'use client';

import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import { PostCard } from '@/components/PostCard';

const GET_POSTS = gql`
  query GetPosts($skip: Int, $take: Int) {
    posts(skip: $skip, take: $take) {
      id
      title
      subtitle
      content
      image
      createdAt
      likes {
        id
        user {
          id
        }
      }
      author {
        id
        name
      }
    }
  }
`;

export default function Posts() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery(GET_POSTS, {
    variables: { skip: (page - 1) * 10, take: 10 },
  });

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error.message}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>

      {data?.posts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No posts yet</h3>
          <p className="mt-2 text-muted-foreground">
            Check back later for new content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8 space-x-2">
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2">Page {page}</span>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setPage(p => p + 1)}
          disabled={data?.posts.length < 10}
        >
          Next
        </button>
      </div>
    </div>
  );
} 