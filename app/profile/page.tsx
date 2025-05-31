'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  mutation UpdateProfile($name: String, $avatar: String) {
    updateProfile(name: $name, avatar: $avatar) {
      id
      name
      avatar
    }
  }
`;

const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      id
    }
  }
`;

interface ProfileFormData {
  name: string;
  avatar?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [avatar, setAvatar] = useState('');

  const { data, loading: queryLoading } = useQuery(GET_USER);
  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);
  const [updatePassword, { loading: passwordLoading }] = useMutation(UPDATE_PASSWORD);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    setValue: setProfileValue,
  } = useForm<ProfileFormData>();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    watch,
    reset: resetPassword,
  } = useForm<PasswordFormData>();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (data?.me) {
      setProfileValue('name', data.me.name);
      setAvatar(data.me.avatar || '');
    }
  }, [data, status, router, setProfileValue]);

  const onProfileSubmit = async (formData: ProfileFormData) => {
    try {
      await updateProfile({
        variables: {
          name: formData.name,
          avatar: avatar || null,
        },
      });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async (formData: PasswordFormData) => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await updatePassword({
        variables: {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
      });
      toast.success('Password updated successfully');
      resetPassword();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  if (status === 'loading' || queryLoading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your profile details and avatar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Picture</Label>
                <ImageUpload
                  value={avatar}
                  onChange={setAvatar}
                  className="h-40 w-40 mx-auto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  {...registerProfile('name', { required: 'Name is required' })}
                />
                {profileErrors.name && (
                  <p className="text-sm text-red-500">{profileErrors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={data?.me?.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              <Button type="submit" disabled={updateLoading}>
                {updateLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  {...registerPassword('currentPassword', {
                    required: 'Current password is required',
                  })}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  {...registerPassword('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...registerPassword('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === watch('newPassword') || 'Passwords do not match',
                  })}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button type="submit" disabled={passwordLoading}>
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 