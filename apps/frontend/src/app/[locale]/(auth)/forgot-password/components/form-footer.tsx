'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';

export function FormFooter() {
  const t = useTranslations('auth');

  return (
    <div className="text-center">
      <Link
        href="/login"
        className="inline-flex items-center text-sm text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t('forgotPassword.backToLogin')}
      </Link>
    </div>
  );
}
