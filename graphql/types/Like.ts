import { builder } from '../../lib/builder';

export const Like = builder.prismaObject('Like', {
  fields: (t) => ({
    id: t.exposeID('id'),
    post: t.relation('post'),
    user: t.relation('user'),
    createdAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.createdAt,
    }),
  }),
});

export default Like; 