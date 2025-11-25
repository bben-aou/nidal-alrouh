import { useTranslations } from 'next-intl';

export function CrisisHero() {
  const t = useTranslations('crisisSupport');

  return (
    <div className="text-center space-y-4">
      <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {t('subtitle')}
      </p>
    </div>
  );
}
