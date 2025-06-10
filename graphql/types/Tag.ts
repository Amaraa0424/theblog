import { builder } from '../../lib/builder';

export const Tag = builder.prismaObject('Tag', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    posts: t.relation('posts'),
    createdAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.createdAt,
    }),
    updatedAt: t.field({
      type: 'DateTime',
      resolve: (parent) => parent.updatedAt,
    }),
  }),
});

export default Tag; 