import 'next-auth';
import { Role } from '@prisma/client';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    username: string;
    name?: string | null;
    role: Role;
    avatar?: string | null;
    image?: string | null;
    emailVerified: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name?: string | null;
      role: Role;
      avatar?: string | null;
      image?: string | null;
      emailVerified: boolean;
    }
  }
} 