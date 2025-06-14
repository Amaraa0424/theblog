"use client";

import { Hero } from '@/components/Hero';
import { LatestPosts } from '@/components/LatestPosts';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  duration: 0.5
};

export default function HomePage() {
  return (
    <motion.main
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen"
    >
      <Hero />
      <LatestPosts />
    </motion.main>
  );
}
