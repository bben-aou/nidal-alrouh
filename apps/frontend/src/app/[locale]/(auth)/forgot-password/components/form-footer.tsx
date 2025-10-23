'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export function FormFooter() {
  const t = useTranslations('auth');

  return (
    <div className="text-center">
      <p className="text-sm text-muted-foreground">
        {t('forgotPassword.rememberPassword')}{' '}
        <Link
          href="/login"
          className="text-primary hover:text-primary-dark transition-colors hover:underline"
        >
          {t('forgotPassword.signIn')}
        </Link>
      </p>
    </div>
  );
}
