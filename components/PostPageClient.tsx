'use client';

import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Comments } from '@/components/Comments';
import { LikeButton } from '@/components/LikeButton';
import { ShareButton } from '@/components/ShareButton';
import { ViewCounter } from '@/components/ViewCounter';
import { RichTextReadOnly } from '@/components/RichTextReadOnly';
import Image from 'next/image';

interface Like {
  id: string;
  user: {
    id: string;
  };
}

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  createdAt: string;
  viewCount: number;
  likes: Like[];
  author: {
    id: string;
    name: string;
  };
  comments: any[];
}

interface PostPageClientProps {
  post: Post;
}

export function PostPageClient({ post }: PostPageClientProps) {
  const { data: session } = useSession();

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
      <ViewCounter postId={post.id} />
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.subtitle && (
          <p className="text-xl text-muted-foreground mb-6">{post.subtitle}</p>
        )}
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground">
            <span>By {post.author.name}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </time>
            <span className="mx-2">•</span>
            <span>{post.viewCount} views</span>
          </div>
          <div className="flex items-center gap-2">
            <LikeButton 
              postId={post.id}
              initialLikes={post.likes.length}
              initialLiked={post.likes.some((like: Like) => like.user.id === session?.user?.id)}
            />
            <ShareButton postId={post.id} title={post.title} />
          </div>
        </div>
      </header>

      {post.image && (
        <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <RichTextReadOnly content={post.content} />

      <div className="mt-16">
        <Comments postId={post.id} initialComments={post.comments} />
      </div>
    </article>
  );
} 