'use client';

import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { Comments } from '@/components/Comments';
import { LikeButton } from '@/components/LikeButton';
import { ShareButton } from '@/components/ShareButton';
import { RichTextReadOnly } from '@/components/RichTextReadOnly';
import Image from 'next/image';

interface Like {
  id: string;
  user: {
    id: string;
  };
}

const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
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

export default function PostPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: params.id },
  });

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error.message}</div>;

  const post = data?.post;

  return (
    <article className="max-w-4xl mx-auto py-8 px-4">
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
          />
        </div>
      )}

      <RichTextReadOnly content={post.content} />

      <div className="mt-16">
        <Comments postId={post.id} />
      </div>
    </article>
  );
} 