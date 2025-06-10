import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FollowButton } from "@/components/FollowButton";
import { PostCard } from "@/components/PostCard";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  const session = await getServerSession(authOptions);
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
          likes: true,
        },
      },
      followers: {
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
      following: {
        include: {
          following: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const isOwnProfile = session?.user?.id === user.id;
  const followersCount = user.followers.length;
  const followingCount = user.following.length;

  return (
    <div className="container max-w-6xl py-8">
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar || undefined} />
            <AvatarFallback>
              {user.name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">@{user.username}</p>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0">
                    {followersCount} Followers
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    {user.followers.map(({ follower }) => (
                      <div
                        key={follower.id}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={follower.avatar || undefined} />
                          <AvatarFallback>
                            {follower.name?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <Link
                            href={`/profile/${follower.id}`}
                            className="hover:underline"
                          >
                            {follower.name}
                          </Link>
                          <span className="text-sm text-muted-foreground">
                            @{follower.username}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="p-0">
                    {followingCount} Following
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    {user.following.map(({ following }) => (
                      <div
                        key={following.id}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={following.avatar || undefined} />
                          <AvatarFallback>
                            {following.name?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <Link
                            href={`/profile/${following.id}`}
                            className="hover:underline"
                          >
                            {following.name}
                          </Link>
                          <span className="text-sm text-muted-foreground">
                            @{following.username}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            {!isOwnProfile && session?.user && (
              <div className="mt-4">
                <FollowButton
                  userId={user.id}
                  isFollowing={user.followers.some(
                    (f) => f.follower.id === session.user.id
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Posts</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {user.posts.map((post) => (
            <PostCard 
              key={post.id} 
              post={{
                id: post.id,
                title: post.title,
                subtitle: post.subtitle,
                content: post.content,
                image: post.image,
                createdAt: post.createdAt.toISOString(),
                viewCount: 0,
                likes: post.likes.map(like => ({
                  id: like.id,
                  user: { id: like.userId },
                })),
                author: {
                  id: post.author.id,
                  name: post.author.name || '',
                },
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
