'use client';

import { gql, useMutation, useQuery } from '@apollo/client';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CategoryCombobox } from "@/components/CategoryCombobox";

const CREATE_POST_MUTATION = gql`
  mutation CreatePost(
    $title: String!
    $subtitle: String
    $content: String!
    $image: String
    $published: Boolean
    $categoryId: String!
  ) {
    createPost(
      title: $title
      subtitle: $subtitle
      content: $content
      image: $image
      published: $published
      categoryId: $categoryId
    ) {
      id
      title
      subtitle
      content
      image
      published
      createdAt
      author {
        id
        name
      }
      category {
        id
        name
      }
      likes {
        id
        user {
          id
        }
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

export default function NewPost() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isNoImageDialogOpen, setIsNoImageDialogOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<any>(null);
  
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const [createPost, { loading }] = useMutation(CREATE_POST_MUTATION, {
    update(cache, { data: { createPost } }) {
      // Update the userPosts query
      cache.modify({
        fields: {
          userPosts(existingPosts = []) {
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql`
                fragment NewPost on Post {
                  id
                  title
                  subtitle
                  content
                  image
                  published
                  createdAt
                  author {
                    id
                    name
                  }
                  likes {
                    id
                    user {
                      id
                    }
                  }
                }
              `
            });
            return [newPostRef, ...existingPosts];
          },
          posts(existingPosts = []) {
            if (!createPost.published) return existingPosts;
            const newPostRef = cache.writeFragment({
              data: createPost,
              fragment: gql`
                fragment NewPublicPost on Post {
                  id
                  title
                  subtitle
                  content
                  image
                  published
                  createdAt
                  author {
                    id
                    name
                  }
                  likes {
                    id
                    user {
                      id
                    }
                  }
                }
              `
            });
            return [newPostRef, ...existingPosts];
          }
        }
      });
    },
    onCompleted: () => {
      toast.success('Post created successfully');
      router.push('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create post');
    },
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleCreatePost = async (formData: any) => {
    try {
      await createPost({
        variables: {
          title: formData.title,
          subtitle: formData.subtitle,
          content: content,
          image: image || null,
          published: Boolean(formData.published),
          categoryId: formData.categoryId,
        },
      });
    } catch (error: any) {
      console.error('Error creating post:', error);
    }
  };

  const onSubmit = (formData: any) => {
    if (!image) {
      setPendingFormData(formData);
      setIsNoImageDialogOpen(true);
      return;
    }
    handleCreatePost(formData);
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
            <Label>Featured Image</Label>
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

      <AlertDialog open={isNoImageDialogOpen} onOpenChange={setIsNoImageDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Image Selected</AlertDialogTitle>
            <AlertDialogDescription>
              You haven't selected a featured image for your post. Would you like to continue without an image?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsNoImageDialogOpen(false);
                if (pendingFormData) {
                  handleCreatePost(pendingFormData);
                  setPendingFormData(null);
                }
              }}
            >
              Continue Without Image
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 