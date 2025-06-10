import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';

interface SearchResult {
  users: {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar: string | null;
  }[];
  posts: {
    id: string;
    title: string;
    subtitle: string | null;
    author: {
      name: string;
      username: string;
      avatar: string | null;
    };
  }[];
}

export function SearchInput() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult>({ users: [], posts: [] });
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedQuery.length < 2) {
        setResults({ users: [], posts: [] });
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: debouncedQuery }),
        });
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchItems();
  }, [debouncedQuery]);

  return (
    <div className="relative w-full max-w-sm" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users and posts..."
          className="pl-8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && (query.length >= 2) && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-[500px] overflow-auto">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="users" className="flex-1">
                Users ({results.users.length})
              </TabsTrigger>
              <TabsTrigger value="posts" className="flex-1">
                Posts ({results.posts.length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="space-y-2 p-4">
              {results.users.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No users found</p>
              ) : (
                results.users.map((user) => (
                  <Button
                    key={user.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push(`/profile/${user.id}`);
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{user.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{user.name}</span>
                      <span className="text-sm text-muted-foreground">@{user.username}</span>
                    </div>
                  </Button>
                ))
              )}
            </TabsContent>
            <TabsContent value="posts" className="space-y-2 p-4">
              {results.posts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center">No posts found</p>
              ) : (
                results.posts.map((post) => (
                  <Button
                    key={post.id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push(`/posts/${post.id}`);
                      setIsOpen(false);
                      setQuery('');
                    }}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{post.title}</span>
                      {post.subtitle && (
                        <span className="text-sm text-muted-foreground">{post.subtitle}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        by {post.author.name} (@{post.author.username})
                      </span>
                    </div>
                  </Button>
                ))
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
} 