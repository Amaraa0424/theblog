"use client";

import { useState, useOptimistic, useTransition, startTransition } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";
import { createComment } from "@/app/actions/post";
import { CommentLikeButton } from "./CommentLikeButton";
import { MessageSquare } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId?: string | null;
  likesCount: number;
  CommentLike: {
    id: string;
    userId: string;
  }[];
  author: {
    id: string;
    name: string;
  };
  replies?: Comment[];
}

interface CommentsProps {
  postId: string;
  initialComments?: Comment[];
}

interface CommentFormData {
  content: string;
}

function CommentComponent({
  comment,
  postId,
  level = 0,
}: {
  comment: Comment;
  postId: string;
  level?: number;
}) {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>();
  const [isPending, startTransition] = useTransition();
  const [replies, setReplies] = useState<Comment[]>(comment.replies || []);
  const [optimisticReplies, addOptimisticReply] = useOptimistic<
    Comment[],
    Comment
  >(replies, (state, newReply) =>
    [...state, newReply].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const onSubmitReply = async (formData: CommentFormData) => {
    if (!session?.user) {
      toast.error("Please sign in to reply");
      return;
    }

    // Create optimistic reply
    const tempReply: Comment = {
      id: Math.random().toString(),
      content: formData.content,
      createdAt: new Date().toISOString(),
      parentId: comment.id,
      likesCount: 0,
      CommentLike: [],
      author: {
        id: session.user.id,
        name: session.user.name || "Anonymous",
      },
    };

    try {
      startTransition(async () => {
        // Add optimistic reply
        addOptimisticReply(tempReply);

        // Create the actual reply
        const result = await createComment(
          postId,
          formData.content,
          session.user.id,
          comment.id
        );

        // Update the replies state with the actual reply
        const actualReply: Comment = {
          id: result.id,
          content: result.content,
          createdAt: result.createdAt.toISOString(),
          parentId: comment.id,
          likesCount: 0,
          CommentLike: [],
          author: {
            id: session.user.id,
            name: result.author.name || "Anonymous",
          },
        };

        setReplies((prevReplies) =>
          [
            ...prevReplies.filter((r) => r.id !== tempReply.id),
            actualReply,
          ].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        );

        setIsReplying(false);
        reset();
      });
    } catch (error) {
      console.error("Failed to add reply:", error);
      toast.error("Failed to add reply");
      // Remove the optimistic reply if there was an error
      setReplies((prevReplies) =>
        prevReplies.filter((r) => r.id !== tempReply.id)
      );
    }
  };

  return (
    <div className={cn("space-y-4", level > 0 && "ml-6")}>
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium text-sm">{comment.author.name}</span>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <p className="text-foreground mb-3">{comment.content}</p>
        <div className="flex items-center gap-2">
          <CommentLikeButton
            commentId={comment.id}
            initialLikes={comment.likesCount}
            initialLiked={comment.CommentLike.some(
              (like) => like.userId === session?.user?.id
            )}
          />
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-auto p-1"
            onClick={() => setIsReplying(!isReplying)}
          >
            <MessageSquare size={14} />
            <span className="text-xs">Reply</span>
          </Button>
        </div>

        {isReplying && (
          <form
            onSubmit={handleSubmit(onSubmitReply)}
            className="mt-4 space-y-4"
          >
            <Textarea
              {...register("content", { required: true })}
              className={cn(errors.content && "border-destructive")}
              placeholder="Write a reply..."
              disabled={isPending}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending ? "Posting..." : "Post Reply"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsReplying(false);
                  reset();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {optimisticReplies.length > 0 && (
        <div className="space-y-4">
          {optimisticReplies.map((reply) => (
            <CommentComponent
              key={reply.id}
              comment={reply}
              postId={postId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Comments({ postId, initialComments = [] }: CommentsProps) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormData>();
  // Sort initial comments by date (newest first) and filter out replies
  const [comments, setComments] = useState<Comment[]>(
    [...initialComments]
      .filter((comment) => !comment.parentId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
  );
  const [isPending] = useTransition();

  const [optimisticComments, addOptimisticComment] = useOptimistic<
    Comment[],
    Comment
  >(comments, (state, newComment) => {
    const updatedComments = [...state, newComment];
    return updatedComments
      .filter((comment) => !comment.parentId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  });

  const onSubmit = async (formData: CommentFormData) => {
    if (!session?.user) {
      toast.error("Please sign in to comment");
      return;
    }

    // Create optimistic comment
    const tempComment: Comment = {
      id: Math.random().toString(),
      content: formData.content,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      CommentLike: [],
      author: {
        id: session.user.id,
        name: session.user.name || "Anonymous",
      },
    };

    startTransition(async () => {
      try {
        addOptimisticComment(tempComment);

        const result = await createComment(
          postId,
          formData.content,
          session.user.id
        );

        // Update both states with the actual comment
        const actualComment: Comment = {
          id: result.id,
          content: result.content,
          createdAt: result.createdAt.toISOString(),
          likesCount: 0,
          CommentLike: [],
          author: {
            id: session.user.id,
            name: result.author.name || "Anonymous",
          },
        };

        setComments((prev) =>
          [...prev.filter((c) => c.id !== tempComment.id), actualComment]
            .filter((comment) => !comment.parentId)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
        );

        reset();
      } catch (error: unknown) {
        console.error("Failed to add comment:", error);
        toast.error("Failed to add comment");
        setComments((prev) =>
          prev.filter((comment) => comment.id !== tempComment.id)
        );
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="border rounded-lg p-6 bg-card">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>

        {!session ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Please sign in to comment</p>
            <Button variant="outline" onClick={() => signIn()} className="mt-2">
              Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="content">Your comment</Label>
              <Textarea
                id="content"
                {...register("content", { required: true })}
                className={cn(errors.content && "border-destructive")}
                disabled={isPending}
              />
              {errors.content && (
                <p className="text-sm text-destructive mt-1">
                  Comment content is required
                </p>
              )}
            </div>
            <Button type="submit" disabled={isPending}>
              Post Comment
            </Button>
          </form>
        )}
      </div>

      <div className="space-y-4">
        {optimisticComments.length > 0 ? (
          optimisticComments.map((comment: Comment) => (
            <CommentComponent
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))
        ) : (
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
}
