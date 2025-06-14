"use client";

import { gql, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, TrendingUp, Eye } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Post {
  id: string;
  title: string;
  subtitle?: string;
  image?: string;
  createdAt: string;
  author: {
    name: string;
    avatar?: string;
  };
  category: {
    id: string;
    name: string;
  };
  _count: {
    likes: number;
  };
}

interface FeaturedPostsQueryData {
  publishedPosts: Post[];
}

interface ErrorResponse {
  message: string;
}

const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts {
    publishedPosts(take: 3, orderBy: { likes: { _count: desc } }) {
      id
      title
      subtitle
      image
      createdAt
      author {
        name
        avatar
      }
      category {
        id
        name
      }
      likes {
        id
        user {
          id
        }
      }
    }
  }
`;

// Animation variants for performance optimization
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export function Hero() {
  const { data, loading, error, refetch } =
    useQuery<FeaturedPostsQueryData>(GET_FEATURED_POSTS);

  if (error) {
    const err = error as ErrorResponse;
    toast.error(err.message || "Failed to load featured posts");
    return (
      <Error
        message={error.message}
        action={{
          label: "Try again",
          onClick: () => refetch(),
        }}
      />
    );
  }

  return (
    <section className="relative bg-gradient-to-br from-background via-background to-muted/20 py-8 sm:py-12 md:py-16 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-2xl"
        />
      </div>

      <div className="container px-4 sm:px-6 mx-auto relative z-10">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20 mb-6"
          >
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Featured Stories</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent"
          >
            Discover Amazing Stories
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Explore the most engaging content from our community of writers and thinkers
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {/* Main Featured Post */}
          {loading ? (
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 animate-pulse rounded-2xl lg:rounded-3xl"
            />
          ) : data?.publishedPosts[0] ? (
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Link
                href={`/posts/${data.publishedPosts[0].id}`}
                className="group relative overflow-hidden rounded-2xl lg:rounded-3xl bg-card shadow-lg hover:shadow-2xl transition-all duration-500 block"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="aspect-[16/9] relative"
                >
                  <Image
                    src={data.publishedPosts[0].image || "/images/placeholder.jpg"}
                    alt={data.publishedPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  
                  {/* Floating Stats */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute top-4 right-4 flex gap-2"
                  >
                    <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                      <Eye className="w-3 h-3" />
                      <span>Featured</span>
                    </div>
                  </motion.div>

                  <div className="absolute inset-0 p-6 lg:p-8 flex flex-col">
                    <div className="flex-1">
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                        className="inline-flex"
                      >
                        <span className="rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-black shadow-lg">
                          {data.publishedPosts[0].category.name}
                        </span>
                      </motion.span>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 text-white leading-tight">
                        {data.publishedPosts[0].title}
                      </h2>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={data.publishedPosts[0].author.avatar || "/images/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg"}
                            alt={data.publishedPosts[0].author.name}
                            width={32}
                            height={32}
                            className="rounded-full border-2 border-white/20"
                          />
                          <div>
                            <p className="text-white font-medium">
                              {data.publishedPosts[0].author.name}
                            </p>
                            <p className="text-white/70 text-sm">
                              {new Date(data.publishedPosts[0].createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 transition-all duration-300"
                          >
                            Read Story <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ) : null}

          {/* Secondary Posts */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-1 grid grid-cols-1 gap-6"
          >
            {loading ? (
              <>
                <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 animate-pulse rounded-2xl" />
                <div className="aspect-[16/9] bg-gradient-to-br from-muted to-muted/50 animate-pulse rounded-2xl" />
              </>
            ) : (
              data?.publishedPosts.slice(1, 3).map((post: Post, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                >
                  <Link
                    href={`/posts/${post.id}`}
                    className="group relative overflow-hidden rounded-2xl bg-card shadow-md hover:shadow-xl transition-all duration-500 block"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                      className="aspect-[16/9] relative"
                    >
                      <Image
                        src={post.image || "/images/placeholder.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                      
                      <div className="absolute inset-0 p-4 flex flex-col">
                        <div className="flex-1">
                          <span className="inline-flex">
                            <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-black">
                              {post.category.name}
                            </span>
                          </span>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold mb-2 text-white leading-tight line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Image
                              src={post.author.avatar || "/images/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg"}
                              alt={post.author.name}
                              width={20}
                              height={20}
                              className="rounded-full"
                            />
                            <span className="text-white/90 text-sm">
                              {post.author.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
