'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($input: PasswordResetRequestInput!) {
    requestPasswordReset(input: $input)
  }
`;

const RESET_PASSWORD = gql`
  mutation ResetPassword($input: PasswordResetInput!) {
    resetPassword(input: $input)
  }
`;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [resendTimer, setResendTimer] = useState(0);
  
  const [requestReset] = useMutation(REQUEST_PASSWORD_RESET);
  const [verifyOtp] = useMutation(RESET_PASSWORD);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestReset({
        variables: { 
          input: { email }
        },
      });
      toast.success("OTP sent to your email");
      setStep('otp');
      setResendTimer(60); // Start 60 second timer
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send OTP");
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    try {
      await requestReset({
        variables: { 
          input: { email }
        },
      });
      toast.success("New OTP sent to your email");
      setResendTimer(60); // Reset timer to 60 seconds
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend OTP");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await verifyOtp({
        variables: { 
          input: { 
            token: otp, 
            newPassword 
          }
        },
      });
      toast.success("Password reset successfully");
      router.push('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to verify OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md">
        <form onSubmit={step === 'email' ? handleRequestReset : handleVerifyOtp}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              {step === 'email' 
                ? "Enter your email to receive a reset code" 
                : "Enter the code sent to your email and your new password"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'email' ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="otp">Reset Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter the code sent to your email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="link"
                    className="px-0"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                  >
                    {resendTimer > 0 
                      ? `Resend code in ${resendTimer}s` 
                      : 'Resend code'}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {step === 'email' ? 'Send Reset Code' : 'Reset Password'}
            </Button>
            <div className="text-sm text-center">
              Remember your password?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 