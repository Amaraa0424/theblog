import { builder } from '@/lib/builder';
import type { Context } from '@/lib/types';

const SearchResultType = builder.objectRef<{
  users: any[];
  posts: any[];
}>('SearchResult');

SearchResultType.implement({
  fields: (t) => ({
    users: t.prismaField({
      type: ['User'],
      resolve: (query, parent) => parent.users,
    }),
    posts: t.prismaField({
      type: ['Post'],
      resolve: (query, parent) => parent.posts,
    }),
  }),
});

builder.queryField('search', (t) =>
  t.field({
    type: SearchResultType,
    args: {
      query: t.arg.string({ required: true }),
    },
    resolve: async (_, { query }, ctx: Context) => {
      const users = await ctx.prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { username: { contains: query, mode: 'insensitive' } },
          ],
          },
          take: 5,
      });

      const posts = await ctx.prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
            published: true,
          },
          take: 5,
      });

      return { users, posts };
    },
  })
); 