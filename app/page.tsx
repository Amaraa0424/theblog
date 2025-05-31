"use client";

import { Hero } from "@/components/Hero";
import { LatestPosts } from "@/components/LatestPosts";

export default function Home() {
  return (
    <main>
      <Hero />
      <LatestPosts />
    </main>
  );
}
