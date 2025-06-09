'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { gql, useMutation, useQuery } from '@apollo/client';
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
  categoryId: z.string().min(1, 'Category is required'),
  image: z.string().min(1, 'Image is required'),
  published: z.boolean().default(false),
});

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }
  }
`;

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

export default function NewPostPage() {
  const router = useRouter();
  useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const { data: categories } = useQuery(GET_CATEGORIES);

  const [createPost, { loading }] = useMutation(CREATE_POST, {
    update(cache, { data }) {
      if (data?.createPost) {
        // Update the USER_DASHBOARD_DATA cache
        try {
          const existingData = cache.readQuery({
            query: gql`
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
            `,
          });

          if (existingData?.userPosts) {
            // Add the new post to the beginning of the list
            cache.writeQuery({
              query: gql`
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
              `,
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
    onCompleted: (data) => {
      router.push(`/posts/${data.createPost.id}`);
      toast.success('Post created successfully');
    },
    onError: () => {
      toast.error('Failed to create post');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      content: '',
      categoryId: '',
      image: '',
      published: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createPost({
      variables: {
        title: values.title,
        subtitle: values.subtitle || null,
        content: values.content,
        categoryId: values.categoryId,
        image: values.image || null,
        published: values.published,
      },
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtitle (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="A brief description of your post" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <RichTextEditor content={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategoryCombobox
                    categories={categories?.categories || []}
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
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
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Published
                  </FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Make this post visible to the public
                  </p>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 