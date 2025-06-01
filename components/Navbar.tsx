"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { UserNav } from "./UserNav";
import { useSession } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <Button variant="link" className="text-xl font-bold">
                  TheBlog
                </Button>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/posts" legacyBehavior passHref>
                <Button variant="link">Posts</Button>
              </Link>
            </NavigationMenuItem>
            {session && (
              <NavigationMenuItem>
                <Link href="/posts/new" legacyBehavior passHref>
                  <Button variant="link">New Post</Button>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : session ? (
            <UserNav />
          ) : (
            <>
              <Link href="/login" legacyBehavior passHref>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register" legacyBehavior passHref>
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
