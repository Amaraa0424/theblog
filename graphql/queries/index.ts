import { builder } from '../../lib/builder';

builder.queryType({
  fields: (t) => ({
    me: t.prismaField({
      type: 'User',
      authScopes: {
        isAuthed: true,
      },
      resolve: async (query, root, args, ctx) => {
        return ctx.prisma.user.findUniqueOrThrow({
          ...query,
          where: { id: ctx.userId },
        });
      },
    }),

    categories: t.prismaField({
      type: ['Category'],
      resolve: async (query, root, args, ctx) => {
        return ctx.prisma.category.findMany({
          ...query,
          orderBy: { name: 'asc' },
        });
      },
    }),

    posts: t.prismaField({
      type: ['Post'],
      args: {
        take: t.arg.int(),
        skip: t.arg.int(),
        published: t.arg.boolean(),
        categoryId: t.arg.string(),
      },
      resolve: async (query, root, args, ctx) => {
        return ctx.prisma.post.findMany({
          ...query,
          where: {
            published: args.published ?? true,
            categoryId: args.categoryId,
          },
          take: args.take ?? 10,
          skip: args.skip ?? 0,
          orderBy: { createdAt: 'desc' },
        });
      },
    }),

    post: t.prismaField({
      type: 'Post',
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        const post = await ctx.prisma.post.findUnique({
          ...query,
          where: { id: args.id },
        });

        if (!post) {
          throw new Error('Post not found');
        }

        return post;
      },
    }),

    userPosts: t.prismaField({
      type: ['Post'],
      args: {
        categoryId: t.arg.string(),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        return ctx.prisma.post.findMany({
          ...query,
          where: { 
            authorId: ctx.userId,
            categoryId: args.categoryId,
          },
          orderBy: { createdAt: 'desc' },
        });
      },
    }),

    publishedPosts: t.prismaField({
      type: ['Post'],
      args: {
        take: t.arg.int(),
        skip: t.arg.int(),
        categoryId: t.arg.string(),
      },
      resolve: async (query, root, args, ctx) => {
        return ctx.prisma.post.findMany({
          ...query,
          where: { 
            published: true,
            categoryId: args.categoryId,
          },
          take: args.take ?? undefined,
          skip: args.skip ?? 0,
          orderBy: { createdAt: 'desc' },
        });
      },
    }),
  }),
}); 