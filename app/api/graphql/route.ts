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
      // Get the token from the request
      const token = await getToken({
        req: request as any,
        secret: process.env.NEXTAUTH_SECRET,
      });

      // Log token information in production (remove in actual production)
      if (process.env.NODE_ENV === 'production') {
        console.log('Token:', {
          exists: !!token,
          id: token?.id,
          role: token?.role,
          email: token?.email,
        });
      }

      // If no token is found but we're expecting one, log the headers
      if (!token && process.env.NODE_ENV === 'production') {
        console.log('Headers:', Object.fromEntries(request.headers.entries()));
      }

      const context = {
        prisma,
        userId: token?.id as string | undefined,
        isAdmin: token?.role === 'ADMIN',
        req: request,
        headers: Object.fromEntries(request.headers.entries())
      };

      // Log the context in production (remove in actual production)
      if (process.env.NODE_ENV === 'production') {
        console.log('GraphQL Context:', {
          hasUserId: !!context.userId,
          isAdmin: context.isAdmin,
        });
      }

      return context;
    } catch (error) {
      // Log the full error in production
      console.error('Error in GraphQL context creation:', {
        error,
        headers: Object.fromEntries(request.headers.entries()),
        url: request.url,
      });

      // Return a context without authentication
      return {
        prisma,
        userId: undefined,
        isAdmin: false,
        req: request,
        headers: Object.fromEntries(request.headers.entries())
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