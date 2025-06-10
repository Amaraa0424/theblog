import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { prisma } from '@/lib/prisma';
import { schema } from '@/graphql/schema';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export type GraphQLContext = {
  prisma: typeof prisma;
  userId: string | null;
};

const server = new ApolloServer({
  schema,
});

async function createContext(): Promise<GraphQLContext> {
  try {
    // First try to get the session directly
    const session = await getServerSession(authOptions);
    
    if (session?.user?.id) {
      console.log('Session found:', {
        exists: true,
        userId: session.user.id,
        email: session.user.email
      });
      
      return {
        prisma,
        userId: session.user.id,
      };
    }

    // Get headers and cookies
    const headersList = await Promise.resolve(headers());
    const cookieStore = await Promise.resolve(cookies());

    // Try to get the token from authorization header
    const authHeader = headersList.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      console.log('Token from Authorization header:', token);
      
      return {
        prisma,
        userId: token,
      };
    }

    // If no authorization header, try to get the token from next-auth
    const token = await getToken({
      req: {
        headers: {
          ...Object.fromEntries(headersList.entries()),
          cookie: cookieStore.toString(),
        },
      } as any,
      secret: process.env.NEXTAUTH_SECRET,
    });

    console.log('Authentication Details:', {
      hasSession: !!session,
      sessionUserId: session?.user?.id,
      finalUserId: token?.sub || null,
      headers: {
        authorization: authHeader || null,
        cookie: cookieStore.toString(),
      }
    });

    return {
      prisma,
      userId: token?.sub || null,
    };
  } catch (error) {
    console.error('Error in context creation:', error);
    return {
      prisma,
      userId: null,
    };
  }
}

const handler = startServerAndCreateNextHandler(server, {
  context: createContext,
});

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
} 