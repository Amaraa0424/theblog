"use client";

import { gql, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

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

export function Hero() {
  const { data, loading, error, refetch } =
    useQuery<FeaturedPostsQueryData>(GET_FEATURED_POSTS);

  if (error) {
    const err = error as ErrorResponse;
    toast.error(err.message || "Failed to subscribe to newsletter");
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
    <section className="relative bg-background py-4 sm:py-6 md:py-8">
      <div className="container px-2 sm:px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* Main Featured Post */}
          {loading ? (
            <div className="lg:col-span-2 aspect-[16/9] bg-muted animate-pulse rounded-xl sm:rounded-2xl lg:rounded-3xl" />
          ) : data?.publishedPosts[0] ? (
            <Link
              href={`/posts/${data.publishedPosts[0].id}`}
              className="lg:col-span-2 group relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-muted/5"
            >
              <div className="aspect-[16/9] relative">
                <Image
                  src={
                    data.publishedPosts[0].image || "/images/placeholder.jpg"
                  }
                  alt={data.publishedPosts[0].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 p-4 sm:p-6 lg:p-8 flex flex-col">
                  <div className="flex-1">
                    <span className="inline-flex">
                      <span className="rounded-full bg-white/90 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-black">
                        {data.publishedPosts[0].category.name}
                      </span>
                    </span>
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4 text-white leading-tight tracking-tight">
                      {data.publishedPosts[0].title}
                    </h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/images/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg`}
                          alt={data.publishedPosts[0].author.name}
                          width={24}
                          height={24}
                          className="rounded-full bg-white/20 w-5 h-5 sm:w-6 sm:h-6"
                        />
                        <span className="text-xs sm:text-sm text-white/90">
                          by {data.publishedPosts[0].author.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white gap-2 group-hover:text-primary group-hover:bg-primary-foreground transition-colors hidden sm:inline-flex"
                      >
                        Read article <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : null}

          {/* Secondary Posts */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
            {loading ? (
              <>
                <div className="aspect-[16/9] bg-muted animate-pulse rounded-xl sm:rounded-2xl lg:rounded-3xl" />
                <div className="aspect-[16/9] bg-muted animate-pulse rounded-xl sm:rounded-2xl lg:rounded-3xl" />
              </>
            ) : (
              data?.publishedPosts.slice(1, 3).map((post: Post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl lg:rounded-3xl bg-muted/5"
                >
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={post.image || "/images/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-4 sm:p-6 flex flex-col">
                      <div className="flex-1">
                        <span className="inline-flex">
                          <span className="rounded-full bg-white/90 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-black">
                            {post.category.name}
                          </span>
                        </span>
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white leading-tight">
                          {post.title}
                        </h2>
                        {post.subtitle && (
                          <p className="hidden truncate sm:block text-xs sm:text-sm text-white/90 line-clamp-2 overflow-hidden text-ellipsis">
                            {post.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
