'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/i18n/navigation';
import {
  createAuthSchemas,
  type ForgotPasswordFormData,
} from '@/lib/validations/auth';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { forgotPasswordSchema } = createAuthSchemas(t);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      // Handle forgot password logic here
      console.log('Forgot password request:', data.email);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            {t('forgotPassword.successTitle')}
          </h1>
          <p className="text-muted-foreground">
            {t('forgotPassword.successMessage')}
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('forgotPassword.backToLogin')}
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            className="w-full"
          >
            {t('forgotPassword.resend')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          {t('forgotPassword.title')}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t('forgotPassword.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('forgotPassword.email')}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder={t('forgotPassword.emailPlaceholder')}
              {...register('email')}
              className="pl-10"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting || isLoading
            ? t('forgotPassword.sending')
            : t('forgotPassword.submit')}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t('forgotPassword.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
