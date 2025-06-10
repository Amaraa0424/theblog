"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { UserNav } from "./UserNav";
import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchInput } from "@/components/SearchInput";

export function Navbar() {
  const { data: session, status } = useSession();

  const NavItems = () => (
    <>
      <Link href="/posts">
        <Button variant="ghost" className="w-full justify-start">
          Posts
        </Button>
      </Link>
      {session && (
        <>
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link href="/posts/new">
            <Button variant="ghost" className="w-full justify-start">
              New Post
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="container mx-auto sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex flex-col gap-4 py-4">
                <Link href="/" className="text-xl font-bold px-2">
                  TheBlog
                </Link>
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo */}
          <Link href="/" className="text-xl font-bold hidden lg:block">
            <Button variant="link" className="text-xl font-bold">
              TheBlog
            </Button>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex ml-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/posts">
                  <Button variant="link">Posts</Button>
                </Link>
              </NavigationMenuItem>
              {session && (
                <>
                  <NavigationMenuItem>
                    <Link href="/dashboard">
                      <Button variant="link">Dashboard</Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/posts/new">
                      <Button variant="link">New Post</Button>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex-1">
          <SearchInput />
        </div>
        {/* Right side items */}
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : session ? (
            <UserNav />
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
