import { builder } from '../../lib/builder';

builder.prismaObject('Comment', {
  fields: (t) => ({
    id: t.exposeID('id'),
    content: t.exposeString('content'),
    post: t.relation('post'),
    author: t.relation('author', { nullable: true }),
    guestName: t.exposeString('guestName', { nullable: true }),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'DateTime',
    }),
  }),
}); 