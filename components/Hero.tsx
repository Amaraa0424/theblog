"use client";

import { gql, useQuery } from "@apollo/client";
import { Button } from "@/components/ui/button";
import { Error } from "@/components/ui/error";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURED_POSTS = gql`
  query FeaturedPosts {
    publishedPosts(take: 3) {
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
    }
  }
`;

export function Hero() {
  const { data, loading, error, refetch } = useQuery(FEATURED_POSTS);

  if (error) {
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
    <section className="relative bg-background py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Featured Post */}
          {loading ? (
            <div className="lg:col-span-2 aspect-[16/9] bg-muted animate-pulse rounded-3xl" />
          ) : data?.publishedPosts[0] ? (
            <Link
              href={`/posts/${data.publishedPosts[0].id}`}
              className="lg:col-span-2 group relative overflow-hidden rounded-3xl bg-muted/5"
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
                <div className="absolute inset-0 p-8 flex flex-col">
                  <div className="flex-1">
                    <span className="inline-flex">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black">
                        {data.publishedPosts[0].category.name}
                      </span>
                    </span>
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white leading-tight tracking-tight">
                      {data.publishedPosts[0].title}
                    </h1>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/images/307ce493-b254-4b2d-8ba4-d12c080d6651.jpg`}
                          alt={data.publishedPosts[0].author.name}
                          width={24}
                          height={24}
                          className="rounded-full bg-white/20"
                        />
                        <span className="text-sm text-white/90">
                          by {data.publishedPosts[0].author.name}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white gap-2 group-hover:text-primary group-hover:bg-primary-foreground transition-colors"
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
          <div className="lg:col-span-1 grid grid-cols-1 gap-4 lg:gap-6">
            {loading ? (
              <>
                <div className="aspect-[16/9] bg-muted animate-pulse rounded-3xl" />
                <div className="aspect-[16/9] bg-muted animate-pulse rounded-3xl" />
              </>
            ) : (
              data?.publishedPosts.slice(1, 3).map((post: any) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group relative overflow-hidden rounded-3xl bg-muted/5"
                >
                  <div className="aspect-[16/9] relative">
                    <Image
                      src={post.image || "/images/placeholder.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col">
                      <div className="flex-1">
                        <span className="inline-flex">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-black">
                            {post.category.name}
                          </span>
                        </span>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold mb-2 text-white leading-tight">
                          {post.title}
                        </h2>
                        <p className="text-sm text-white/90 line-clamp-2">
                          {post.subtitle}
                        </p>
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
