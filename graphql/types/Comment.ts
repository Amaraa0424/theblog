import { builder } from '../../lib/builder';

builder.prismaObject('Comment', {
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
      resolve: async (parent, _, { prisma }) => {
        return await prisma.commentLike.count({
          where: { commentId: parent.id },
        });
      },
    }),
  }),
}); 