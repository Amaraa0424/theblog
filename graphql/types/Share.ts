import { builder } from '../../lib/builder';

export const Share = builder.prismaObject('Share', {
  fields: (t) => ({
    id: t.exposeID('id'),
    post: t.relation('post'),
    sharedBy: t.relation('sharedBy'),
    sharedWith: t.relation('sharedWith'),
    createdAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.createdAt,
    }),
  }),
});

export default Share; 