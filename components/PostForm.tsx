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
import { ImageUpload } from '@/components/ImageUpload';

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  published: boolean;
  image?: string;
  category: {
    id: string;
    name: string;
  };
}

interface PostFormProps {
  post: Post;
}

interface FormValues {
  title: string;
  subtitle: string;
  published: boolean;
  categoryId: string;
  image: string;
}

const UPDATE_POST_MUTATION = gql`
  mutation UpdatePost(
    $id: String!
    $title: String!
    $subtitle: String
    $content: String!
    $published: Boolean!
    $categoryId: String!
    $image: String
  ) {
    updatePost(
      id: $id
      title: $title
      subtitle: $subtitle
      content: $content
      published: $published
      categoryId: $categoryId
      image: $image
    ) {
      id
      title
      subtitle
      content
      published
      image
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
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      title: post.title,
      subtitle: post.subtitle || '',
      published: post.published,
      categoryId: post.category.id,
      image: post.image || '',
    },
  });

  const onSubmit = async (formData: {
    title: string;
    subtitle?: string;
    published: boolean;
    categoryId: string;
    image?: string;
  }) => {
    try {
      const result = await updatePost({
        variables: {
          id: post.id,
          title: formData.title,
          subtitle: formData.subtitle || null,
          content,
          published: Boolean(formData.published),
          categoryId: formData.categoryId,
          image: formData.image || null,
        },
      });

      if (result.data?.updatePost) {
        toast.success('Post updated successfully');
        router.push('/');
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
          <Label htmlFor="subtitle">Subtitle (Optional)</Label>
          <Input
            id="subtitle"
            {...register('subtitle')}
            placeholder="A brief description of your post"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Featured Image</Label>
          <ImageUpload
            value={watch('image')}
            onChange={(url) => setValue('image', url)}
          />
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
            value={content}
            onChange={setContent}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="published"
            checked={watch('published')}
            onCheckedChange={(checked: boolean) => setValue('published', checked)}
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