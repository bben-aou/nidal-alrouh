import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';

export function CommunityGuidelines() {
  const t = useTranslations('community');

  return (
    <section className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {t('guidelines.title')}
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('guidelines.description')}
        </p>
        <Button variant="outline">{t('guidelines.readMore')}</Button>
      </div>
    </section>
  );
}
