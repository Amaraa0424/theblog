import { builder } from '../../lib/builder';
import type { PrismaClient } from '@prisma/client';

builder.prismaObject('Comment', {
    // @ts-expect-error - This is a workaround to fix the type error
  fields: (t) => ({
    id: t.exposeID('id'),
    content: t.exposeString('content'),
    post: t.relation('post'),
    author: t.relation('author'),
    parentId: t.exposeString('parentId', { nullable: true }),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'DateTime',
    }),
    replies: t.relation('other_Comment'),
    CommentLike: t.relation('CommentLike'),
    likesCount: t.field({
      type: 'Int',
      nullable: true,
      resolve: async (
        parent: { id: string },
        _args: unknown,
        { prisma }: { prisma: PrismaClient }
      ) => {
        try {
          return await prisma.commentLike.count({
            where: { commentId: parent.id },
          });
        } catch (error) {
          console.error('Error fetching comment likes count:', {
            commentId: parent.id,
            error: error instanceof Error ? error.message : String(error),
          });
          return null; // Return null instead of failing the entire query
        }
      },
    }),
  }),
}); 