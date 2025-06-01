import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
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
  authScopes: async (context) => ({
    isAuthed: !!context.userId,
    isAdmin: !!context.isAdmin,
  }),
  scopeAuthOptions: {
    unauthorizedError: () => new Error('Not authorized'),
  },
  prisma: {
    client: prisma,
  },
});