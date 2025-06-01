import { verify, sign } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { prisma } from './prisma';

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return compare(password, hashedPassword);
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

export async function createUser(data: {
  email: string;
  password: string;
  name: string;
}) {
  return prisma.user.create({
    data: {
      ...data,
      password: await hashPassword(data.password),
    },
  });
}

export async function validateCredentials(credentials: {
  email: string;
  password: string;
}) {
  const user = await findUserByEmail(credentials.email);
  if (!user) {
    throw new Error('No user found with this email');
  }

  const isValid = await verifyPassword(credentials.password, user.password);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  return user;
} 