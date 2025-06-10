import { builder } from '@/lib/builder';
import type { Context } from '@/lib/types';

builder.mutationField('followUser', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      userId: t.arg.string({ required: true }),
    },
    resolve: async (_, { userId }, ctx: Context) => {
      if (!ctx.userId) throw new Error('Not authenticated');
      if (ctx.userId === userId) throw new Error('Cannot follow yourself');

      const existingFollow = await ctx.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: ctx.userId,
            followingId: userId,
          },
        },
      });

      if (existingFollow) {
        await ctx.prisma.follow.delete({
          where: {
            followerId_followingId: {
              followerId: ctx.userId,
              followingId: userId,
            },
          },
        });
        return false;
      }

      await ctx.prisma.follow.create({
        data: {
          followerId: ctx.userId,
          followingId: userId,
        },
      });
      return true;
    },
  })
); 