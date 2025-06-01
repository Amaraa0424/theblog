'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { gql, useMutation, useQuery } from '@apollo/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const GET_COMMENTS = gql`
  query GetComments($postId: ID!) {
    post(id: $postId) {
      comments {
        id
        content
        createdAt
        guestName
        author {
          name
        }
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($postId: String!, $content: String!, $guestName: String) {
    createComment(postId: $postId, content: $content, guestName: $guestName) {
      id
      content
      author {
        name
      }
      guestName
      createdAt
    }
  }
`;

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  guestName?: string;
  author?: {
    name: string;
  };
}

interface CommentsQueryData {
  post: {
    comments: Comment[];
  };
}

interface CreateCommentMutationData {
  createComment: Comment;
}

interface ErrorResponse {
  message: string;
}

interface CommentsProps {
  postId: string;
}

interface CommentFormData {
  content: string;
  guestName?: string;
}

export function Comments({ postId }: CommentsProps) {
  const { data: session } = useSession();
  const [isGuest, setIsGuest] = useState(!session);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormData>();
  
  const { data, loading: loadingComments } = useQuery<CommentsQueryData>(GET_COMMENTS, {
    variables: { postId },
  });

  const [createComment, { loading: submitting }] = useMutation<CreateCommentMutationData>(CREATE_COMMENT, {
    refetchQueries: [{ query: GET_COMMENTS, variables: { postId } }],
  });

  const onSubmit = async (formData: CommentFormData) => {
    try {
      await createComment({
        variables: {
          postId,
          content: formData.content,
          guestName: isGuest ? formData.guestName : undefined,
        },
      });
      reset();
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.message || "Failed to add comment");
    }
  };

  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {isGuest && (
            <div>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-2 border rounded"
                {...register('guestName', { required: isGuest })}
              />
              {errors.guestName && (
                <p className="text-red-500 text-sm mt-1">Name is required for guests</p>
              )}
            </div>
          )}
          
          <div>
            <textarea
              placeholder="Write a comment..."
              className="w-full p-2 border rounded min-h-[100px]"
              {...register('content', { required: true })}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">Comment cannot be empty</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            {!session && (
              <button
                type="button"
                onClick={() => setIsGuest(!isGuest)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isGuest ? 'Sign in to comment' : 'Continue as guest'}
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {loadingComments ? (
          <p className="text-muted-foreground">Loading comments...</p>
        ) : data?.post?.comments?.length > 0 ? (
          data.post.comments.map((comment: Comment) => (
            <div key={comment.id} className="border rounded-lg p-4 bg-card">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium">
                  {comment.author?.name || comment.guestName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-foreground">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
} 