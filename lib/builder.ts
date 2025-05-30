import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import ValidationPlugin from '@pothos/plugin-validation';
import { DateTimeResolver } from 'graphql-scalars';
import { prisma } from './prisma';

export type Context = {
  prisma: typeof prisma;
  userId?: string;
  isAdmin?: boolean;
};

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  Context: Context;
  Scalars: {
    DateTime: {
      Input: Date;
      Output: Date;
    };
  };
  AuthScopes: {
    isAuthed: boolean;
    isAdmin: boolean;
  };
}>({
  plugins: [PrismaPlugin, ScopeAuthPlugin, ValidationPlugin],
  prisma: {
    client: prisma,
  },
  authScopes: async (context) => ({
    isAuthed: !!context.userId,
    isAdmin: !!context.isAdmin,
  }),
  scopeAuthOptions: {
    unauthorizedError: (parent, context, info, result) => {
      return new Error('Not authenticated');
    },
  },
});

builder.addScalarType('DateTime', DateTimeResolver, {}); 