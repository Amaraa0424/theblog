'use client';

import { useState, useOptimistic, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toggleCommentLike } from '@/app/actions/post';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

interface CommentLikeButtonProps {
  commentId: string;
  initialLikes: number;
  initialLiked: boolean;
}

export function CommentLikeButton({ commentId, initialLikes, initialLiked }: CommentLikeButtonProps) {
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
      toast.error("Please sign in to like comments");
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
      const newIsLiked = await toggleCommentLike(commentId, session.user.id);
      
      // Update actual state
      setLikeCount(prev => prev + (newIsLiked ? 1 : -1));
      setIsLiked(newIsLiked);
    } catch (error: unknown) {
      // Revert optimistic update on error
      startTransition(() => {
        updateOptimisticLikes(currentIsLiked ? 1 : -1);
        updateOptimisticIsLiked(currentIsLiked);
      });
      toast.error("Failed to update like");
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 h-auto p-1"
      onClick={handleLike}
      disabled={isPending}
    >
      <Heart
        className={optimisticIsLiked ? "fill-current text-red-500" : ""}
        size={14}
      />
      <span className="text-xs">{optimisticLikeCount}</span>
    </Button>
  );
} 