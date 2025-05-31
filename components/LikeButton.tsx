'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const GET_POST_LIKES = gql`
  query GetPostLikes($postId: String!) {
    post(id: $postId) {
      likes {
        id
        user {
          id
        }
      }
    }
  }
`;

const LIKE_POST = gql`
  mutation LikePost($postId: String!) {
    likePost(postId: $postId) {
      id
    }
  }
`;

const UNLIKE_POST = gql`
  mutation UnlikePost($postId: String!) {
    unlikePost(postId: $postId) {
      id
    }
  }
`;

interface LikeButtonProps {
  postId: string;
}

export function LikeButton({ postId }: LikeButtonProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(false);

  const { data, loading } = useQuery(GET_POST_LIKES, {
    variables: { postId },
  });

  useEffect(() => {
    if (data?.post?.likes && session?.user?.id) {
      setIsLiked(
        data.post.likes.some((like: any) => like.user.id === session.user.id)
      );
    }
  }, [data, session]);

  const [likePost, { loading: liking }] = useMutation(LIKE_POST, {
    refetchQueries: [{ query: GET_POST_LIKES, variables: { postId } }],
  });

  const [unlikePost, { loading: unliking }] = useMutation(UNLIKE_POST, {
    refetchQueries: [{ query: GET_POST_LIKES, variables: { postId } }],
  });

  const handleLikeClick = async () => {
    if (!session) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      if (isLiked) {
        await unlikePost({ variables: { postId } });
        setIsLiked(false);
        toast.success('Post unliked');
      } else {
        await likePost({ variables: { postId } });
        setIsLiked(true);
        toast.success('Post liked');
      }
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const likeCount = data?.post?.likes?.length || 0;
  const isLoading = loading || liking || unliking;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLikeClick}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLiked ? (
        <Heart className="w-5 h-5 fill-current text-red-500" />
      ) : (
        <Heart className="w-5 h-5" />
      )}
      <span>{likeCount}</span>
    </Button>
  );
} 