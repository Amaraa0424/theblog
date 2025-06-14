"use client"
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export function FollowButton({ userId, isFollowing: initialIsFollowing }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      setIsFollowing(!isFollowing);
      toast(
        isFollowing ? 'Unfollowed' : 'Following',
        {
        description: isFollowing ? 'You are no longer following this user' : 'You are now following this user',
        }
      );
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update follow status',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? 'secondary' : 'default'}
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  );
} 