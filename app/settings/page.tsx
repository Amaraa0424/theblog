'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, AtSign, Camera, Save, Shield } from 'lucide-react';

const GET_USER = gql`
  query GetUser {
    me {
      id
      name
      email
      username
      avatar
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      username
      avatar
    }
  }
`;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  avatar: z.string().optional(),
});

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });

  const { data: userData, loading: userLoading } = useQuery(GET_USER);

  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE, {
    onCompleted: async (data) => {
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.updateProfile.name,
          avatar: data.updateProfile.avatar,
          image: data.updateProfile.avatar,
        },
      });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      username: '',
      avatar: '',
    },
  });

  // Reset form when userData loads
  useEffect(() => {
    if (userData?.me) {
      form.reset({
        name: userData.me.name || '',
        username: userData.me.username || '',
        avatar: userData.me.avatar || '',
      });
    }
  }, [userData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProfile({
      variables: {
        input: values,
      },
    });
  };

  if (userLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const user = userData?.me;

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and profile information
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={user?.avatar || ''} alt={user?.name || ''} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{user?.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <AtSign className="h-3 w-3" />
                {user?.username}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <Badge variant="secondary" className="text-xs">
                  Verified Account
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Avatar Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <FormLabel className="text-base font-medium">Profile Picture</FormLabel>
                    </div>
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="max-w-xs">
                              <ImageUpload value={field.value} onChange={field.onChange} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Personal Details */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your full name" 
                              className="h-11"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <AtSign className="h-4 w-4" />
                            Username
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Choose a unique username" 
                              className="h-11"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <Input 
                      value={user?.email || ''} 
                      disabled 
                      className="h-11 bg-muted/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={updateLoading}
                      className="h-11 px-8"
                      size="lg"
                    >
                      {updateLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 