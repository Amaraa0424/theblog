import { builder } from '../../lib/builder';

builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    subtitle: t.exposeString('subtitle', { nullable: true }),
    content: t.exposeString('content'),
    image: t.exposeString('image', { nullable: true }),
    published: t.exposeBoolean('published'),
    author: t.relation('author'),
    category: t.relation('category'),
    comments: t.relation('comments'),
    views: t.relation('views'),
    tags: t.relation('tags'),
    shares: t.relation('shares'),
    likes: t.relation('likes'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
}); 