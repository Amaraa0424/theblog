import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { LikeButton } from '@/components/LikeButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Post } from '@/lib/types';
import { useSession } from 'next-auth/react';

interface BlogPostCardProps {
  post: Post;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const { data: session } = useSession();
  const initialLikes = post.likes.length;
  const initialLiked = post.likes.some(like => like.user.id === session?.user?.id);

  return (
    <Card className="overflow-hidden">
      <Link href={`/posts/${post.id}`}>
        <div className="relative aspect-video w-full overflow-hidden">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform hover:scale-105"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
      </Link>
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{post.category.name}</Badge>
          <span className="text-sm text-muted-foreground">
            {format(new Date(post.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
        <Link href={`/posts/${post.id}`} className="group">
          <h3 className="line-clamp-2 text-xl font-semibold group-hover:underline">
            {post.title}
          </h3>
          {post.subtitle && (
            <p className="line-clamp-2 text-muted-foreground">{post.subtitle}</p>
          )}
        </Link>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-muted-foreground">
          {post.content.replace(/<[^>]*>/g, '').slice(0, 200)}...
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.author.avatar ? (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="h-6 w-6 rounded-full bg-muted" />
          )}
          <span className="text-sm text-muted-foreground">{post.author.name}</span>
        </div>
        <LikeButton 
          postId={post.id} 
          initialLikes={initialLikes}
          initialLiked={initialLiked}
        />
      </CardFooter>
    </Card>
  );
}
