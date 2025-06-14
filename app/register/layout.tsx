import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your account to start sharing your thoughts and ideas",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 