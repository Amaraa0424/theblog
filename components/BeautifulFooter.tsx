"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Mail,
  ArrowUp,
  Send,
  Sparkles,
  Star,
  Zap,
  Globe,
  Users,
  BookOpen,
  TrendingUp,
  Facebook,
  Home,
  UserPlus,
  LogIn
} from "lucide-react";

export function BeautifulFooter() {
  const { theme, systemTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: "smooth" 
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Newsletter signup:", email);
    setEmail("");
    setIsSubmitting(false);
  };

  // Dynamic links based on authentication status
  const getQuickLinks = () => {
    if (session) {
      // Authenticated user links
      return [
        {
          href: "/posts",
          label: "All Posts",
          icon: BookOpen,
          count: "",
        },
        {
          href: "/posts/new",
          label: "Write Post",
          icon: Zap,
          count: "New",
        },
        {
          href: "/profile/dashboard",
          label: "Dashboard",
          icon: TrendingUp,
          count: "",
        },
        {
          href: "/settings",
          label: "Settings",
          icon: Users,
          count: "",
        },
      ];
    } else {
      // Public/Guest user links
      return [
        {
          href: "/",
          label: "Home",
          icon: Home,
          count: "",
        },
        {
          href: "/posts",
          label: "Browse Posts",
          icon: BookOpen,
          count: "Public",
        },
        {
          href: "/login",
          label: "Login",
          icon: LogIn,
          count: "",
        },
        {
          href: "/signup",
          label: "Join Us",
          icon: UserPlus,
          count: "Free",
        },
      ];
    }
  };

  if (!mounted) {
    return <footer className="h-96 bg-muted animate-pulse" />;
  }

  return (
    <footer className="relative overflow-hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5" />
        
        {/* Subtle radial gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-secondary/10 to-transparent rounded-full blur-3xl opacity-50" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-2 space-y-8">
              <Link href="/" className="group inline-block">
                <div className="relative overflow-hidden rounded-2xl p-6 transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl bg-gradient-to-br from-primary/5 to-secondary/5 backdrop-blur-sm border border-border/50">
                  <Image
                    src={
                      isDark
                        ? "/images/ourlabfun-fordarktheme-transparent.png"
                        : "/images/ourlabfun-forlight-transparent.png"
                    }
                    alt="OurLab.fun Logo"
                    width={220}
                    height={70}
                    className="h-14 w-auto object-contain transition-all duration-500 group-hover:brightness-110 group-hover:drop-shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                </div>
              </Link>
              
              <div className="space-y-4">
                <p className="text-muted-foreground text-xl leading-relaxed max-w-lg font-light">
                  A modern blog platform where{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-semibold">
                    ideas come to life
                  </span>
                  . Share your thoughts, connect with others, and be part of a
                  community that values authentic expression.
                </p>
                
                {/* Real Stats - You can update these with actual numbers */}
                <div className="flex gap-6 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">Growing</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">Active</div>
                    <div className="text-sm text-muted-foreground">Writers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">Engaged</div>
                    <div className="text-sm text-muted-foreground">Community</div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Newsletter Signup */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-foreground">
                      Stay in the Loop
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Get the latest posts and updates
                    </p>
                  </div>
                </div>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex gap-3">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-background/50 border-2 focus:border-primary/50 h-12 rounded-xl backdrop-blur-sm"
                      required
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="px-6 h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Subscribe
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Join our community. No spam, unsubscribe anytime.
                  </p>
                </form>
              </div>
            </div>

            {/* Enhanced Quick Links - Dynamic based on auth status */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" />
                <h3 className="font-bold text-xl text-foreground">
                  {session ? "Quick Links" : "Explore"}
                </h3>
              </div>
              <nav className="space-y-4">
                {getQuickLinks().map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:translate-x-2 hover:shadow-lg backdrop-blur-sm border border-border/50 hover:border-primary/30"
                  >
                    <div className="flex items-center gap-3">
                      <link.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-foreground group-hover:text-primary transition-colors">
                        {link.label}
                      </span>
                    </div>
                    {link.count && (
                      <Badge
                        variant="secondary"
                        className="bg-primary/20 text-primary border-primary/30"
                      >
                        {link.count}
                      </Badge>
                    )}
                  </Link>
                ))}
              </nav>
              
              {/* Additional info for guests */}
              {!session && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">New here?</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Join our community to write posts, connect with others, and share your ideas!
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Contact & Social */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gradient-to-r from-secondary to-primary rounded-full animate-pulse" />
                <h3 className="font-bold text-xl text-foreground">Connect</h3>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-foreground font-medium">
                      info@ourlab.fun
                    </div>
                    <div className="text-muted-foreground text-xs">
                      We&apos;d love to hear from you
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    <Globe className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <div className="text-foreground font-medium">
                      Everywhere & Nowhere
                    </div>
                    <div className="text-muted-foreground text-xs">
                      Remote-first community
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Social Links - Easy to extend */}
              <div className="space-y-4">
                <p className="text-foreground font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Follow Our Journey
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    {
                      icon: Facebook,
                      href: "https://www.facebook.com/ourlab.fun/",
                      label: "Facebook",
                      color: "from-blue-500 to-blue-700",
                      handle: "@ourlab.fun",
                    },
                  ].map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-4 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm border border-border/50 hover:border-primary/30"
                      aria-label={social.label}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 bg-gradient-to-r ${social.color} rounded-lg group-hover:scale-110 transition-transform`}
                        >
                          <social.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="text-foreground text-sm font-medium">
                            {social.label}
                          </div>
                          <div className="text-muted-foreground text-xs">
                            {social.handle}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Separator */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent h-px" />
          <Separator className="opacity-0" />
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Amaraa doesn&apos;t trust social media
              </span>
              <Separator
                orientation="vertical"
                className="h-4 opacity-30 hidden sm:block"
              />
              <span className="flex items-center gap-2">
                Made with{" "}
                <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" />{" "}
                for the community
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <p className="text-muted-foreground text-sm">
                © {new Date().getFullYear()} OurLab.fun. All rights reserved.
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollToTop}
                className="relative rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 hover:scale-110 transition-all duration-300 border border-border/50 hover:border-primary/30 backdrop-blur-sm"
                aria-label="Scroll to top"
              >
                <ArrowUp className="h-4 w-4 text-foreground" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 hover:opacity-20 rounded-full transition-opacity" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
 