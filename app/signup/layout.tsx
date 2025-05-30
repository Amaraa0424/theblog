import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign Up - TheBlog",
  description: "Create a new account",
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 