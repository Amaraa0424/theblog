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
import { Menu, BookOpen, LayoutDashboard, PlusCircle, LogIn, UserPlus, Home } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SearchInput } from "@/components/SearchInput";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  const NavItems = () => (
    <>
      <Link href="/">
        <Button variant="ghost" className="w-full justify-start">
          <Home className="h-4 w-4 mr-2" />
          Home
        </Button>
      </Link>
      <Link href="/posts">
        <Button variant="ghost" className="w-full justify-start">
          <BookOpen className="h-4 w-4 mr-2" />
          Posts
        </Button>
      </Link>
      {session && (
        <>
          <Link href="/profile/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/posts/new">
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 container mx-auto">
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
                <Link href="/" className="flex items-center gap-2 px-2">
                  {mounted && (
                    <Image
                      src={isDark ? "/images/ourlabfun-fordarktheme-transparent.png" : "/images/ourlabfun-forlight-transparent.png"}
                      alt="OurLab.fun Logo"
                      width={120}
                      height={40}
                      className="h-8 w-auto"
                    />
                  )}
                </Link>
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Logo */}
          <Link href="/" className="hidden lg:block">
            <Button variant="link" className="p-2">
              {mounted && (
                <Image
                  src={isDark ? "/images/ourlabfun-fordarktheme-transparent.png" : "/images/ourlabfun-forlight-transparent.png"}
                  alt="OurLab.fun Logo"
                  width={140}
                  height={40}
                  className="h-8 w-auto"
                />
              )}
            </Button>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex ml-4">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <Button variant="link">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/posts">
                  <Button variant="link">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Posts
                  </Button>
                </Link>
              </NavigationMenuItem>
              {session && (
                <>
                  <NavigationMenuItem>
                    <Link href="/profile/dashboard">
                      <Button variant="link">
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link href="/posts/new">
                      <Button variant="link">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Post
                      </Button>
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
                <Button variant="ghost">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
