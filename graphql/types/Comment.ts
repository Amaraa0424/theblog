import { builder } from '../../lib/builder';
import type { PrismaClient } from '@prisma/client';
import type { PrismaModelTypes } from '@pothos/plugin-prisma';

export const Comment = builder.prismaObject('Comment', {
  fields: (t) => ({
    id: t.exposeID('id'),
    content: t.exposeString('content'),
    author: t.relation('author'),
    post: t.relation('post'),
    parentId: t.exposeString('parentId', { nullable: true }),
    parent: t.relation('Comment', { nullable: true }),
    replies: t.relation('other_Comment'),
    CommentLike: t.relation('CommentLike'),
    mentionedUsers: t.relation('User_UserMentions'),
    createdAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.createdAt,
    }),
    updatedAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.updatedAt,
    }),
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

export default Comment; 