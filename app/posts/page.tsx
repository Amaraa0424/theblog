'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useState } from 'react';

const GET_POSTS = gql`
  query GetPosts($skip: Int, $take: Int) {
    posts(skip: $skip, take: $take) {
      id
      title
      content
      createdAt
      author {
        name
      }
      comments {
        id
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>

      <div className="space-y-6">
        {data?.posts.map((post: any) => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{post.title}</h2>
              <p className="text-gray-600">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>
              <div className="card-actions justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  By {post.author.name || 'Anonymous'} •{' '}
                  {new Date(post.createdAt).toLocaleDateString()} •{' '}
                  {post.comments.length} comments
                </div>
                <Link href={`/posts/${post.id}`} className="btn btn-primary btn-sm">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}

        {data?.posts.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold">No posts found</h3>
          </div>
        )}
      </div>

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