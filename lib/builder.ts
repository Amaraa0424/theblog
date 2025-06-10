import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '../app/generated/prisma/pothos';
import { prisma } from './prisma';
import type { Context } from './types';

export const builder = new SchemaBuilder<{
  Context: Context;
  Scalars: {
    Date: { Input: Date; Output: Date };
    DateTime: { Input: Date; Output: Date };
  };
  PrismaTypes: PrismaTypes;
}>({
  plugins: [PrismaPlugin],
  prisma: {
    client: prisma,
  },
});

builder.queryType({});
builder.mutationType({});

export default builder;