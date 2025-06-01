'use client';

import { Share } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface ShareButtonProps {
  postId: string;
  title: string;
}

export function ShareButton({ postId, title }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url: `${window.location.origin}/posts/${postId}`,
        });
        toast.success('Post shared successfully');
      } else {
        await navigator.clipboard.writeText(
          `${window.location.origin}/posts/${postId}`
        );
        toast.success('Link copied to clipboard');
      }
    } catch {
      toast.error('Failed to share post');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleShare}
    >
      <Share className="h-4 w-4" />
      Share
    </Button>
  );
} 