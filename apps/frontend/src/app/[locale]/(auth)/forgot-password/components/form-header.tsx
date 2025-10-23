'use client';

import { useTranslations } from 'next-intl';

export function FormHeader() {
  const t = useTranslations('auth');

  return (
    <div className="space-y-2">
      <h2 className="text-3xl font-semibold tracking-tight">
        {t('forgotPassword.title')}
      </h2>
      <p className="text-muted-foreground">{t('forgotPassword.subtitle')}</p>
    </div>
  );
}
