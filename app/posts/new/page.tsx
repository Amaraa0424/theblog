'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, Image, Tag, Eye, EyeOff, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  subtitle: z.string().max(200, 'Subtitle must be less than 200 characters').optional(),
  content: z.string().min(1, 'Content is required'),
  image: z.string().min(1, 'Featured image is required'),
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

  const onSubmit = async (values: FormValues) => {
    try {
      await createPost({
        variables: values,
      });
      toast.success('Post created successfully');
      router.push('/profile/dashboard');
    } catch (error) {
      if (error instanceof Error && error.message.includes('verify your email')) {
        toast.error('Please verify your email address before creating posts');
      } else {
        toast.error('Failed to create post');
      }
    }
  };

  const watchedValues = form.watch();

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/profile/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <PenTool className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">
              Create New Post
            </h1>
            <p className="text-muted-foreground">
              Share your thoughts and ideas with the world
            </p>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5" />
                    Post Content
                  </CardTitle>
                  <CardDescription>
                    Write your post title, subtitle, and content
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Title *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter an engaging title for your post..." 
                            className="text-lg h-12 border-2 focus:border-primary/50"
                            {...field} 
                          />
                        </FormControl>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <FormMessage />
                          <span>{field.value?.length || 0}/100</span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Subtitle</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Add a brief description or subtitle (optional)..." 
                            className="h-11 border-2 focus:border-primary/50"
                            {...field} 
                          />
                        </FormControl>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <FormMessage />
                          <span>{field.value?.length || 0}/200</span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Content *</FormLabel>
                        <FormControl>
                          <div className="border-2 rounded-lg focus-within:border-primary/50 transition-colors">
                            <RichTextEditor value={field.value} onChange={field.onChange} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Featured Image */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Featured Image
                  </CardTitle>
                  <CardDescription>
                    Upload a compelling image for your post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Category
                  </CardTitle>
                  <CardDescription>
                    Choose a category for your post
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
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
                </CardContent>
              </Card>

              {/* Publishing Options */}
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    {watchedValues.published ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    Publishing
                  </CardTitle>
                  <CardDescription>
                    Control when your post goes live
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center space-x-3 p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          </FormControl>
                          <div className="flex-1">
                            <FormLabel className="text-base font-medium cursor-pointer">
                              Publish immediately
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Make this post visible to everyone right away
                            </p>
                          </div>
                          <Badge variant={field.value ? "default" : "secondary"}>
                            {field.value ? "Public" : "Draft"}
                          </Badge>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="h-5 w-5 mr-2" />
                  {loading ? 'Creating Post...' : 'Create Post'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.back()}
                  className="w-full h-11 border-2 hover:bg-muted/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
} 