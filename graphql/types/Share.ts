import { builder } from '../../lib/builder';

builder.prismaObject('Share', {
  fields: (t) => ({
    id: t.exposeID('id'),
    post: t.relation('post'),
    sharedBy: t.relation('sharedBy'),
    sharedWith: t.relation('sharedWith'),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
  }),
}); 