import { builder } from '../../lib/builder';

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    name: t.exposeString('name', { nullable: true }),
    avatar: t.exposeString('avatar', { nullable: true }),
    role: t.expose('role', { type: Role }),
    posts: t.relation('posts'),
    comments: t.relation('comments'),
    shares: t.relation('shares'),
    sharedWithMe: t.relation('sharedWithMe'),
    likes: t.relation('likes'),
    createdAt: t.expose('createdAt', { type: 'Date' }),
    updatedAt: t.expose('updatedAt', { type: 'Date' }),
  }),
});

const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
}); 