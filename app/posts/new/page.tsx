'use client';

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/RichTextEditor';
import { ImageUpload } from '@/components/ImageUpload';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $title: String!
    $subtitle: String
    $content: String!
    $image: String
    $published: Boolean
  ) {
    createPost(
      title: $title
      subtitle: $subtitle
      content: $content
      image: $image
      published: $published
    ) {
      id
    }
  }
`;

export default function NewPost() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const onSubmit = async (formData: any) => {
    try {
      if (status === 'unauthenticated') {
        toast.error('You must be logged in to create a post');
        router.push('/login');
        return;
      }

      if (!image && !confirm('Do you want to create the post without an image?')) {
        return;
      }

      const result = await createPost({
        variables: {
          title: formData.title,
          subtitle: formData.subtitle,
          content: content,
          image: image || null,
          published: Boolean(formData.published),
        },
      });

      if (result.data?.createPost) {
        toast.success('Post created successfully');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create post');
    }
  };

  if (status === 'loading') {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>

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
              placeholder="Enter your post title"
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle (optional)</Label>
            <Input
              id="subtitle"
              {...register('subtitle')}
              placeholder="Enter a subtitle (optional)"
            />
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
              onCheckedChange={(checked) => {
                setValue('published', checked);
              }}
            />
            <Label htmlFor="published">Publish immediately</Label>
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
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
} 