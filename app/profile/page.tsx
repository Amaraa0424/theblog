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
import { ImageUpload } from '@/components/ImageUpload';

const GET_USER = gql`
  query GetUser {
    me {
      id
      name
      email
      avatar
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      email
      avatar
    }
  }
`;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  avatar: z.string().optional(),
});

export default function ProfilePage() {
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
      // Update the session with the new user data
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          name: data.updateProfile.name,
          avatar: data.updateProfile.avatar,
          image: data.updateProfile.avatar, // Set both avatar and image
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
      name: userData?.me?.name || '',
      email: userData?.me?.email || '',
      avatar: userData?.me?.avatar || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProfile({
      variables: {
        input: values,
      },
    });
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-4xl py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <ImageUpload value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={updateLoading}>
            {updateLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 