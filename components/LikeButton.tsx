'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleLike } from '@/app/actions/post';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  const [optimisticLikeCount, updateOptimisticLikes] = useOptimistic(
    likeCount,
    (state: number, change: number) => state + change
  );

  const [optimisticIsLiked, updateOptimisticIsLiked] = useOptimistic(
    isLiked,
    (state: boolean) => !state
  );

  const handleLike = async () => {
    if (!session?.user) {
      toast.error("Please sign in to like posts");
      signIn();
      return;
    }

    const currentIsLiked = isLiked;
    
    try {
      startTransition(() => {
        // Optimistically update UI
        updateOptimisticLikes(currentIsLiked ? -1 : 1);
        updateOptimisticIsLiked(!currentIsLiked);
      });

      // Perform actual like/unlike action
      const newIsLiked = await toggleLike(postId, session.user.id);
      
      // Update actual state
      setLikeCount(prev => prev + (newIsLiked ? 1 : -1));
      setIsLiked(newIsLiked);
    } catch {
      toast.error('Failed to toggle like');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleLike}
      disabled={isPending}
    >
      <Heart
        className={optimisticIsLiked ? "fill-current text-red-500" : ""}
        size={20}
      />
      <span>{optimisticLikeCount}</span>
    </Button>
  );
} 