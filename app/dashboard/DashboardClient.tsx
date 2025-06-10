'use client';

import Link from 'next/link';
import { PostCard } from '@/components/PostCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface Follower {
  id: string;
  follower: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

interface Following {
  id: string;
  following: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

interface DashboardData {
  me: {
    id: string;
    name: string | null;
    email: string;
    avatar: string | null;
    _count: {
      posts: number;
      followers: number;
      following: number;
    };
    posts: Array<{
      id: string;
      title: string;
      subtitle: string | null;
      published: boolean;
      createdAt: string;
    }>;
    followers: Follower[];
    following: Following[];
  };
}

export function DashboardClient({ data }: { data: DashboardData }) {
  return (
    <div className="container max-w-6xl py-8">
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={data.me.avatar || undefined} />
            <AvatarFallback>{data.me.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{data.me.name}</h1>
            <p className="text-muted-foreground">{data.me.email}</p>
            <div className="mt-4 flex items-center gap-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0">
                    {data.me._count.followers} Followers
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    {data.me.followers.map(({ follower }: Follower) => (
                      <div key={follower.id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={follower.avatar || undefined} />
                          <AvatarFallback>
                            {follower.name?.[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/profile/${follower.id}`}
                          className="hover:underline"
                        >
                          {follower.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0">
                    {data.me._count.following} Following
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    {data.me.following.map(({ following }: Following) => (
                      <div key={following.id} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={following.avatar || undefined} />
                          <AvatarFallback>
                            {following.name?.[0]?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <Link
                          href={`/profile/${following.id}`}
                          className="hover:underline"
                        >
                          {following.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-6">Your Posts</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.me.posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={{
                  ...post,
                  viewCount: 0,
                  likes: [],
                  content: '',
                  author: {
                    id: data.me.id,
                    name: data.me.name || '',
                  }
                }} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 