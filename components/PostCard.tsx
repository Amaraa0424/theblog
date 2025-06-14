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
    <article className="group relative flex flex-col h-full w-full bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <PostMenu post={post} />
      <Link href={`/posts/${post.id}`}>
        {post.image ? (
          <div className="relative w-full aspect-video overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        ) : (
          <div className="relative w-full aspect-video bg-muted/50">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No image
            </div>
          </div>
        )}
      </Link>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <Link 
          href={`/posts/${post.id}`} 
          className="flex-1 block space-y-2 hover:cursor-pointer overflow-hidden"
        >
          <h2 className="text-xl sm:text-2xl font-bold leading-tight tracking-tight hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
            {excerpt}
          </p>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 mt-4">
          <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-full sm:max-w-[60%]">
            <span className="truncate">{post.author.name}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), 'MMM d, yyyy')}
            </time>
            <span className="mx-2">•</span>
            <span>{post.viewCount} views</span>
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