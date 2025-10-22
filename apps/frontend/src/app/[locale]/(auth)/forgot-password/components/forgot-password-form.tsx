'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  createAuthSchemas,
  type ForgotPasswordFormData,
} from '@/lib/validations/auth';

import { ForgotPasswordFields } from './forgot-password-fields';
import { FormFooter } from './form-footer';
import { FormHeader } from './form-header';

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function ForgotPasswordForm({
  onSubmit,
  isLoading,
  error,
}: ForgotPasswordFormProps) {
  const t = useTranslations('auth');
  const { forgotPasswordSchema } = createAuthSchemas(t);

  const { register, handleSubmit, formState } = useForm<ForgotPasswordFormData>(
    {
      resolver: zodResolver(forgotPasswordSchema),
      mode: 'onChange',
    }
  );

  const { errors, isSubmitting } = formState;

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await onSubmit(data);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Form submission failed';
      console.error('Form submission error:', errorMessage);
      // Optionally, if you want to display this error to the user via the `error` prop:
      // setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader />

      <form
        onSubmit={(e) => void handleSubmit(handleFormSubmit)(e)}
        className="space-y-4"
      >
        <ForgotPasswordFields register={register} errors={errors} />

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading
            ? t('forgotPassword.sending')
            : t('forgotPassword.submit')}
        </Button>

        {error && (
          <div className="text-sm text-destructive text-center">{error}</div>
        )}
      </form>

      <FormFooter />
    </div>
  );
}
