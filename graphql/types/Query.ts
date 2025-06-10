builder.queryField('search', (t) =>
  t.field({
    type: builder.objectType('SearchResult', {
      fields: (t) => ({
        users: t.field({
          type: ['User'],
          resolve: (parent) => parent.users,
        }),
        posts: t.field({
          type: ['Post'],
          resolve: (parent) => parent.posts,
        }),
      }),
    }),
    args: {
      query: t.arg.string({ required: true }),
    },
    resolve: async (_, { query }, { prisma }) => {
      const [users, posts] = await Promise.all([
        prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { username: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
            avatar: true,
          },
          take: 5,
        }),
        prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { subtitle: { contains: query, mode: 'insensitive' } },
              { content: { contains: query, mode: 'insensitive' } },
            ],
            published: true,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          take: 5,
        }),
      ]);

      return { users, posts };
    },
  })
); 