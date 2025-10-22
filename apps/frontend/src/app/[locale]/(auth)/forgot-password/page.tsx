'use client';

import { useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { type ForgotPasswordFormData } from '@/lib/validations/auth';

import { ForgotPasswordForm } from './components/forgot-password-form';
import { SuccessView } from './components/success-view';

export default function ForgotPasswordPage() {
  const { forgotPassword } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await forgotPassword(data.email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error('Forgot password error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return <SuccessView onResend={handleResend} />;
  }

  return (
    <ForgotPasswordForm
      onSubmit={onSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
}
