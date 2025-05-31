import { createYoga } from 'graphql-yoga';
import { schema } from '@/graphql/schema';
import { cookies } from 'next/headers';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Request: Request, Response: Response },
  context: async ({ request }: { request: NextRequest }) => {
    try {
      const token = await getToken({
        req: request as any,
        secret: process.env.NEXTAUTH_SECRET,
      });

      return {
        prisma,
        userId: token?.id as string | undefined,
        isAdmin: token?.role === 'ADMIN',
      };
    } catch (error) {
      console.error('Error getting token:', error);
    return {
      prisma,
        userId: undefined,
        isAdmin: false,
    };
    }
  },
});

export async function GET(request: NextRequest, context: any) {
  return handleRequest(request, context);
}

export async function POST(request: NextRequest, context: any) {
  return handleRequest(request, context);
} 