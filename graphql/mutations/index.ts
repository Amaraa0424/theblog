import { builder } from "@/lib/builder";
import { generateToken } from '../../lib/auth-utils';
import { sendVerificationEmail, sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { GraphQLError } from "graphql";
import { hash, verify } from "argon2";

// Define the input type here where it's used
const UpdateProfileInput = builder.inputType('UpdateProfileInput', {
  fields: (t) => ({
    name: t.string({ required: false }),
    username: t.string({ required: false }),
    avatar: t.string({ required: false }),
    email: t.string({ required: false }),
    currentPassword: t.string({ required: false }),
    newPassword: t.string({ required: false }),
  }),
});

// Define input types
const SignupInput = builder.inputType("SignupInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
    password: t.string({ required: true }),
    username: t.string({ required: true }),
    name: t.string({ required: true }),
  }),
});

const EmailVerificationInput = builder.inputType("EmailVerificationInput", {
  fields: (t) => ({
    token: t.string({ required: true }),
  }),
});

const PasswordResetRequestInput = builder.inputType("PasswordResetRequestInput", {
  fields: (t) => ({
    email: t.string({ required: true }),
  }),
});

const PasswordResetInput = builder.inputType("PasswordResetInput", {
  fields: (t) => ({
    token: t.string({ required: true }),
    newPassword: t.string({ required: true }),
  }),
});

builder.mutationType({
  fields: (t) => ({
    signup: t.prismaField({
      type: 'User',
      args: {
        input: t.arg({ type: SignupInput, required: true }),
      },
      resolve: async (query, _root, { input }) => {
        const existingUser = await prisma.user.findFirst({
          where: {
            OR: [{ email: input.email }, { username: input.username }],
      },
        });

        if (existingUser) {
          throw new GraphQLError(
            "A user with this email or username already exists"
          );
        }

        const hashedPassword = await hash(input.password);
        const user = await prisma.user.create({
          ...query,
          data: {
            email: input.email,
            username: input.username,
            name: input.name,
            password: hashedPassword,
          },
        });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.verificationToken.create({
          data: {
            token: otp,
            type: "SIGNUP",
            userId: user.id,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          },
        });

        await sendVerificationEmail(user.email, otp);

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

        const isValid = await verify(user.password, args.password);
        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        // Get client IP and user agent from headers
        const ipAddress = ctx.headers?.['x-forwarded-for']?.split(',')[0] || 
                         ctx.headers?.['x-real-ip'] || 
                         'unknown';
        const userAgent = ctx.headers?.['user-agent'] || 'unknown';
        const referrer = ctx.headers?.['referer'] || null;

        // Save login attempt
        await ctx.prisma.loginAttempt.create({
          data: {
            userId: user.id,
            ipAddress,
            userAgent,
            referrer,
            success: true
          }
        });

        // Track IP address
        await ctx.prisma.userIpAddress.create({
          data: {
            ipAddress,
            userAgent,
            userId: user.id,
            isGuest: false,
          },
        });

        return generateToken({ id: user.id, isAdmin: user.role === 'ADMIN' });
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

        // Check if user's email is verified
        const user = await ctx.prisma.user.findUnique({
          where: { id: ctx.userId },
          select: { emailVerified: true },
        });

        if (!user?.emailVerified) {
          throw new GraphQLError('Please verify your email address before creating posts');
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
            published: args.published === undefined ? undefined : Boolean(args.published),
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

        // Delete related records first to avoid foreign key constraint violations
        await ctx.prisma.view.deleteMany({
          where: { postId: args.id },
        });

        await ctx.prisma.share.deleteMany({
          where: { postId: args.id },
        });

        await ctx.prisma.postReadingTime.deleteMany({
          where: { postId: args.id },
        });

        // Note: Comments and Likes have onDelete: Cascade in the schema, so they'll be deleted automatically

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
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Authentication required to comment');
        }

        return ctx.prisma.comment.create({
          ...query,
          data: {
            content: args.content,
            postId: args.postId,
            authorId: ctx.userId,
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
        input: t.arg({
          type: UpdateProfileInput,
          required: true,
        }),
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

        const input = args.input;

        // Check for username uniqueness if username is being updated
        if (input.username !== undefined && input.username !== user.username) {
          const existingUser = await ctx.prisma.user.findUnique({
            where: { username: input.username || undefined },
          });
          
          if (existingUser) {
            throw new Error('Username is already taken');
          }
        }

        if (input.newPassword) {
          if (!input.currentPassword) {
            throw new Error('Current password is required to set a new password');
          }

          const isValidPassword = await verify(user.password, input.currentPassword);
          if (!isValidPassword) {
            throw new Error('Current password is incorrect');
          }
        }

        const updateData: Record<string, string | undefined> = {};

        if (input.name !== undefined) updateData.name = input.name || undefined;
        if (input.username !== undefined) updateData.username = input.username || undefined;
        if (input.avatar !== undefined) updateData.avatar = input.avatar || undefined;
        if (input.email !== undefined) updateData.email = input.email || undefined;
        if (input.newPassword) {
          updateData.password = await hash(input.newPassword);
        }

        return ctx.prisma.user.update({
          ...query,
          where: { id: ctx.userId },
          data: updateData,
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

        const isValid = await verify(user.password, args.currentPassword);
        if (!isValid) {
          throw new Error('Current password is incorrect');
        }

        const hashedPassword = await hash(args.newPassword);

        return ctx.prisma.user.update({
          ...query,
          where: { id: ctx.userId },
          data: {
            password: hashedPassword,
          },
        });
      },
    }),

    incrementPostView: t.prismaField({
      type: 'Post',
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, _parent, { id }, ctx) => {
        // Get client IP and user agent from headers
        const ipAddress = ctx.headers?.['x-forwarded-for']?.split(',')[0] || 
                         ctx.headers?.['x-real-ip'] || 
                         'unknown';
        const userAgent = ctx.headers?.['user-agent'] || 'unknown';
        const referrer = ctx.headers?.['referer'] || null;

        try {
          // Create view record
          await ctx.prisma.view.create({
            data: {
              post: { connect: { id } },
              ipAddress,
              userAgent,
              referrer,
            },
          });

          // Track IP address
          const existingRecord = await ctx.prisma.userIpAddress.findFirst({
            where: {
              ipAddress,
              userId: ctx.userId || null,
            },
          });

          if (existingRecord) {
            await ctx.prisma.userIpAddress.update({
              where: { id: existingRecord.id },
              data: {
                lastSeenAt: new Date(),
                userAgent,
              },
            });
          } else {
            await ctx.prisma.userIpAddress.create({
              data: {
                ipAddress,
                userAgent,
                userId: ctx.userId || null,
                isGuest: !ctx.userId,
              },
            });
          }

          // Return updated post
          return ctx.prisma.post.findUniqueOrThrow({
            ...query,
            where: { id },
          });
        } catch (error) {
          console.error('Error incrementing view:', error);
          // Still return the post even if view tracking fails
          return ctx.prisma.post.findUniqueOrThrow({
            ...query,
            where: { id },
          });
        }
      },
    }),

    trackIpAddress: t.prismaField({
      type: 'UserIpAddress',
      args: {
        ipAddress: t.arg.string({ required: true }),
        userAgent: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        const { ipAddress, userAgent } = args;
        const userId = ctx.userId;

        // Find existing record for this IP and user combination
        const existingRecord = await ctx.prisma.userIpAddress.findFirst({
          where: {
            ipAddress,
            userId: userId || null,
          },
        });

        if (existingRecord) {
          // Update lastSeenAt if record exists
          return ctx.prisma.userIpAddress.update({
            ...query,
            where: { id: existingRecord.id },
            data: {
              lastSeenAt: new Date(),
              userAgent, // Update user agent in case it changed
            },
          });
        }

        // Create new record if none exists
        return ctx.prisma.userIpAddress.create({
          ...query,
          data: {
            ipAddress,
            userAgent,
            userId: userId || null,
            isGuest: !userId,
          },
        });
      },
    }),

    toggleFollow: t.prismaField({
      type: 'User',
      args: {
        userId: t.arg.string({ required: true }),
      },
      resolve: async (query, root, args, ctx) => {
        if (!ctx.userId) {
          throw new Error('Not authenticated');
        }

        if (ctx.userId === args.userId) {
          throw new Error('Cannot follow yourself');
        }

        // Check if already following
        const existingFollow = await ctx.prisma.follow.findUnique({
          where: {
            followerId_followingId: {
              followerId: ctx.userId,
              followingId: args.userId,
            },
          },
        });

        if (existingFollow) {
          // Unfollow
          await ctx.prisma.follow.delete({
            where: {
              followerId_followingId: {
                followerId: ctx.userId,
                followingId: args.userId,
              },
            },
          });
        } else {
          // Follow
          await ctx.prisma.follow.create({
            data: {
              followerId: ctx.userId,
              followingId: args.userId,
            },
          });
        }

        return ctx.prisma.user.findUnique({
          ...query,
          where: { id: args.userId },
        });
      },
    }),

    requestEmailVerification: t.boolean({
      resolve: async (_root, _args, ctx) => {
        if (!ctx.userId) {
          throw new GraphQLError("You must be logged in to verify your email");
        }

        const user = await prisma.user.findUnique({
          where: { id: ctx.userId },
        });

        if (!user) {
          throw new GraphQLError("User not found");
        }

        // Check for tokens created within the last 60 seconds (rate limiting)
        const recentToken = await prisma.verificationToken.findFirst({
          where: {
            userId: user.id,
            type: "SIGNUP",
            createdAt: {
              gt: new Date(Date.now() - 60 * 1000), // 60 seconds ago
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (recentToken) {
          throw new GraphQLError("Please wait 60 seconds before requesting another code");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.verificationToken.create({
          data: {
            token: otp,
            type: "SIGNUP",
            userId: user.id,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          },
        });

        await sendVerificationEmail(user.email, otp);

        return true;
      },
    }),

    verifyEmail: t.boolean({
      args: {
        input: t.arg({ type: EmailVerificationInput, required: true }),
      },
      resolve: async (_root, { input }) => {
        const token = await prisma.verificationToken.findFirst({
          where: {
            token: input.token,
            type: "SIGNUP",
            used: false,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!token) {
          throw new GraphQLError("Invalid or expired verification code");
        }

        await Promise.all([
          prisma.verificationToken.update({
            where: { id: token.id },
            data: {
              used: true,
            },
          }),
          prisma.user.update({
            where: { id: token.userId },
            data: {
              emailVerified: true,
            },
          }),
        ]);

        return true;
      },
    }),

    requestPasswordReset: t.boolean({
      args: {
        input: t.arg({ type: PasswordResetRequestInput, required: true }),
      },
      resolve: async (_root, { input }) => {
        const user = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (!user) {
          throw new GraphQLError("No user found with this email");
        }

        // Check for tokens created within the last 60 seconds (rate limiting)
        const recentToken = await prisma.verificationToken.findFirst({
          where: {
            userId: user.id,
            type: "PASSWORD_RESET",
            createdAt: {
              gt: new Date(Date.now() - 60 * 1000), // 60 seconds ago
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (recentToken) {
          throw new GraphQLError("Please wait 60 seconds before requesting another code");
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await prisma.verificationToken.create({
          data: {
            token: otp,
            type: "PASSWORD_RESET",
            userId: user.id,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          },
        });

        await sendPasswordResetEmail(user.email, otp);

        return true;
      },
    }),

    resetPassword: t.boolean({
      args: {
        input: t.arg({ type: PasswordResetInput, required: true }),
      },
      resolve: async (_root, { input }) => {
        const token = await prisma.verificationToken.findFirst({
          where: {
            token: input.token,
            type: "PASSWORD_RESET",
            used: false,
            expiresAt: {
              gt: new Date(),
            },
          },
        });

        if (!token) {
          throw new GraphQLError("Invalid or expired reset code");
        }

        const hashedPassword = await hash(input.newPassword);

        await Promise.all([
          prisma.user.update({
            where: { id: token.userId },
            data: { password: hashedPassword },
          }),
          prisma.verificationToken.update({
            where: { id: token.id },
            data: { used: true },
          }),
        ]);

        return true;
      },
    }),
  }),
}); 