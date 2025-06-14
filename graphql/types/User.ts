import { builder } from '@/lib/builder';
import { Role } from '@prisma/client';

const RoleEnum = builder.enumType('Role', {
  values: ['USER', 'ADMIN'] as const,
});

const UserCount = builder.objectRef<{
  posts: number;
  followers: number;
  following: number;
}>('UserCount').implement({
  fields: (t) => ({
    posts: t.exposeInt('posts'),
    followers: t.exposeInt('followers'),
    following: t.exposeInt('following'),
  }),
});

export const User = builder.prismaObject('User', {
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    username: t.string({
      resolve: (parent) => parent.username,
      nullable: false,
    }),
    name: t.exposeString('name', { nullable: true }),
    avatar: t.exposeString('avatar', { nullable: true }),
    emailVerified: t.exposeBoolean('emailVerified'),
    role: t.field({
      type: RoleEnum,
      resolve: (parent) => parent.role as Role,
    }),
    posts: t.relation('posts'),
    comments: t.relation('comments'),
    likes: t.relation('likes'),
    shares: t.relation('shares'),
    sharedWithMe: t.relation('sharedWithMe'),
    followers: t.relation('followers'),
    following: t.relation('following'),
    isFollowing: t.boolean({
      resolve: async (user, _, ctx) => {
        if (!ctx.userId) return false;
        if (user.id === ctx.userId) return false;

        const follow = await ctx.prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: ctx.userId,
              followingId: user.id,
            },
          },
        });

        return !!follow;
      },
    }),
    _count: t.field({
      type: UserCount,
      resolve: async (user, _, { prisma }) => {
        type CountResult = { count: string }[];

        const [postsCount, followersCount, followingCount] = await Promise.all([
          prisma.post.count({
            where: { authorId: user.id, published: true },
          }),
          prisma.$queryRaw<CountResult>`
            SELECT COUNT(*) as count
            FROM "Follow"
            WHERE "followingId" = ${user.id}
          `,
          prisma.$queryRaw<CountResult>`
            SELECT COUNT(*) as count
            FROM "Follow"
            WHERE "followerId" = ${user.id}
          `,
        ]);

        return {
          posts: postsCount,
          followers: Number(followersCount[0].count),
          following: Number(followingCount[0].count),
        };
      },
    }),
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

export default User; 