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
import { Mail, Lock, Shield, Clock, ArrowLeft, Key, Zap, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/Navbar";

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
  const [step, setStep] = useState<'email' | 'otp' | 'success'>('email');
  const [resendTimer, setResendTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [requestReset, { loading: requestLoading }] = useMutation(REQUEST_PASSWORD_RESET);
  const [verifyOtp, { loading: verifyLoading }] = useMutation(RESET_PASSWORD);

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
      toast.success("Reset code sent to your email! Please check your inbox.");
      setStep('otp');
      setResendTimer(60);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset code";
      
      if (errorMessage.includes('60 seconds')) {
        setResendTimer(60);
        toast.error('Please wait 60 seconds before requesting another code');
      } else {
        toast.error(errorMessage);
      }
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
      toast.success("New reset code sent to your email!");
      setResendTimer(60);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend reset code";
      
      if (errorMessage.includes('60 seconds')) {
        setResendTimer(60);
        toast.error('Please wait 60 seconds before requesting another code');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
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
      toast.success("Password reset successfully!");
      setStep('success');
      // Redirect to login after showing success
      setTimeout(() => {
        router.push('/login?reset=success');
      }, 2000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset password");
    }
  };

  // Success state
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background container mx-auto">
        <Navbar />

        {/* Main Content */}
        <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
                Password Reset!
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Your password has been successfully reset. You can now login with your new password.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Redirecting you to login page...
              </p>
              <Link href="/login">
                <Button className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Continue to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background container mx-auto">
      <Navbar />

      {/* Main Content */}
      <div className="container flex items-center justify-center min-h-[calc(100vh-3.5rem)] py-8">
        <Card className="w-full max-w-md">
          {step === 'email' ? (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                  <Key className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email address and we&apos;ll send you a reset code
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleRequestReset}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We&apos;ll send a 6-digit reset code to this email
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-6">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={requestLoading}
                  >
                    {requestLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Reset Code
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-border"></div>
                      <span className="text-xs text-muted-foreground">Remember your password?</span>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                  <Lock className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-bold">Enter Reset Code</CardTitle>
                <CardDescription>
                  We&apos;ve sent a 6-digit code to {email}
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleVerifyOtp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Reset Code</Label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="text-center text-lg pl-10 tracking-widest font-mono"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4 pt-6">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Reset Password
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || requestLoading}
                      className="w-full"
                    >
                      {resendTimer > 0 ? (
                        <>
                          <Clock className="h-4 w-4 mr-2" />
                          Resend in {resendTimer}s
                        </>
                      ) : requestLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="h-4 w-4 mr-2" />
                          Resend Code
                        </>
                      )}
                    </Button>
                    
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
} 