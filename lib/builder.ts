import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@/app/generated/prisma/pothos';
import { prisma } from './prisma';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { Context } from './types';

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  AuthScopes: {
    isAuthed: boolean;
    isAdmin: boolean;
  };
}>({
  plugins: [ScopeAuthPlugin, PrismaPlugin],
  authScopes  : async (context: Context) => {
    try {
      // Log auth context in production
      if (process.env.NODE_ENV === 'production') {
        console.log('Auth context evaluation:', {
          hasUserId: !!context.userId,
          hasHeaders: !!context.headers,
          headerKeys: context.headers ? Object.keys(context.headers) : [],
          prismaConnected: !!context.prisma,
        });
      }

      // Test Prisma connection
      if (process.env.NODE_ENV === 'production') {
        try {
          await context.prisma.$queryRaw`SELECT 1`;
          console.log('Prisma connection test successful');
        } catch (error) {
          console.error('Prisma connection test failed:', error);
        }
      }

      return {
        isAuthed: !!context.userId,
        isAdmin: !!context.isAdmin,
      };
    } catch (error) {
      console.error('Error in auth scopes:', error);
      return {
        isAuthed: false,
        isAdmin: false,
      };
    }
  },
  scopeAuthOptions: {
    unauthorizedError: () => new Error('Not authorized'),
  },
  prisma: {
    client: prisma,
  },
});