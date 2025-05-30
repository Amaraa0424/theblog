'use client';

import { gql, useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/RichTextEditor';

const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      id
      title
      content
      published
      author {
        id
      }
    }
  }
`;

const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost(
    $id: String!
    $title: String!
    $content: String!
    $published: Boolean
  ) {
    updatePost(
      id: $id
      title: $title
      content: $content
      published: $published
    ) {
      id
    }
  }
`;

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState('');
  const { data, loading: queryLoading, error: queryError } = useQuery(GET_POST, {
    variables: { id: params.id },
  });
  const [updatePost, { loading: mutationLoading }] = useMutation(UPDATE_POST_MUTATION);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
      return;
    }

    if (data?.post) {
      setValue('title', data.post.title);
      setValue('published', data.post.published);
      setContent(data.post.content);
    }
  }, [data, router, setValue]);

  if (queryLoading) return <div className="loading loading-spinner loading-lg"></div>;
  if (queryError) return <div className="alert alert-error">{queryError.message}</div>;

  const onSubmit = async (formData: any) => {
    try {
      const result = await updatePost({
        variables: {
          id: params.id,
          title: formData.title,
          content: content,
          published: formData.published,
        },
      });

      if (result.data?.updatePost) {
        toast.success('Post updated successfully');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error updating post:', err);
      toast.error('Failed to update post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="input input-bordered w-full"
          />
          {errors.title && (
            <label className="label">
              <span className="label-text-alt text-error">
                {errors.title.message as string}
              </span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Content</span>
          </label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your post content here..."
          />
        </div>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Published</span>
            <input
              type="checkbox"
              {...register('published')}
              className="checkbox"
            />
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${mutationLoading ? 'loading' : ''}`}
            disabled={mutationLoading}
          >
            Update Post
          </button>
        </div>
      </form>
    </div>
  );
} 