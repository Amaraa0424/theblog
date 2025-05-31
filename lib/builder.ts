import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import ValidationPlugin from '@pothos/plugin-validation';
import { DateTimeResolver } from 'graphql-scalars';
import { prisma } from './prisma';
import type PrismaTypes from '../app/generated/prisma/pothos';

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
  authScopes: async (context: Context) => ({
    isAuthed: !!context.userId,
    isAdmin: !!context.isAdmin,
  }),
});

builder.addScalarType('DateTime', DateTimeResolver, {});