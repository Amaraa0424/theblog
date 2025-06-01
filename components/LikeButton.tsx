'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useSession } from 'next-auth/react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const TOGGLE_LIKE = gql`
  mutation ToggleLike($postId: String!) {
    toggleLike(postId: $postId) {
      id
      likes {
        id
        user {
          id
        }
      }
    }
  }
`;

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const { data: session } = useSession();
  const [toggleLike] = useMutation(TOGGLE_LIKE, {
    onCompleted: () => {
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
    },
    onError: () => {
      toast.error('Failed to toggle like');
    }
  });

  const handleLike = async () => {
    if (!session) {
      toast.error('Please sign in to like posts');
      return;
    }

    await toggleLike({
      variables: {
        postId,
      },
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleLike}
    >
      <Heart className={cn('h-4 w-4', liked && 'fill-current text-red-500')} />
      {likes}
    </Button>
  );
} 