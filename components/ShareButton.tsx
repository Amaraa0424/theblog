'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { gql, useMutation } from '@apollo/client';
import { Share } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const SHARE_POST = gql`
  mutation SharePost($postId: String!, $sharedWithEmail: String!) {
    sharePost(postId: $postId, sharedWithEmail: $sharedWithEmail) {
      id
    }
  }
`;

interface ShareButtonProps {
  postId: string;
  title: string;
}

export function ShareButton({ postId, title }: ShareButtonProps) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');

  const [sharePost, { loading }] = useMutation(SHARE_POST);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error('Please sign in to share posts');
      return;
    }

    try {
      await sharePost({
        variables: {
          postId,
          sharedWithEmail: email,
        },
      });
      toast.success('Post shared successfully');
      setIsOpen(false);
      setEmail('');
    } catch (error) {
      toast.error('Failed to share post');
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/posts/${postId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Share className="w-5 h-5" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
          <DialogDescription>
            Share "{title}" with other users or copy the link
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <form onSubmit={handleShare} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Share with user</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading || !email}>
              {loading ? 'Sharing...' : 'Share'}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleCopyLink}
          >
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 