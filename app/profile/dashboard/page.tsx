'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { gql, useQuery } from '@apollo/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Post {
  id: string;
  title: string;
  viewCount: number;
  likes: Array<{ id: string }>;
  comments: Array<{ id: string }>;
  shares: Array<{ id: string }>;
  createdAt: string;
}

const GET_USER_DATA = gql`
  query GetUserData {
    me {
      id
      name
      posts {
        id
        title
        viewCount
        likes {
          id
        }
        comments {
          id
        }
        shares {
          id
        }
        createdAt
      }
    }
  }
`;

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const { data: userData, loading: userLoading } = useQuery(GET_USER_DATA);

  if (userLoading) {
    return <div>Loading...</div>;
  }

  const posts: Post[] = userData?.me?.posts || [];
  const totalViews = posts.reduce((sum: number, post: Post) => sum + (post.viewCount || 0), 0);
  const totalLikes = posts.reduce((sum: number, post: Post) => sum + post.likes.length, 0);
  const totalComments = posts.reduce((sum: number, post: Post) => sum + post.comments.length, 0);
  const totalShares = posts.reduce((sum: number, post: Post) => sum + post.shares.length, 0);

  // Prepare data for the engagement chart
  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const engagementData = last30Days.map(date => {
    const dayPosts = posts.filter((post: Post) => 
      post.createdAt.split('T')[0] === date
    );
    return {
      date,
      views: dayPosts.reduce((sum: number, post: Post) => sum + (post.viewCount || 0), 0),
      likes: dayPosts.reduce((sum: number, post: Post) => sum + post.likes.length, 0),
      comments: dayPosts.reduce((sum: number, post: Post) => sum + post.comments.length, 0),
    };
  });

  return (
    <div className="container max-w-6xl py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
          <CardDescription>
            Track your content performance and engagement metrics
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Over Time</CardTitle>
          <CardDescription>
            Your post engagement metrics for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  interval={6}
                />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#8884d8" 
                  name="Views"
                />
                <Line 
                  type="monotone" 
                  dataKey="likes" 
                  stroke="#82ca9d" 
                  name="Likes"
                />
                <Line 
                  type="monotone" 
                  dataKey="comments" 
                  stroke="#ffc658" 
                  name="Comments"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 