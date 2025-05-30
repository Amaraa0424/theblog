'use client';

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/RichTextEditor';

const CREATE_POST_MUTATION = gql`
  mutation CreatePost($title: String!, $content: String!, $published: Boolean) {
    createPost(title: $title, content: $content, published: $published) {
      id
    }
  }
`;

export default function NewPost() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login');
    }
  }, [router]);

  const onSubmit = async (data: any) => {
    try {
      const result = await createPost({
        variables: {
          title: data.title,
          content: content,
          published: data.published,
        },
      });

      if (result.data?.createPost) {
        toast.success('Post created successfully');
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error creating post:', err);
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            {...register('title', { required: 'Title is required' })}
            className="input input-bordered w-full"
            placeholder="Enter your post title"
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
            <span className="label-text">Publish immediately</span>
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
            className={`btn btn-primary ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            Create Post
          </button>
        </div>
      </form>
    </div>
  );
} 