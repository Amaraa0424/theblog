'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, ArrowLeft, Clock, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from "@/components/Navbar";

const VERIFY_EMAIL = gql`
  mutation VerifyEmail($input: EmailVerificationInput!) {
    verifyEmail(input: $input)
  }
`;

const REQUEST_EMAIL_VERIFICATION = gql`
  mutation RequestEmailVerification {
    requestEmailVerification
  }
`;

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const codeFromUrl = searchParams.get('code');
  
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [autoVerifying, setAutoVerifying] = useState(false);
  
  const [verifyEmail, { loading: verifyLoading }] = useMutation(VERIFY_EMAIL);
  const [requestVerification, { loading: requestLoading }] = useMutation(REQUEST_EMAIL_VERIFICATION);

  // Auto-fill OTP from URL and optionally auto-verify
  useEffect(() => {
    if (codeFromUrl && codeFromUrl.length === 6) {
      setOtp(codeFromUrl);
      // Auto-verify after a short delay to show the user what's happening
      setAutoVerifying(true);
      const timer = setTimeout(() => {
        handleVerifyEmail(null, codeFromUrl);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [codeFromUrl]);

  // Initialize countdown from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('verificationCountdown');
    if (stored) {
      const { timestamp, duration } = JSON.parse(stored);
      const elapsed = Math.floor((Date.now() - timestamp) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        localStorage.removeItem('verificationCountdown');
      }
    }
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            localStorage.removeItem('verificationCountdown');
          }
          return newValue;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyEmail = async (e: React.FormEvent | null, codeToVerify?: string) => {
    if (e) e.preventDefault();
    
    const verificationCode = codeToVerify || otp.trim();
    
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      setAutoVerifying(false);
      return;
    }

    try {
      await verifyEmail({
        variables: {
          input: {
            token: verificationCode,
          },
        },
      });

      setIsVerified(true);
      setAutoVerifying(false);
      toast.success('Email verified successfully!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 2000);
    } catch (error) {
      setAutoVerifying(false);
      toast.error(error instanceof Error ? error.message : 'Failed to verify email');
    }
  };

  const handleResendCode = async () => {
    try {
      await requestVerification();
      toast.success('New verification code sent to your email!');
      
      // Start 60-second countdown and store in localStorage
      const timestamp = Date.now();
      setCountdown(60);
      localStorage.setItem('verificationCountdown', JSON.stringify({
        timestamp,
        duration: 60
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification code';
      
      // Check if it's a rate limit error
      if (errorMessage.includes('60 seconds')) {
        // Start countdown even on rate limit error
        const timestamp = Date.now();
        setCountdown(60);
        localStorage.setItem('verificationCountdown', JSON.stringify({
          timestamp,
          duration: 60
        }));
        toast.error('Please wait 60 seconds before requesting another code');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const isResendDisabled = requestLoading || countdown > 0;

  if (isVerified) {
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
                Email Verified!
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Your email has been successfully verified. You can now access all features.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4 pt-6">
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
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              {email 
                ? `We've sent a verification code to ${email}`
                : "Enter the verification code sent to your email address"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {autoVerifying ? (
              <div className="text-center space-y-4">
                <div className="relative mx-auto w-12 h-12">
                  <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">
                    Auto-verifying your email...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Code detected: <span className="font-mono font-bold">{otp}</span>
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
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
                  <p className="text-sm text-muted-foreground text-center">
                    Check your email for a 6-digit verification code
                  </p>
                </div>

                <div className="space-y-3 pt-6">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Verify Email
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendCode}
                    disabled={isResendDisabled}
                    className="w-full"
                  >
                    {countdown > 0 ? (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        Wait {countdown}s
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
                </div>
              </form>
            )}

            <div className="text-center pt-4 border-t">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 