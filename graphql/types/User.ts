import { builder } from '@/lib/builder';
import type { Context } from '@/lib/types';
import type { InputFieldBuilder } from '@pothos/core';
import type { PrismaObjectFieldBuilder } from '@pothos/plugin-prisma';

const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
});

type SchemaTypes = {
  Context: Context;
  PrismaTypes: any; // This will be inferred from your Prisma schema
  AuthScopes: {
    isAuthed: boolean;
    isAdmin: boolean;
  };
};

export const User = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    avatar: t.exposeString('avatar', { nullable: true }),
    role: t.exposeString('role'),
    posts: t.relation('posts'),
    comments: t.relation('comments'),
    likes: t.relation('likes'),
    shares: t.relation('shares'),
    sharedWithMe: t.relation('sharedWithMe'),
    createdAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.createdAt,
    }),
    updatedAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.updatedAt,
    }),
  }),
});

export default User; 