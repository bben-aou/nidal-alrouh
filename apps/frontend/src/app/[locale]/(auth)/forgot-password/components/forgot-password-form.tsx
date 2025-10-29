'use client';

import { type ForgotPasswordFormData } from '@/lib/validations/auth';

import { ForgotPasswordFields } from './forgot-password-fields';
import { FormFooter } from './form-footer';
import { FormHeader } from './form-header';

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading?: boolean;
  error: string | null;
}

export function ForgotPasswordForm({
  onSubmit,
  error,
}: ForgotPasswordFormProps) {
  const handleSuccess = async (email: string) => {
    await onSubmit({ email });
  };

  return (
    <div className="space-y-6">
      <FormHeader />

      <ForgotPasswordFields onSuccess={handleSuccess} />

      {error && (
        <div className="text-sm text-destructive text-center">{error}</div>
      )}

      <FormFooter />
    </div>
  );
}
