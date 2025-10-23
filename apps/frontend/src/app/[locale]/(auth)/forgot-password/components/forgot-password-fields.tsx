'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/auth-context';
import {
  createAuthSchemas,
  type ForgotPasswordFormData,
} from '@/lib/validations/auth';

interface ForgotPasswordFieldsProps {
  onSuccess: (email: string) => void;
}

export function ForgotPasswordFields({ onSuccess }: ForgotPasswordFieldsProps) {
  const t = useTranslations('auth');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { forgotPassword } = useAuth();

  const { forgotPasswordSchema } = createAuthSchemas(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(data.email);
      onSuccess(data.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          {t('forgotPassword.email')}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground transition-colors" />
          <Input
            id="email"
            type="email"
            placeholder={t('forgotPassword.emailPlaceholder')}
            {...register('email')}
            autoComplete="email"
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            className="pl-10 transition-shadow focus:shadow-md"
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-destructive mt-1.5 animate-in fade-in-50"
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full transition-all hover:shadow-md"
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting || isLoading
          ? t('forgotPassword.sending')
          : t('forgotPassword.submit')}
      </Button>

      {error && (
        <div className="text-sm text-destructive text-center animate-in fade-in-50">
          {error}
        </div>
      )}
    </form>
  );
}
