'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { MoreVertical, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const DELETE_POST = gql`
  mutation DeletePost($id: String!) {
    deletePost(id: $id) {
      id
    }
  }
`;

interface PostMenuProps {
  post: {
    id: string;
    author: {
      id: string;
    };
  };
}

export function PostMenu({ post }: PostMenuProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [deletePost, { loading }] = useMutation(DELETE_POST, {
    onCompleted: () => {
      toast.success('Post deleted successfully');
      router.refresh();
    },
    onError: () => {
      toast.error('Failed to delete post');
    },
  });

  // Only show menu if user is the author
  if (!session?.user?.id || session.user.id !== post.author.id) {
    return null;
  }

  const handleEdit = () => {
    router.push(`/posts/${post.id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost({ variables: { id: post.id } });
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div className="absolute top-2 right-2 z-10">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-black/30 hover:bg-black/50 cursor-pointer hover:text-white text-white rounded-full"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleEdit} disabled={loading}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={loading}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 