'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      id
      email
      username
      name
    }
  }
`;

const VERIFY_EMAIL = gql`
  mutation VerifyEmail($input: EmailVerificationInput!) {
    verifyEmail(input: $input)
  }
`;

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });
  const [step, setStep] = useState<'form' | 'verify'>('form');
  
  const [signup, { loading: signupLoading }] = useMutation(SIGNUP_MUTATION);
  const [verifyEmail, { loading: verifyLoading }] = useMutation(VERIFY_EMAIL);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const { data } = await signup({
        variables: { 
          input: {
            email: formData.email,
            password: formData.password,
            username: formData.username,
            name: formData.name,
          }
        },
      });
      
      if (data?.signup) {
        toast.success("Account created! Please check your email for verification code.");
        setStep('verify');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create account";
      
      if (errorMessage.includes("email or username already exists")) {
        toast.error(
          <div>
            An account with this email or username already exists.{" "}
            <Link href="/login" className="underline font-medium">
              Sign in instead
            </Link>
          </div>
        );
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await verifyEmail({
        variables: {
          input: {
            token: formData.otp,
          },
        },
      });

      toast.success("Email verified successfully! You can now log in.");
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify email");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md">
        <form onSubmit={step === 'form' ? handleSubmit : handleVerifyEmail}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
            <CardDescription>
              {step === 'form' 
                ? "Enter your details below to create your account"
                : "Enter the verification code sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'form' ? (
              <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter the 6-digit code sent to your email"
                  required
                  value={formData.otp}
                  onChange={handleChange}
                />
                <p className="text-sm text-muted-foreground">
                  Check your email for a 6-digit verification code.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full"
              disabled={signupLoading || verifyLoading}
            >
              {step === 'form' 
                ? (signupLoading ? "Creating Account..." : "Create Account")
                : (verifyLoading ? "Verifying..." : "Verify Email")
              }
            </Button>
            {step === 'form' && (
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Sign in
                </Link>
              </div>
            )}
            {step === 'verify' && (
              <div className="text-center">
                <Button
                  type="button"
                  variant="link"
                  className="px-0"
                  onClick={() => setStep('form')}
                >
                  Back to form
                </Button>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 