import { builder } from '../../lib/builder';

builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    content: t.exposeString('content'),
    published: t.exposeBoolean('published'),
    author: t.relation('author'),
    comments: t.relation('comments'),
    views: t.relation('views'),
    tags: t.relation('tags'),
    shares: t.relation('shares'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
}); 