import { builder } from '../../lib/builder';

builder.prismaObject('Session', {
  fields: (t) => ({
    id: t.exposeID('id'),
    user: t.relation('user'),
    token: t.exposeString('token'),
    expiresAt: t.expose('expiresAt', {
      type: 'DateTime',
    }),
    createdAt: t.expose('createdAt', {
      type: 'DateTime',
    }),
    updatedAt: t.expose('updatedAt', {
      type: 'DateTime',
    }),
  }),
}); 