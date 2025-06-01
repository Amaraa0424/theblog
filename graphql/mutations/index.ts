import { builder } from '../../lib/builder';
import { hashPassword, verifyPassword, generateToken, generateVerificationToken, generateResetToken } from '../../lib/auth-utils';
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
        categoryId: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        return ctx.prisma.post.create({
          ...query,
          data: {
            title: args.title,
            subtitle: args.subtitle || null,
            content: args.content,
            image: args.image || null,
            published: args.published || false,
            authorId: ctx.userId,
            categoryId: args.categoryId,
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
        categoryId: t.arg.string(),
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
            title: args.title || undefined,
            subtitle: args.subtitle || undefined,
            content: args.content || undefined,
            image: args.image || undefined,
            published: args.published || undefined,
            categoryId: args.categoryId || undefined,
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

    toggleLike: t.prismaField({
      type: 'Post',
      args: {
        postId: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        // Check if the user has already liked the post
        const existingLike = await ctx.prisma.like.findUnique({
          where: {
            postId_userId: {
              postId: args.postId,
              userId: ctx.userId,
            },
          },
        });

        if (existingLike) {
          // Unlike if already liked
          await ctx.prisma.like.delete({
            where: {
              postId_userId: {
                postId: args.postId,
                userId: ctx.userId,
              },
            },
          });
        } else {
          // Like if not already liked
          await ctx.prisma.like.create({
            data: {
              postId: args.postId,
              userId: ctx.userId,
            },
          });
        }

        // Return the updated post
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

    createCategory: t.prismaField({
      type: 'Category',
      args: {
        name: t.arg.string({ required: true }),
        description: t.arg.string(),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        // Check if a category with the same name already exists
        const existingCategory = await ctx.prisma.category.findFirst({
          where: { name: args.name },
        });

        if (existingCategory) {
          throw new Error('A category with this name already exists');
        }

        return ctx.prisma.category.create({
          ...query,
          data: {
            name: args.name,
            description: args.description || null,
          },
        });
      },
    }),

    updateProfile: t.prismaField({
      type: 'User',
      args: {
        name: t.arg.string(),
        avatar: t.arg.string(),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        return ctx.prisma.user.update({
          ...query,
          where: { id: ctx.userId },
          data: {
            name: args.name || undefined,
            avatar: args.avatar || undefined,
          },
        });
      },
    }),

    updatePassword: t.prismaField({
      type: 'User',
      args: {
        currentPassword: t.arg.string({ required: true }),
        newPassword: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.userId },
        });

        if (!user) {
          throw new Error('User not found');
        }

        const isValid = await verifyPassword(args.currentPassword, user.password);
        if (!isValid) {
          throw new Error('Current password is incorrect');
        }

        const hashedPassword = await hashPassword(args.newPassword);

        return ctx.prisma.user.update({
          ...query,
          where: { id: ctx.userId },
          data: {
            password: hashedPassword,
          },
        });
      },
    }),
  }),
}); 