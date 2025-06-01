'use client';

import { gql, useQuery } from '@apollo/client';
import { PostCard } from '@/components/PostCard';
import { toast } from 'sonner';

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: {
    id: string;
    user: {
      id: string;
    };
  }[];
  author: {
    id: string;
    name: string;
  };
}

interface PublishedPostsQueryData {
  publishedPosts: Post[];
}

interface ErrorResponse {
  message: string;
}

const GET_PUBLISHED_POSTS = gql`
  query GetPublishedPosts {
    publishedPosts(orderBy: { createdAt: desc }) {
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

export function LatestPosts() {
  const { data, loading, error } = useQuery<PublishedPostsQueryData>(GET_PUBLISHED_POSTS);

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) {
    const err = error as ErrorResponse;
    toast.error(err.message || "Failed to load posts");
    return <div className="alert alert-error">{err.message}</div>;
  }

  return (
    <section className="bg-muted/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Latest Posts</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover the latest thoughts and insights from our community
          </p>
        </div>

        {data?.publishedPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">No posts yet</h3>
            <p className="mt-2 text-muted-foreground">
              Check back later for new content.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.publishedPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 