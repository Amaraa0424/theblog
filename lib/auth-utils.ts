import { verify, sign } from 'jsonwebtoken';
import { hash, verify as argonVerify } from 'argon2';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return argonVerify(hashedPassword, password);
}

export function generateToken(payload: Record<string, unknown>): string {
  return sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
}

export function verifyToken(token: string): Record<string, unknown> | null {
  try {
    return verify(token, process.env.JWT_SECRET || 'secret') as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateResetToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  });
}

export async function findUserByEmailOrUsername(identifier: string) {
  return prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier },
        { username: identifier },
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
    },
  });
}

export async function createUser(data: {
  email: string;
  username: string;
  password: string;
  name: string;
}) {
  // Validate username format
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(data.username)) {
    throw new Error('Username must be 3-20 characters long and can only contain letters, numbers, and underscores');
  }

  // Check if username is already taken
  const existingUsername = await findUserByUsername(data.username);
  if (existingUsername) {
    throw new Error('Username is already taken');
  }

  // Check if email is already taken
  const existingEmail = await findUserByEmail(data.email);
  if (existingEmail) {
    throw new Error('Email is already registered');
  }

  return prisma.user.create({
    data: {
      ...data,
      password: await hashPassword(data.password),
    },
  });
}

export async function validateCredentials(credentials: {
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
    },
  });

  if (!user) {
    throw new Error('No user found with this email or username');
  }

  const isValid = await verifyPassword(credentials.password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  return user;
} 