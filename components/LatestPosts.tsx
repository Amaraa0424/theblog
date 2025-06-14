'use client';

import { gql, useQuery } from '@apollo/client';
import { PostCard } from '@/components/PostCard';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Users } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
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
}

interface PublishedPostsQueryData {
  publishedPosts: Post[];
}

interface ErrorResponse {
  message: string;
}

const GET_PUBLISHED_POSTS = gql`
  query GetPublishedPosts {
    publishedPosts(orderBy: { createdAt: desc }) {
      id
      title
      subtitle
      content
      image
      createdAt
      viewCount
      likes {
        id
        user {
          id
        }
      }
      author {
        id
        name
      }
    }
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const statsVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      delay: 0.2,
    },
  },
};

export function LatestPosts() {
  const { data, loading, error } = useQuery<PublishedPostsQueryData>(GET_PUBLISHED_POSTS);

  if (loading) {
    return (
      <section className="bg-gradient-to-b from-muted/30 to-background py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="h-8 bg-muted animate-pulse rounded-lg w-64 mx-auto mb-4" />
            <div className="h-4 bg-muted animate-pulse rounded-lg w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    const err = error as ErrorResponse;
    toast.error(err.message || "Failed to load posts");
    return <div className="alert alert-error">{err.message}</div>;
  }

  return (
    <section className="relative bg-gradient-to-b from-muted/30 to-background py-16 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-10 right-10 w-32 h-32 border border-primary/10 rounded-full"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-10 left-10 w-24 h-24 border border-secondary/10 rounded-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Latest Stories</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            Latest Posts
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Discover the latest thoughts and insights from our community
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={statsVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-2xl font-bold">{data?.publishedPosts.length || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground">Posts</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-secondary mb-1">
                <Users className="w-4 h-4" />
                <span className="text-2xl font-bold">
                  {new Set(data?.publishedPosts.map(p => p.author.id)).size || 0}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Authors</p>
            </div>
          </motion.div>
        </motion.div>

        {data?.publishedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-muted-foreground mb-2">No posts yet</h3>
            <p className="text-muted-foreground">
              Check back later for new content.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <Carousel
              opts={{
                align: "start",
                slidesToScroll: 1,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {data?.publishedPosts.map((post: Post, index: number) => (
                  <CarouselItem 
                    key={post.id} 
                    className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <motion.div
                      variants={itemVariants}
                      whileHover={{ 
                        y: -5,
                        transition: { duration: 0.2 }
                      }}
                      className="h-full"
                    >
                      <PostCard post={post} />
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <CarouselPrevious className="hover:scale-110 transition-transform" />
                <CarouselNext className="hover:scale-110 transition-transform" />
              </motion.div>
            </Carousel>
          </motion.div>
        )}
      </div>
    </section>
  );
}