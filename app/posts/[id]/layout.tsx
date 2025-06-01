import type { Metadata } from 'next';
import { gql } from '@apollo/client';
import { getClient } from '@/lib/apollo-server';

const GET_POST_METADATA = gql`
  query GetPostMetadata($id: String!) {
    post(id: $id) {
      title
      subtitle
      content
      image
      createdAt
      author {
        name
      }
    }
  }
`;

interface Props {
  params: {
    id: string;
  };
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getClient().query({
    query: GET_POST_METADATA,
    variables: { id: params.id }
  });

  const post = data.post;
  const description = post.subtitle || post.content.replace(/<[^>]*>/g, '').slice(0, 200) + '...';

  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: 'article',
      authors: [post.author.name],
      publishedTime: post.createdAt,
      images: post.image ? [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : undefined
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: description,
      images: post.image ? [post.image] : undefined
    }
  };
}

export default function PostLayout({ children }: Props) {
  return children;
} 