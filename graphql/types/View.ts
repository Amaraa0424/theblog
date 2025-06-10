import { builder } from '../../lib/builder';

export const View = builder.prismaObject('View', {
  fields: (t) => ({
    id: t.exposeID('id'),
    post: t.relation('post'),
    ipAddress: t.exposeString('ipAddress'),
    userAgent: t.exposeString('userAgent'),
    referrer: t.exposeString('referrer', { nullable: true }),
    timestamp: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.timestamp,
    }),
  }),
});

export default View; 