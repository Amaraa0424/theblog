'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { PostMenu } from './PostMenu';
import { useSession } from 'next-auth/react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    subtitle?: string | null;
    content: string;
    image?: string | null;
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
  };
}

export function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession();
  const isLiked = post.likes.some(like => like.user.id === session?.user?.id);
  const likesCount = post.likes.length;

  // Extract first paragraph for excerpt if no subtitle
  const excerpt = post.subtitle || post.content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .split('\n')[0] // Get first paragraph
    .slice(0, 160) + '...'; // Limit length

  return (
    <article className="group relative flex flex-col space-y-2 bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <PostMenu post={post} />
      {post.image ? (
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="relative w-full h-48 bg-muted/50">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            No image
          </div>
        </div>
      )}
      <div className="p-6 space-y-4">
        <Link 
          href={`/posts/${post.id}`} 
          className="block space-y-2 hover:cursor-pointer"
        >
          <h2 className="text-2xl font-bold leading-tight tracking-tight hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-2">
            {excerpt}
          </p>
        </Link>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <span>{post.author.name}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <LikeButton 
              postId={post.id} 
              initialLikes={likesCount}
              initialLiked={isLiked}
            />
            <ShareButton postId={post.id} title={post.title} />
          </div>
        </div>
      </div>
    </article>
  );
} 