import { builder } from '../../lib/builder';
import { hashPassword, verifyPassword, generateToken, generateVerificationToken, generateResetToken } from '../../lib/auth';
import { addDays } from 'date-fns';

builder.mutationType({
  fields: (t) => ({
    signup: t.prismaField({
      type: 'User',
      args: {
        email: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
        name: t.arg.string(),
      },
      resolve: async (query, root, args, ctx) => {
        const hashedPassword = await hashPassword(args.password);
        const verificationToken = generateVerificationToken();

        const user = await ctx.prisma.user.create({
          ...query,
          data: {
            email: args.email,
            password: hashedPassword,
            name: args.name,
            verificationToken: {
              create: {
                token: verificationToken,
                expiresAt: addDays(new Date(), 1),
              },
            },
          },
        });

        // Here you would typically send a verification email
        return user;
      },
    }),

    login: t.field({
      type: 'String',
      args: {
        email: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
      },
      resolve: async (root, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: { email: args.email },
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        const isValid = await verifyPassword(args.password, user.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return generateToken(user.id, user.role === 'ADMIN');
      },
    }),

    createPost: t.prismaField({
      type: 'Post',
      args: {
        title: t.arg.string({ required: true }),
        subtitle: t.arg.string(),
        content: t.arg.string({ required: true }),
        image: t.arg.string(),
        published: t.arg.boolean(),
        tagIds: t.arg.stringList(),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        return ctx.prisma.post.create({
          ...query,
          data: {
            title: args.title,
            subtitle: args.subtitle,
            content: args.content,
            image: args.image,
            published: args.published ?? false,
            authorId: ctx.userId,
            tags: args.tagIds ? {
              connect: args.tagIds.map(id => ({ id })),
            } : undefined,
          },
        });
      },
    }),

    updatePost: t.prismaField({
      type: 'Post',
      args: {
        id: t.arg.string({ required: true }),
        title: t.arg.string(),
        subtitle: t.arg.string(),
        content: t.arg.string(),
        image: t.arg.string(),
        published: t.arg.boolean(),
        tagIds: t.arg.stringList(),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        const post = await ctx.prisma.post.findUnique({
          where: { id: args.id },
        });

        if (!post || post.authorId !== ctx.userId) {
          throw new Error('Not authorized');
        }

        return ctx.prisma.post.update({
          ...query,
          where: { id: args.id },
          data: {
            title: args.title,
            subtitle: args.subtitle,
            content: args.content,
            image: args.image,
            published: args.published,
            tags: args.tagIds ? {
              set: args.tagIds.map(id => ({ id })),
            } : undefined,
          },
        });
      },
    }),

    deletePost: t.prismaField({
      type: 'Post',
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        const post = await ctx.prisma.post.findUnique({
          where: { id: args.id },
        });

        if (!post || post.authorId !== ctx.userId) {
          throw new Error('Not authorized');
        }

        return ctx.prisma.post.delete({
          ...query,
          where: { id: args.id },
        });
      },
    }),

    createComment: t.prismaField({
      type: 'Comment',
      args: {
        postId: t.arg.string({ required: true }),
        content: t.arg.string({ required: true }),
        guestName: t.arg.string(),
      },
      resolve: async (query, root, args, ctx) => {
        // If user is authenticated, create comment with author
        if (ctx.userId) {
          return ctx.prisma.comment.create({
            ...query,
            data: {
              content: args.content,
              postId: args.postId,
              authorId: ctx.userId,
            },
          });
        }
        
        // If no user is authenticated, require guestName
        if (!args.guestName) {
          throw new Error('Guest name is required for unauthenticated comments');
        }

        return ctx.prisma.comment.create({
          ...query,
          data: {
            content: args.content,
            postId: args.postId,
            guestName: args.guestName,
          },
        });
      },
    }),

    likePost: t.prismaField({
      type: 'Like',
      args: {
        postId: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        return ctx.prisma.like.create({
          ...query,
          data: {
            postId: args.postId,
            userId: ctx.userId,
          },
        });
      },
    }),

    unlikePost: t.prismaField({
      type: 'Post',
      args: {
        postId: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        await ctx.prisma.like.delete({
          where: {
            postId_userId: {
              postId: args.postId,
              userId: ctx.userId,
            },
          },
        });

        return ctx.prisma.post.findUnique({
          ...query,
          where: { id: args.postId },
        });
      },
    }),

    sharePost: t.prismaField({
      type: 'Share',
      args: {
        postId: t.arg.string({ required: true }),
        sharedWithEmail: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        const sharedWithUser = await ctx.prisma.user.findUnique({
          where: { email: args.sharedWithEmail },
        });

        if (!sharedWithUser) {
          throw new Error('User not found');
        }

        return ctx.prisma.share.create({
          ...query,
          data: {
            postId: args.postId,
            sharedById: ctx.userId,
            sharedWithId: sharedWithUser.id,
          },
        });
      },
    }),
  }),
}); 