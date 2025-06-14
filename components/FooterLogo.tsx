"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export function FooterLogo() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  if (!mounted) {
    return (
      <div className="h-16 w-48 bg-muted animate-pulse rounded-lg" />
    );
  }

  return (
    <Link href="/" className="group">
      <div className="relative overflow-hidden rounded-lg p-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg">
        <Image
          src={isDark ? "/images/ourlabfun-fordarktheme-transparent.png" : "/images/ourlabfun-forlight-transparent.png"}
          alt="OurLab.fun Logo"
          width={200}
          height={60}
          className="h-12 w-auto object-contain transition-all duration-300 group-hover:brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
      </div>
    </Link>
  );
} 