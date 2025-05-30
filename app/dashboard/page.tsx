'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const GET_USER_POSTS = gql`
  query GetUserPosts {
    userPosts {
      id
      title
      content
      published
      createdAt
    }
  }
`;

export default function Dashboard() {
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_USER_POSTS);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Link href="/posts/new" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      <div className="space-y-6">
        {data?.userPosts.map((post: any) => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <h2 className="card-title">{post.title}</h2>
                <div className={`badge ${post.published ? 'badge-success' : 'badge-warning'}`}>
                  {post.published ? 'Published' : 'Draft'}
                </div>
              </div>
              <p className="text-gray-600">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>
              <div className="card-actions justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Created on {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="space-x-2">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="btn btn-sm btn-outline"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/posts/${post.id}`}
                    className="btn btn-sm btn-primary"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}

        {data?.userPosts.length === 0 && (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Start writing your first blog post!</p>
            <Link href="/posts/new" className="btn btn-primary">
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 