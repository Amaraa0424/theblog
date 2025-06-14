import { hash, verify } from 'argon2';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { Role } from '@prisma/client';

async function validateCredentials(credentials: {
  identifier: string;
  password: string;
}) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: credentials.identifier },
        { username: credentials.identifier },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      name: true,
      password: true,
      role: true,
      avatar: true,
      emailVerified: true,
    },
  });

  if (!user) {
    throw new Error('No user found with this email or username');
  }

  const isValid = await verify(user.password, credentials.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  return user;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        identifier: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await validateCredentials({
          identifier: credentials.identifier,
          password: credentials.password
        });

        if (!user) {
          throw new Error('Invalid credentials');
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign in
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
        token.role = user.role;
        token.name = user.name;
        token.avatar = user.avatar;
        token.image = user.avatar; // Set image to avatar for compatibility
        token.emailVerified = user.emailVerified;
      }

      if (trigger === 'update') {
        // Fetch fresh user data from database when session is updated
        if (token.id) {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              id: true,
              email: true,
              username: true,
              name: true,
              role: true,
              avatar: true,
              emailVerified: true,
            },
          });

          if (freshUser) {
            token.id = freshUser.id;
            token.email = freshUser.email;
            token.username = freshUser.username;
            token.role = freshUser.role;
            token.name = freshUser.name;
            token.avatar = freshUser.avatar;
            token.image = freshUser.avatar;
            token.emailVerified = freshUser.emailVerified;
          }
        }

        // Also handle any session data passed in
        if (session?.user) {
          return { ...token, ...session.user };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          username: token.username as string,
          name: token.name as string | null,
          role: token.role as Role,
          avatar: token.avatar as string | null,
          image: token.avatar as string | null, // Set image to avatar for compatibility
          emailVerified: token.emailVerified as boolean,
        };
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};

export async function hashPassword(password: string): Promise<string> {
  return hash(password);
} 