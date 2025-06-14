'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RichTextEditor } from '@/components/RichTextEditor';
import { CategoryCombobox } from '@/components/CategoryCombobox';
import { ImageUpload } from '@/components/ImageUpload';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Image is required'),
  categoryId: z.string().min(1, 'Category is required'),
  published: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

interface Post {
  id: string;
  title: string;
  subtitle: string | null;
  content: string;
  image: string | null;
  published: boolean;
  createdAt: string;
  viewCount: number;
  author: {
    id: string;
    name: string;
  };
  category: {
    id: string;
    name: string;
  };
  likes: Array<{
    id: string;
    user: {
      id: string;
    };
  }>;
  comments: Array<{
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
    };
    parentId: string | null;
  }>;
  shares: Array<{
    id: string;
    createdAt: string;
    sharedWith: {
      name: string;
    };
  }>;
}

const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $subtitle: String
    $content: String!
    $categoryId: String!
    $image: String
    $published: Boolean
  ) {
    createPost(
      title: $title
      subtitle: $subtitle
      content: $content
      categoryId: $categoryId
      image: $image
      published: $published
    ) {
      id
      title
      subtitle
      content
      image
      published
      createdAt
      viewCount
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
      comments {
        id
        content
        createdAt
        author {
          id
          name
        }
        parentId
      }
      shares {
        id
        createdAt
        sharedWith {
          name
        }
      }
    }
  }
`;

const USER_DASHBOARD_DATA = gql`
  query UserDashboardData {
    userPosts {
      id
      title
      subtitle
      content
      image
      published
      createdAt
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
      comments {
        id
        content
        createdAt
        author {
          id
          name
        }
        parentId
      }
      shares {
        id
        createdAt
        sharedWith {
          name
        }
      }
    }
  }
`;

export default function NewPostPage() {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      subtitle: '',
      content: '',
      image: '',
      categoryId: '',
      published: false,
    },
  });

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    update(cache, { data }) {
      if (data?.createPost) {
        try {
          const existingData = cache.readQuery<{ userPosts: Post[] }>({
            query: USER_DASHBOARD_DATA,
          });

          if (existingData?.userPosts) {
            cache.writeQuery({
              query: USER_DASHBOARD_DATA,
              data: {
                userPosts: [data.createPost, ...existingData.userPosts],
              },
            });
          }
        } catch (error) {
          console.log('Cache update failed, but post was created successfully:', error);
        }
      }
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await createPost({
        variables: values,
      });
      toast.success('Post created successfully');
      router.push('/');
    } catch {
      toast.error('Failed to create post');
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-8">
          <FormField
            control={form.control as any}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle</FormLabel>
                <FormControl>
                  <Input placeholder="Enter post subtitle" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryCombobox
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="published"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Publish immediately</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading}>
            Create Post
          </Button>
        </form>
      </Form>
    </div>
  );
} 