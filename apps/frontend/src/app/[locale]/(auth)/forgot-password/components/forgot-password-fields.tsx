'use client';

import { Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type FieldErrors, type UseFormRegister } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ForgotPasswordFormData } from '@/lib/validations/auth';

interface ForgotPasswordFieldsProps {
  register: UseFormRegister<ForgotPasswordFormData>;
  errors: FieldErrors<ForgotPasswordFormData>;
}

export function ForgotPasswordFields({
  register,
  errors,
}: ForgotPasswordFieldsProps) {
  const t = useTranslations('auth');

  return (
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
      {'email' in errors && errors.email && (
        <p className="text-sm text-destructive">{errors.email?.message}</p>
      )}
    </div>
  );
}
