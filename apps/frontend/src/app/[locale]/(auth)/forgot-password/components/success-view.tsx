'use client';

import { CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

interface SuccessViewProps {
  email: string;
}

export function SuccessView({ email }: SuccessViewProps) {
  const t = useTranslations('auth');

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="w-full max-w-md space-y-8 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />

        <div className="space-y-3">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {t('forgotPassword.success.title')}
          </h2>
          <p className="text-base text-muted-foreground">
            {t('forgotPassword.success.description', { email })}
          </p>
        </div>

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        >
          {t('forgotPassword.success.backToLogin')}
        </Link>
      </div>
    </div>
  );
}
