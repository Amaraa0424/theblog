import { builder } from '../../lib/builder';

builder.prismaObject('View', {
  fields: (t) => ({
    id: t.exposeID('id'),
    post: t.relation('post'),
    ipAddress: t.exposeString('ipAddress'),
    userAgent: t.exposeString('userAgent'),
    referrer: t.exposeString('referrer', { nullable: true }),
    timestamp: t.expose('timestamp', {
      type: 'DateTime',
    }),
  }),
}); 