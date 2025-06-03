import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';

export interface Context {
  prisma: PrismaClient;
  userId?: string;
  isAdmin?: boolean;
  req?: NextRequest;
  headers?: Record<string, string>;
}

export interface Post {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  image?: string;
  published: boolean;
  createdAt: string;
  category: {
    id: string;
    name: string;
  };
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  likes: {
    id: string;
    user: {
      id: string;
    };
  }[];
  viewCount?: number;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface FilterState {
  categoryId?: string;
  sortBy: 'latest' | 'oldest' | 'title';
}
