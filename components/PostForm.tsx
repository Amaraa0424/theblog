'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryCombobox } from '@/components/CategoryCombobox';
import { RichTextEditor } from '@/components/RichTextEditor';

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

interface PostFormProps {
  post: Post;
}

const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost(
    $id: ID!
    $title: String!
    $content: String!
    $published: Boolean!
    $categoryId: ID!
  ) {
    updatePost(
      id: $id
      title: $title
      content: $content
      published: $published
      categoryId: $categoryId
    ) {
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

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post.content);
  const [updatePost, { loading: mutationLoading }] = useMutation(UPDATE_POST_MUTATION);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      title: post.title,
      published: post.published,
      categoryId: post.category.id,
    },
  });

  const onSubmit = async (formData: {
    title: string;
    published: boolean;
    categoryId: string;
  }) => {
    try {
      const result = await updatePost({
        variables: {
          id: post.id,
          title: formData.title,
          content,
          published: Boolean(formData.published),
          categoryId: formData.categoryId,
        },
      });

      if (result.data?.updatePost) {
        toast.success('Post updated successfully');
        router.push('/dashboard');
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update post');
      } else {
        toast.error('Failed to update post');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...register('title', { required: 'Title is required' })}
            className={errors.title ? 'border-red-500' : ''}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">Category</Label>
          <CategoryCombobox
            value={watch('categoryId')}
            onChange={(value) => setValue('categoryId', value)}
          />
          {errors.categoryId && (
            <p className="text-red-500 text-sm">{errors.categoryId.message}</p>
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
  );
} 