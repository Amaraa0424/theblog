'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { PostCard } from '@/components/PostCard';
import { useEffect } from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  BookOpen,
  Heart,
  MessageSquare,
  Share2,
  Eye,
} from 'lucide-react';

const USER_DASHBOARD_DATA = gql`
  query UserDashboardData {
    userPosts {
      id
      title
      subtitle
      content
      image
      published
      createdAt
      viewCount
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
      comments {
        id
        content
        createdAt
        author {
          id
          name
        }
        parentId
      }
      shares {
        id
        createdAt
        sharedWith {
          name
        }
      }
    }
  }
`;

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
  };
  parentId?: string | null;
}

interface Share {
  id: string;
  createdAt: string;
  sharedWith: {
    name: string;
  };
}

interface Post {
  id: string;
  title: string;
  subtitle?: string | null;
  content: string;
  image?: string | null;
  published: boolean;
  createdAt: string;
  viewCount: number;
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
  comments: Comment[];
  shares: Share[];
}

export default function Dashboard() {
  const router = useRouter();
  const { status } = useSession();
  const { data, loading, error } = useQuery(USER_DASHBOARD_DATA);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (loading || status === 'loading') {
    return <div className="loading loading-spinner loading-lg"></div>;
  }
  
  if (error) return <div className="alert alert-error">{error.message}</div>;

  // If not authenticated, render nothing while redirecting
  if (status === 'unauthenticated') {
    return null;
  }

  const posts: Post[] = data?.userPosts || [];
  const totalPosts = posts.length;
  const publishedPosts = posts.filter(post => post.published).length;
  const totalViews = posts.reduce((sum, post) => sum + post.viewCount, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments.length, 0);
  const totalShares = posts.reduce((sum, post) => sum + post.shares.length, 0);

  // Get recent activity (last 5 comments and shares)
  const recentComments = posts
    .flatMap(post => post.comments.map(comment => ({
      ...comment,
      postTitle: post.title,
      postId: post.id
    })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentShares = posts
    .flatMap(post => post.shares.map(share => ({
      ...share,
      postTitle: post.title,
      postId: post.id
    })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {publishedPosts} published
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {(totalViews / Math.max(publishedPosts, 1)).toFixed(1)} avg per post
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
            <p className="text-xs text-muted-foreground">
              {(totalLikes / Math.max(publishedPosts, 1)).toFixed(1)} avg per post
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
            <p className="text-xs text-muted-foreground">
              {(totalComments / Math.max(publishedPosts, 1)).toFixed(1)} avg per post
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares}</div>
            <p className="text-xs text-muted-foreground">
              {(totalShares / Math.max(publishedPosts, 1)).toFixed(1)} avg per post
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(((totalLikes + totalComments + totalShares) / Math.max(totalViews, 1)) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Interactions per view
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Recent Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Comments</CardTitle>
            <CardDescription>Latest comments on your posts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentComments.length > 0 ? (
              <div className="space-y-4">
                {recentComments.map(comment => (
                  <div key={comment.id} className="border-b pb-4 last:border-0">
                    <Link href={`/posts/${comment.postId}`} className="text-sm font-medium hover:underline">
                      {comment.postTitle}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{comment.author.name}</span>
                      <span>•</span>
                      <time dateTime={comment.createdAt}>
                        {format(new Date(comment.createdAt), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent comments</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Shares */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Shares</CardTitle>
            <CardDescription>Latest shares of your posts</CardDescription>
          </CardHeader>
          <CardContent>
            {recentShares.length > 0 ? (
              <div className="space-y-4">
                {recentShares.map(share => (
                  <div key={share.id} className="border-b pb-4 last:border-0">
                    <Link href={`/posts/${share.postId}`} className="text-sm font-medium hover:underline">
                      {share.postTitle}
                    </Link>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>Shared with {share.sharedWith.name}</span>
                      <span>•</span>
                      <time dateTime={share.createdAt}>
                        {format(new Date(share.createdAt), 'MMM d, yyyy')}
                      </time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent shares</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Posts Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Your Posts</h2>
          <Link href="/posts/new" className="btn btn-primary">
            Create New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-muted-foreground">No posts yet</h3>
            <p className="mt-2 text-muted-foreground">
              Get started by creating a new post.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 