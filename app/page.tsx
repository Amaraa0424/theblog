'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

const GET_LATEST_POSTS = gql`
  query GetLatestPosts {
    posts(take: 5) {
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

export default function Home() {
  const { data, loading, error } = useQuery(GET_LATEST_POSTS);

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="hero bg-base-200 rounded-lg p-8 mb-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to TheBlog</h1>
            <p className="py-6">
              Share your thoughts, connect with others, and discover amazing stories.
            </p>
            <Link href="/signup" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6">Latest Posts</h2>
      <div className="space-y-6">
        {data?.posts.map((post: any) => (
          <div key={post.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">{post.title}</h3>
              <p className="text-gray-600">
                {post.content.length > 200
                  ? `${post.content.substring(0, 200)}...`
                  : post.content}
              </p>
              <div className="card-actions justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  By {post.author.name || 'Anonymous'} •{' '}
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <Link href={`/posts/${post.id}`} className="btn btn-primary btn-sm">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
