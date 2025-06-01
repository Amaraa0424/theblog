'use client';

import { gql } from '@apollo/client';
import { getClient } from '@/lib/apollo-client';
import { PostForm } from '@/components/PostForm';

const GET_POST = gql`
  query GetPost($id: ID!) {
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

export default async function EditPostPage({ params }) {
  const { data } = await getClient().query({
    query: GET_POST,
    variables: { id: params.id },
  });

  if (!data?.post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      <PostForm post={data.post} />
    </div>
  );
} 