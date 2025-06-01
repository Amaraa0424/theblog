'use client';

import { gql, useQuery } from '@apollo/client';
import { PostForm } from '@/components/PostForm';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  category: {
    id: string;
    name: string;
  };
}

interface PostData {
  post: Post;
}

const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      id
      title
      content
      published
      category {
        id
        name
      }
    }
  }
`;

export function EditPostContent({ id }: { id: string }) {
  const { loading, error, data } = useQuery<PostData>(GET_POST, {
    variables: { id },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.post) return <div>Post not found</div>;

  return <PostForm post={data.post} />;
} 