import { builder } from '@/lib/builder';

export const Follow = builder.prismaObject('Follow', {
  fields: (t) => ({
    id: t.exposeID('id'),
    follower: t.relation('follower'),
    following: t.relation('following'),
    createdAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.createdAt,
    }),
  }),
});

export default Follow; 