import { builder } from '../../lib/builder';

const Role = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
});

builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name', { nullable: true }),
    email: t.exposeString('email'),
    avatar: t.exposeString('avatar', { nullable: true }),
    role: t.expose('role', { type: Role }),
    posts: t.relation('posts'),
    comments: t.relation('comments'),
    shares: t.relation('shares'),
    sharedWithMe: t.relation('sharedWithMe'),
    likes: t.relation('likes'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
}); 