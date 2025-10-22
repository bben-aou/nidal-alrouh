'use client';

import { useTranslations } from 'next-intl';

export function FormHeader() {
  const t = useTranslations('auth');

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-foreground">
        {t('forgotPassword.title')}
      </h1>
      <p className="text-muted-foreground mt-2">
        {t('forgotPassword.subtitle')}
      </p>
    </div>
  );
}
