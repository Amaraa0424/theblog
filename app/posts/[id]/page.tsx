'use client';

import { gql, useQuery } from '@apollo/client';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Comments } from '@/components/Comments';

const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      id
      title
      content
      published
      createdAt
      author {
        id
        name
      }
    }
  }
`;

export default function PostPage() {
  const params = useParams();
  const { data, loading, error } = useQuery(GET_POST, {
    variables: { id: params.id },
  });

  if (loading) return <div className="loading loading-spinner loading-lg"></div>;
  if (error) return <div className="alert alert-error">{error.message}</div>;

  const post = data?.post;

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-muted-foreground">
          <span>By {post.author.name}</span>
          <span className="mx-2">•</span>
          <time dateTime={post.createdAt}>
            {format(new Date(post.createdAt), 'MMMM d, yyyy')}
          </time>
        </div>
      </header>

      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-16">
        <Comments />
      </div>
    </article>
  );
} 