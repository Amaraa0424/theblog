'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PostCard } from '@/components/PostCard';

const USER_POSTS = gql`
  query UserPosts {
    userPosts {
      id
      title
      subtitle
      content
      image
      published
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

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data, loading, error } = useQuery(USER_POSTS);

  // Redirect to login if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (loading || status === 'loading') {
    return <div className="loading loading-spinner loading-lg"></div>;
  }
  
  if (error) return <div className="alert alert-error">{error.message}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Posts</h1>
        <Link href="/posts/new" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {data?.userPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-muted-foreground">No posts yet</h3>
          <p className="mt-2 text-muted-foreground">
            Get started by creating a new post.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.userPosts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
} 