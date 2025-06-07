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

builder.prismaObject('User', {
  // @ts-expect-error - Pothos infers types correctly here
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    avatar: t.exposeString('avatar', { nullable: true }),
    role: t.expose('role', { type: Role }),
    posts: t.relation('posts'),
    comments: t.relation('comments'),
    shares: t.relation('shares'),
    sharedWithMe: t.relation('sharedWithMe'),
    likes: t.relation('likes'),
    commentLikes: t.relation('CommentLike'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
  }),
});

// Input type for updating user profile
builder.inputType('UpdateProfileInput', {
  fields: (t) => ({
    name: t.string({ required: false }),
    avatar: t.string({ required: false }),
    email: t.string({ required: false }),
    currentPassword: t.string({ required: false }),
    newPassword: t.string({ required: false }),
  }),
}); 