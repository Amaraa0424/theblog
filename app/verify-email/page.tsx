'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, CheckCircle, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800 dark:text-green-200">
              Email Verified!
            </CardTitle>
            <CardDescription className="text-green-600 dark:text-green-400">
              Your email has been successfully verified. You can now access all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Redirecting you to login page...
            </p>
            <Link href="/login">
              <Button className="w-full">
                Continue to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            {email 
              ? `We've sent a verification code to ${email}`
              : "Enter the verification code sent to your email address"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {autoVerifying ? (
            <div className="text-center space-y-4">
              <div className="animate-spin mx-auto w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                Auto-verifying your email...
              </p>
              <p className="text-sm text-muted-foreground">
                Code detected from email link: <span className="font-mono font-bold">{otp}</span>
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerifyEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-base font-semibold">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="text-center text-lg h-12 border-2 focus:border-primary/50 tracking-widest"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-muted-foreground text-center">
                  Check your email for a 6-digit verification code
                </p>
              </div>

              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold"
                  disabled={verifyLoading}
                >
                  {verifyLoading ? 'Verifying...' : 'Verify Email'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={isResendDisabled}
                  className="w-full h-11 border-2 disabled:opacity-50"
                >
                  {countdown > 0 ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Wait {countdown}s
                    </>
                  ) : requestLoading ? (
                    'Sending...'
                  ) : (
                    'Resend Code'
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 