'use client';

import { gql, useQuery, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CategoryCombobox } from "@/components/CategoryCombobox";

const GET_POST = gql`
  query GetPost($id: String!) {
    post(id: $id) {
      id
      title
      subtitle
      content
      image
      published
      category {
        id
        name
      }
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
    $subtitle: String
    $content: String!
    $image: String
    $published: Boolean
    $categoryId: String!
  ) {
    updatePost(
      id: $id
      title: $title
      subtitle: $subtitle
      content: $content
      image: $image
      published: $published
      categoryId: $categoryId
    ) {
      id
      category {
        id
        name
      }
    }
  }
`;

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  
  const { data, loading: queryLoading, error: queryError } = useQuery(GET_POST, {
    variables: { id: params.id },
  });
  
  const [updatePost, { loading: mutationLoading }] = useMutation(UPDATE_POST_MUTATION);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  useEffect(() => {
    // Redirect if not authenticated
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    // Redirect if not the author
    if (data?.post && session?.user?.id && data.post.author.id !== session.user.id) {
      toast.error('You are not authorized to edit this post');
      router.push('/dashboard');
      return;
    }

    if (data?.post) {
      setValue('title', data.post.title);
      setValue('subtitle', data.post.subtitle);
      setValue('published', data.post.published);
      setValue('categoryId', data.post.category.id);
      setContent(data.post.content);
      setImage(data.post.image || '');
    }
  }, [data, session, status, router, setValue]);

  const onSubmit = async (formData: any) => {
    try {
      const result = await updatePost({
        variables: {
          id: params.id,
          title: formData.title,
          subtitle: formData.subtitle,
          content: content,
          image: image || null,
          published: Boolean(formData.published),
          categoryId: formData.categoryId,
        },
      });

      if (result.data?.updatePost) {
        toast.success('Post updated successfully');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update post');
    }
  };

  if (status === 'loading' || queryLoading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  if (queryError) {
    return <div className="alert alert-error">{queryError.message}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Post</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Featured Image (optional)</Label>
            <ImageUpload
              value={image}
              onChange={setImage}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle (optional)</Label>
            <Input
              id="subtitle"
              {...register('subtitle')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <CategoryCombobox
              value={watch('categoryId')}
              onChange={(value) => setValue('categoryId', value)}
            />
            {errors.categoryId && (
              <p className="text-red-500 text-sm">{errors.categoryId.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Write your post content here..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="published"
              {...register('published')}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutationLoading}
          >
            {mutationLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 