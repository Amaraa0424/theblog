import { builder } from '../../lib/builder';

builder.prismaObject('Like', {
  fields: (t) => ({
    id: t.exposeID('id'),
    post: t.relation('post'),
    user: t.relation('user'),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
  }),
}); 