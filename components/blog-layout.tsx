"use client"

import { useState } from "react"
import { gql, useQuery } from "@apollo/client"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {BlogPostCard} from "@/components/blog-post-card"
import {FilterSidebar} from "@/components/filter-sidebar"
import type { FilterState, Post } from "@/lib/types"
import { cn } from "@/lib/utils"  

const GET_FILTERED_POSTS = gql`
  query GetFilteredPosts($categoryId: String, $orderBy: PostOrderByInput) {
    publishedPosts(categoryId: $categoryId, orderBy: $orderBy) {
      id
      title
      subtitle
      content
      image
      published
      createdAt
      category {
        id
        name
      }
      author {
        id
        name
        avatar
      }
      likes {
        id
        user {
          id
        }
      }
    }
  }
`

interface BlogLayoutProps {
  initialPosts: Post[]
}

export function BlogLayout({ initialPosts }: BlogLayoutProps) {
  const [filter, setFilter] = useState<FilterState>({
    sortBy: 'latest',
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data, loading, error } = useQuery<{ publishedPosts: Post[] }>(GET_FILTERED_POSTS, {
    variables: {
      categoryId: filter.categoryId,
      orderBy: {
        [filter.sortBy === 'latest' ? 'createdAt' : filter.sortBy === 'oldest' ? 'createdAt' : 'title']:
          filter.sortBy === 'oldest' ? 'asc' : 'desc',
      },
    },
  })

  const posts = data?.publishedPosts || initialPosts

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button variant="outline" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <aside className={cn(
          "w-full md:w-64 shrink-0",
          "md:block",
          sidebarOpen ? "block" : "hidden"
        )}>
          <FilterSidebar filter={filter} onChange={setFilter} />
        </aside>
        <main className="flex-1">
          {error ? (
            <div className="text-center text-red-500">Error: {error.message}</div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 rounded-lg bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center">
              <h3 className="text-lg font-medium">No posts found</h3>
              <p className="text-muted-foreground mt-1">
                Try changing your filters or check back later for new content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
