import { builder } from '../../lib/builder';

builder.prismaObject('CommentLike', {
  fields: (t) => ({
    id: t.exposeString('id'),
    commentId: t.exposeString('commentId'),
    userId: t.exposeString('userId'),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
    Comment: t.relation('Comment'),
    User: t.relation('User'),
  }),
}); 