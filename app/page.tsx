"use client";

import { Hero } from '@/components/Hero';
import { LatestPosts } from '@/components/LatestPosts';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LatestPosts />
    </main>
  );
}
