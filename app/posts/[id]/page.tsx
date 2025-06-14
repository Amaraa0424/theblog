import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import { generateSEOMetadata, StructuredData } from '@/components/SEO';
import { PostPageClient } from '@/components/PostPageClient';

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
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
  category?: {
    id: string;
    name: string;
  };
  comments: any[];
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
      updatedAt
      viewCount
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
      category {
        id
        name
      }
      comments {
        id
        content
        createdAt
        parentId
        likesCount
        CommentLike {
          id
          userId
        }
        author {
          id
          name
        }
        replies {
          id
          content
          createdAt
          likesCount
          CommentLike {
            id
            userId
          }
          author {
            id
            name
          }
        }
      }
    }
  }
`;

async function getPost(id: string): Promise<Post | null> {
  try {
    const client = getClient();
    const { data } = await client.query({
      query: GET_POST,
      variables: { id },
      fetchPolicy: 'no-cache',
    });
    
    return data?.post || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPost(params.id);

  if (!post) {
    return {
      title: 'Post Not Found | OurLab.fun',
      description: 'The requested post could not be found.',
    };
  }

  // Extract text content from HTML for description
  const textContent = post.content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 160); // Limit to 160 characters

  const description = post.subtitle || textContent || 'Read this amazing story on OurLab.fun';
  
  const tags = [
    'blog',
    'article',
    post.category?.name.toLowerCase() || 'general',
    ...post.title.toLowerCase().split(' ').slice(0, 3), // First 3 words from title
  ];

  return generateSEOMetadata({
    title: post.title,
    description,
    image: post.image,
    url: `/posts/${post.id}`,
    type: 'article',
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt || post.createdAt,
    author: post.author.name,
    tags,
  });
}

export default async function PostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  if (!post) {
    notFound();
  }

  if (!post.published) {
    notFound();
  }

  // Extract text content for structured data
  const textContent = post.content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const tags = [
    post.category?.name || 'General',
    ...post.title.split(' ').slice(0, 3),
  ];

  return (
    <>
      <StructuredData
        type="article"
        title={post.title}
        description={post.subtitle || textContent.slice(0, 160)}
        image={post.image}
        url={`/posts/${post.id}`}
        publishedTime={post.createdAt}
        modifiedTime={post.updatedAt || post.createdAt}
        author={post.author.name}
        tags={tags}
      />
      <PostPageClient post={post} />
    </>
  );
} 