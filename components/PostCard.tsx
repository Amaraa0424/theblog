'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { PostMenu } from './PostMenu';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Eye, Calendar, User } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    subtitle?: string | null;
    content: string;
    image?: string | null;
    createdAt: string;
    viewCount: number;
    likes: {
      id: string;
      user: {
        id: string;
      };
    }[];
    author: {
      id: string;
      name: string;
    };
  };
}

export function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession();
  const isLiked = post.likes.some(like => like.user.id === session?.user?.id);
  const likesCount = post.likes.length;

  // Extract first paragraph for excerpt if no subtitle
  const excerpt = post.subtitle || post.content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .split('\n')[0] // Get first paragraph
    .slice(0, 160) + '...'; // Limit length

  return (
    <motion.article
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      className="group relative flex flex-col h-full w-full bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-border/50 hover:border-primary/20"
    >
      <PostMenu post={post} />
      
      <Link href={`/posts/${post.id}`}>
        {post.image ? (
          <motion.div 
            className="relative w-full aspect-video overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Floating stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-3 right-3 flex gap-2"
            >
              <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                <Eye className="w-3 h-3" />
                <span>{post.viewCount}</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="relative w-full aspect-video bg-gradient-to-br from-muted/50 to-muted/30">
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-sm">No image</span>
              </div>
            </div>
          </div>
        )}
      </Link>
      
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <Link 
          href={`/posts/${post.id}`} 
          className="flex-1 block space-y-3 hover:cursor-pointer overflow-hidden"
        >
          <motion.h2 
            className="text-xl sm:text-2xl font-bold leading-tight tracking-tight hover:text-primary transition-colors line-clamp-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            {post.title}
          </motion.h2>
          
          <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
        </Link>

        <motion.div 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mt-4 pt-4 border-t border-border/50"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
        >
          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{post.author.name}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), 'MMM d')}
              </time>
            </div>
            
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{post.viewCount}</span>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <LikeButton 
              postId={post.id} 
              initialLikes={likesCount}
              initialLiked={isLiked}
            />
            <ShareButton postId={post.id} title={post.title} />
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}