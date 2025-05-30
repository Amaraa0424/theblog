'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

export function Comments() {
  const { theme } = useTheme();

  return (
    <Giscus
      id="comments"
      repo="[REPO_OWNER]/[REPO_NAME]" // Replace with your repository
      repoId="[REPO_ID]" // Replace with your repository ID
      category="Announcements" // Replace with your discussion category
      categoryId="[CATEGORY_ID]" // Replace with your category ID
      mapping="pathname"
      term="Welcome to @giscus/react component!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="top"
      theme={theme === 'dark' ? 'dark' : 'light'}
      lang="en"
      loading="lazy"
    />
  );
} 