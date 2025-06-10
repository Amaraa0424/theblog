builder.mutationField('followUser', (t) =>
  t.field({
    type: 'Boolean',
    args: {
      userId: t.arg.string({ required: true }),
    },
    authScopes: {
      isAuthed: true,
    },
    resolve: async (_, { userId }, { prisma, user }) => {
      if (!user) throw new Error('Not authenticated');
      if (user.id === userId) throw new Error('Cannot follow yourself');

      const existingFollow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: userId,
          },
        },
      });

      if (existingFollow) {
        await prisma.follow.delete({
          where: {
            followerId_followingId: {
              followerId: user.id,
              followingId: userId,
            },
          },
        });
        return false;
      }

      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: userId,
        },
      });
      return true;
    },
  })
); 