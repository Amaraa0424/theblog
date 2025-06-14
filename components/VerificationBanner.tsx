'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';

const REQUEST_EMAIL_VERIFICATION = gql`
  mutation RequestEmailVerification {
    requestEmailVerification
  }
`;

const VERIFY_EMAIL = gql`
  mutation VerifyEmail($input: EmailVerificationInput!) {
    verifyEmail(input: $input)
  }
`;

export function VerificationBanner() {
  const { data: session, update } = useSession();
  const [isDismissed, setIsDismissed] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [requestVerification, { loading }] = useMutation(REQUEST_EMAIL_VERIFICATION);
  const [verifyEmail, { loading: verifyLoading }] = useMutation(VERIFY_EMAIL);

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

  // Force session update on mount to get latest emailVerified status
  useEffect(() => {
    if (session?.user) {
      update();
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

  // Don't show if user is not logged in, already verified, or banner is dismissed
  if (!session?.user || session.user.emailVerified || isDismissed) {
    return null;
  }

  const handleRequestVerification = async () => {
    try {
      await requestVerification();
      toast.success('Verification email sent! Please check your inbox and click the verification link.');
      setShowVerificationInput(true);
      
      // Start 60-second countdown and store in localStorage
      const timestamp = Date.now();
      setCountdown(60);
      localStorage.setItem('verificationCountdown', JSON.stringify({
        timestamp,
        duration: 60
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send verification email';
      
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

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    try {
      await verifyEmail({
        variables: {
          input: {
            token: verificationCode.trim(),
          },
        },
      });

      toast.success('Email verified successfully!');
      
      // Update the session to reflect the verified status
      await update();
      
      // Clean up
      setShowVerificationInput(false);
      setVerificationCode('');
      localStorage.removeItem('verificationCountdown');
      
      // Force a page refresh to ensure all components get the updated session
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify email');
    }
  };

  const isDisabled = loading || countdown > 0;

  return (
    <Alert className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
      <AlertDescription>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-amber-800 dark:text-amber-200">
                Please verify your email address to create posts and access all features.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRequestVerification}
                disabled={isDisabled}
                className="border-amber-300 text-amber-800 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-200 dark:hover:bg-amber-900 disabled:opacity-50"
              >
                {countdown > 0 ? (
                  <>
                    <Clock className="h-4 w-4 mr-1" />
                    Wait {countdown}s
                  </>
                ) : loading ? (
                  <>
                    <Mail className="h-4 w-4 mr-1" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-1" />
                    Send Verification Email
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDismissed(true)}
                className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {showVerificationInput && (
            <div className="flex items-center gap-2 pt-2 border-t border-amber-200 dark:border-amber-700">
              <div className="flex-1">
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                  Click the link in your email or enter the code manually:
                </p>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="h-9 text-center tracking-widest border-amber-300 focus:border-amber-500 dark:border-amber-600 dark:focus:border-amber-400"
                  maxLength={6}
                />
              </div>
              <Button
                size="sm"
                onClick={handleVerifyCode}
                disabled={verifyLoading || !verificationCode.trim()}
                className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-700 dark:hover:bg-amber-600 mt-6"
              >
                {verifyLoading ? (
                  'Verifying...'
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
} 