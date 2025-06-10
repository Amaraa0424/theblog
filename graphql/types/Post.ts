import { builder } from '../../lib/builder';
import { prisma } from '../../lib/prisma';

export const Post = builder.prismaObject('Post', {
  fields: (t) => ({
    id: t.field({
      type: 'ID',
      resolve: (post) => post.id,
    }),
    title: t.field({
      type: 'String',
      resolve: (post) => post.title,
    }),
    subtitle: t.field({
      type: 'String',
      nullable: true,
      resolve: (post) => post.subtitle,
    }),
    content: t.field({
      type: 'String',
      resolve: (post) => post.content,
    }),
    published: t.field({
      type: 'Boolean',
      resolve: (post) => post.published,
    }),
    image: t.field({
      type: 'String',
      nullable: true,
      resolve: (post) => post.image,
    }),
    author: t.relation('author'),
    category: t.relation('category'),
    comments: t.relation('comments'),
    likes: t.relation('likes'),
    views: t.relation('views'),
    viewCount: t.field({
      type: 'Int',
      resolve: async (post) => {
        const count = await prisma.view.count({
          where: { postId: post.id },
        });
        return count;
      },
    }),
    shares: t.relation('shares'),
    tags: t.relation('tags'),
    createdAt: t.field({
      type: 'Date',
      resolve: (post) => post.createdAt,
    }),
    updatedAt: t.field({
      type: 'Date',
      resolve: (post) => post.updatedAt,
    }),
  }),
});

export default Post; 